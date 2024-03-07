import {
  ProofOfAuthorityVariables,
  ProofOfSignatureVariables,
  ProofOfAgreementVariables,
} from "./types";
import * as ProofOfAuthorityTemplate from "./templates/Proof-of-Authority.json";
import * as ProofOfSignatureTemplate from "./templates/Proof-of-Signature.json";
import * as ProofOfAgreementTemplate from "./templates/Proof-of-Agreement.json";
import { overrideParsedValues } from "./utils";
import { hash } from "./hash";

export function createProofOfAuthorityPayload(args: ProofOfAuthorityVariables) {
  return proofOfAuthorityTempate(args);
}

export function createProofOfSignaturePayload(args: ProofOfSignatureVariables) {
  return proofOfSignatureTemplate(args);
}

export function createProofOfAgreementPayload(args: ProofOfAgreementVariables) {
  return proofOfAgreementTemplate(args);
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

function proofOfAuthorityTempate(args: ProofOfAuthorityVariables) {
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
  const variables = { ...args, timestamp: Date.now() };
  return overrideParsedValues(ProofOfAgreementTemplate, variables);
}

export { hash };
