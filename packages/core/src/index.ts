import {
  ProofOfAuthorityVariables,
  ProofOfSignatureVariables,
  ProofOfAgreementVariables,
  ProofOfAuthorityIPFSVariables,
  ProofOfSignatureIPFSVariables,
  ProofOfAgreementIPFSVariables,
} from "./types";
import * as ProofOfAuthorityTemplate from "./templates/signature/Proof-of-Authority.json";
import * as ProofOfSignatureTemplate from "./templates/signature/Proof-of-Signature.json";
import * as ProofOfAgreementTemplate from "./templates/signature/Proof-of-Agreement.json";
import * as ProofOfAuthorityTemplateIPFS from "./templates/proof/Proof-of-Authority.json";
import * as ProofOfSignatureTemplateIPFS from "./templates/proof/Proof-of-Signature.json";
import * as ProofOfAgreementTemplateIPFS from "./templates/proof/Proof-of-Agreement.json";
import { overrideParsedValues } from "./utils";
import { hash } from "./hash";

export function createProofOfAuthorityPayload(args: ProofOfAuthorityVariables) {
  return proofOfAuthorityTemplate(args);
}

export function createProofOfSignaturePayload(args: ProofOfSignatureVariables) {
  return proofOfSignatureTemplate(args);
}

export function createProofOfAgreementPayload(args: ProofOfAgreementVariables) {
  return proofOfAgreementTemplate(args);
}

export function createProofOfAuthorityIPFSPayload(args: ProofOfAuthorityIPFSVariables) {
  return proofOfAuthorityIPFSTemplate(args);
}

export function createProofOfSignatureIPFSPayload(args: ProofOfSignatureIPFSVariables) {
  return proofOfSignatureIPFSTemplate(args);
}

export function createProofOfAgreementIPFSPayload(args: ProofOfAgreementIPFSVariables) {
  return proofOfAgreementIPFSTemplate(args);
}

export function createSignedProof(
  message: Record<string, unknown>,
  proofCID: string,
  signature = "0x"
) {
  return {
    message,
    proofCID,
    signature,
  };
}

function proofOfAuthorityIPFSTemplate(args: ProofOfAuthorityIPFSVariables) {
  const signers = args.data.signers.map((address) => ({
    addr: address,
    metadata: "{}",
  }));

  const variables = {
    ...args,
    signers,
    timestamp: Date.now(),
  };

  return overrideParsedValues(ProofOfAuthorityTemplateIPFS, variables);
}

function proofOfSignatureIPFSTemplate(args: ProofOfSignatureIPFSVariables) {
  const variables = { ...args, timestamp: Date.now() };
  return overrideParsedValues(ProofOfSignatureTemplateIPFS, variables);
}

function proofOfAgreementIPFSTemplate(args: ProofOfAgreementIPFSVariables) {
  const signatureCIDs = args.data.agreementSignProofs.map((signatureCID) => ({ proofCID: signatureCID }))

  const variables = { ...args, timestamp: Date.now(), agreementSignProofs: signatureCIDs };

  return overrideParsedValues(ProofOfAgreementTemplateIPFS, variables);
}

function proofOfAuthorityTemplate(args: ProofOfAuthorityVariables) {
  const signers = args.signers.map((address) => ({
    addr: address,
    metadata: "{}",
  }));

  const variables = {
    ...args,
    signers,
    timestamp: Date.now(),
  };

  return overrideParsedValues(ProofOfAuthorityTemplate, variables);
}

function proofOfSignatureTemplate(args: ProofOfSignatureVariables) {
  const variables = { ...args, timestamp: Date.now() };
  return overrideParsedValues(ProofOfSignatureTemplate, variables);
}

function proofOfAgreementTemplate(args: ProofOfAgreementVariables) {
  const signatureCIDs = args.agreementSignProofs.map((signatureCID) => ({ proofCID: signatureCID }))

  const variables = { ...args, timestamp: Date.now(), agreementSignProofs: signatureCIDs };

  return overrideParsedValues(ProofOfAgreementTemplate, variables);
}

export { hash };
