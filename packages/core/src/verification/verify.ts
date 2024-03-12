import * as ProofOfAuthorityTemplate from "../templates/Proof-of-Authority.json";
import * as ProofOfSignatureTemplate from "../templates/Proof-of-Signature.json";
import * as ProofOfAgreementTemplate from "../templates/Proof-of-Agreement.json";
import { ProofType, Proof, TypedDataField, ProofMessageTypes } from "../types";

export const ProofTemplates = {
  [ProofType.ProofOfAuthority]: ProofOfAuthorityTemplate,
  [ProofType.ProofOfSignature]: ProofOfSignatureTemplate,
  [ProofType.ProofOfAgreement]: ProofOfAgreementTemplate,
};

export const ProofTypeMap = {
  [ProofOfAuthorityTemplate.primaryType]: ProofType.ProofOfAuthority,
  [ProofOfSignatureTemplate.primaryType]: ProofType.ProofOfSignature,
  [ProofOfAgreementTemplate.primaryType]: ProofType.ProofOfAgreement,
};

/* MAIN */
export function verifyProof(proof: Record<string, any>) {
  //verify proof domain
  verifyDomain(proof);

  //verify proof primary type
  verifyPrimaryType(proof);

  //verify proof message types
  verifyProofMessageTypes(proof);

  //verify proof message
  verifyProofMessage(proof);

  return true;
}

/* Primary verifiers */

function verifyDomain(proof: Proof) {
  const template = ProofOfAuthorityTemplate; //Templates share 'domain' section

  const equalName = equalKeyValue("name", proof.domain, template.domain);
  if (!equalName) {
    throw new Error("Proof name malformed");
  }

  const equalVersion = equalKeyValue("version", proof.domain, template.domain);
  if (!equalVersion) throw new Error("Proof version malformed");

  const equalChainId = equalKeyValue("chainId", proof.domain, template.domain);
  if (!equalChainId) throw new Error("Proof chainId malformed");

  const equalVerifyingContract = equalKeyValue(
    "verifyingContract",
    proof.domain, template.domain
  );
  if (!equalVerifyingContract)
    throw new Error("Proof verifyingContract malformed");

  return equalName && equalVersion && equalChainId && equalVerifyingContract;
}

function verifyPrimaryType(proof: Proof) {
  if (!("primaryType" in proof)) throw new Error("Proof type not specified");

  if (!isValidProofType(proof.primaryType))
    throw new Error("Unrecognized proof type");
}

function verifyProofMessageTypes(proof: Proof) {
  const proofType = getProofType(proof);
  const proofMessageTypes = proof.types;
  const templateMessageTypes = ProofTemplates[proofType].types as Record<
    string,
    TypedDataField[]
  >;

  verifyProofMessageTypesKeys(proofMessageTypes, templateMessageTypes);
  verifyProofMessageTypesValues(proofMessageTypes, templateMessageTypes);

  return true;
}

function verifyProofMessage(proof: Proof) {
  const proofType = getProofType(proof);

  if (!("message" in proof)) throw new Error("No message in proof");
  const message = proof.message;
  const templateMessage = ProofTemplates[proofType].message;

  const messageKeys = Object.keys(message);
  const templateMessageKeys = Object.keys(templateMessage);

  const areKeysEqual = sameKeyNames(messageKeys, templateMessageKeys);
  if (!areKeysEqual) throw new Error("Malformed Proof message keys");

  //verify proof message value types = proof message types
  verifyProofMessageValues(proof);
  return true;
}

/* Secondary verifiers */
function verifyProofMessageTypesKeys(
  proofTypes: ProofMessageTypes,
  templateTypes: ProofMessageTypes
) {
  const proofTypesKeys = Object.keys(proofTypes);
  const templateTypesKeys = Object.keys(templateTypes);

  const isSameTypeKeyLength = equalArrLength(proofTypesKeys, templateTypesKeys);
  if (!isSameTypeKeyLength) throw new Error("Length of type's is not equal");

  const isSameKeyNames = sameKeyNames(proofTypesKeys, templateTypesKeys);
  if (!isSameKeyNames) throw new Error("Proof type values mismatch");

  return isSameTypeKeyLength && isSameKeyNames;
}

function verifyProofMessageTypesValues(
  proofTypes: ProofMessageTypes,
  templateTypes: ProofMessageTypes
) {
  const templateTypesKeys = Object.keys(templateTypes);

  return templateTypesKeys.every((type) =>
    isEqualTypedDataFields(templateTypes[type], proofTypes[type])
  );
}

