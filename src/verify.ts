import * as ProofOfAuthorityTemplate from "./templates/Proof-of-Authority.json";
import * as ProofOfSignatureTemplate from "./templates/Proof-of-Signature.json";
import * as ProofOfAgreementTemplate from "./templates/Proof-of-Agreement.json";
import { ProofType, Proof, TypedDataField, ProofMessageTypes } from "./types";

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

  //verify proof primary type
  verifyPrimaryType(proof);
  const proofType = getProofType(proof);

  //verify proof types
  verifyProofTypes(proofType, proof.types);

  //verify message
  return true;
}

/* Primary verifiers */
function verifyPrimaryType(proof: Proof) {
  if (!("primaryType" in proof)) {
    throw new Error("Proof type not specified");
  }

  if (!isValidProofType(proof.primaryType)) {
    throw new Error("Unrecognized proof type");
  }
}

function verifyProofTypes(
  proofType: ProofType,
  proofMessageTypes: Record<string, TypedDataField[]>
) {
  const templateMessageTypes = ProofTemplates[proofType].types as Record<
    string,
    TypedDataField[]
  >;

  verifyProofMessageTypesKeys(proofMessageTypes, templateMessageTypes);
  verifyProofMessageTypesValues(proofMessageTypes, templateMessageTypes);

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
  if (!isSameTypeKeyLength) throw new Error("Proof type values mismatch");
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

    const isValidValues = !isValidTypedDataFieldValue(pfield, tfield);
    if (!isValidValues) throw new Error(`Not valid proof field ${pfield.name}`);

    return true;
  });
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