function verifyTypedDataFields(
  proofTypedDataFields: TypedDataField[],
  templateTypedDataFields: TypedDataField[]
) {
  return proofTypedDataFields.every((pfield) => {
    const tfield = templateTypedDataFields.find(
      (tfield) => tfield.name === pfield.name
    )!;

    const isValidKeys = isValidTypedDataFieldKeys(pfield, tfield);
    if (!isValidKeys) throw new Error(`Not valid proof field ${pfield.name}`);

    const isValidValues = isValidTypedDataFieldValue(pfield, tfield);
    if (!isValidValues) throw new Error(`Not valid proof field ${pfield.name}`);

    return true;
  });
}

function verifyProofMessageValues(proof: Proof) {
  const proofTypes = proof.types as Record<string, TypedDataField[]>;
  const proofMessage = proof.message as Record<string, any>;
  const proofPrimaryType = proof.primaryType as Record<string, any>;

  if (!proofTypes || !proofMessage || !proofPrimaryType)
    throw new Error("Proof Malformed");

  verifyPrimaryType(proof);
  const primaryType = proof.primaryType;

  const primaryTypeFields = proofTypes[primaryType] as TypedDataField[];
  const messageKeys = Object.keys(proofMessage);

  const isSameTypeKeyLength = equalArrLength(messageKeys, primaryTypeFields);
  if (!isSameTypeKeyLength)
    throw new Error("Length of proof's primary type's is not equal");

  const isSameKeyNames = primaryTypeFields.every((field) =>
    messageKeys.some((mk) => mk === field.name)
  );

  if (!isSameKeyNames) throw new Error("Proof message values mismatch");

  return primaryTypeFields.every((field) => {
    const name = field.name;
    const type = field.type;
    const messageValue = proofMessage[name];
    return verifyValueType(type, messageValue, proofTypes);
  });
}

/* TYPED DATA verification */

function verifyValueType(
  type: string,
  value: any,
  messageTypes: Record<string, TypedDataField[]>
) {
  if (isArrayType(type)) {
    (value as any[]).every((val: any) => {
       return verifyValueType(type.replace("[]", ""), val, messageTypes)
      }
    );
  } else if (isSimpleType(type)) {
    verifySimpleValueType(type, value);
  } else if (isCustomType(type, messageTypes)) {
    verifyCustomValueType(type, value, messageTypes);
  } else {
    throw new Error(`Unrecognized value ${type}::${value}`);
  }
  return true;
}

function verifySimpleValueType(type: string, value: string) {
  switch (type) {
    case "address": {
      //TODO
      return value.length >= 132;
    }
    default:
      return true;
  }
}

function verifyCustomValueType(
  type: string,
  value: Record<string, any>,
  messageTypes: Record<string, TypedDataField[]>
) {
  if (!(type in messageTypes))
    throw new Error(`No ${type} type in Message Types`);
  const typeFields = messageTypes[type];

  return typeFields.every((field) => {
    const name = field.name;
    const type = field.type;
    const messageValue = value[name];
    verifyValueType(type, messageValue, messageTypes);
  });
}

/* UTIL */
function getProofType(proof: Proof) {
  return ProofTypeMap[proof.primaryType];
}

function isValidProofType(primaryType: string) {
  return primaryType in ProofTypeMap;
}

function isEqualTypedDataFields(
  proofTypedDataFields: TypedDataField[],
  templateTypedDataFields: TypedDataField[]
) {
  const isEqualTypedDataLength = equalArrLength(
    proofTypedDataFields,
    templateTypedDataFields
  );
  if (!isEqualTypedDataLength) return false;

  verifyTypedDataFields(proofTypedDataFields, templateTypedDataFields);

  return;
}

function isValidTypedDataFieldValue(
  proofTypedDataField: TypedDataField,
  templateTypedDataField: TypedDataField
) {
  return (
    proofTypedDataField.name === templateTypedDataField.name &&
    proofTypedDataField.type === templateTypedDataField.type
  );
}

function isValidTypedDataFieldKeys(
  proofField: TypedDataField,
  templateField: TypedDataField
) {
  const proofKeys = Object.keys(proofField);
  const templateKeys = Object.keys(templateField);
  const equalLength = templateKeys.length === proofKeys.length;

  return equalLength && sameKeyNames(templateKeys, proofKeys);
}

function equalArrLength(a: any[], b: any[]) {
  return a.length === b.length;
}

function sameKeyNames(a: string[], b: string[]) {
  return a.every((k) => b.some((mk) => mk === k));
}

function equalKeyValue(
  key: string,
  a: Record<string, any>,
  b: Record<string, any>
) {
  return key in a && key in b && a[key] === b[key];
}

function isArrayType(value: string) {
  return value.endsWith("[]");
}

function isSimpleType(type: string) {
  const simpleTypes = ["string", "address", "uint256", "bytes32"];
  return simpleTypes.some((t) => t === type);
}

function isCustomType(
  type: string,
  messageTypes: Record<string, TypedDataField[]>
) {
  return type in messageTypes;
}
