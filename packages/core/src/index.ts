import {
  ProofOfAuthorityVariables,
  ProofOfSignatureVariables,
  ProofOfAgreementVariables,
  SignedProofVariables,
} from "./types";
import {default as ProofOfAuthorityTemplate} from "./templates/signature/Proof-of-Authority.json";
import {default as ProofOfSignatureTemplate} from "./templates/signature/Proof-of-Signature.json";
import {default as ProofOfAgreementTemplate} from "./templates/signature/Proof-of-Agreement.json";
import {default as SignedProofTemplate} from "./templates/proof/Signed-Proof.json";
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

export function createSignedProofPayload(args: SignedProofVariables) {
  return signedProofTemplate(args);
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

function signedProofTemplate(args: SignedProofVariables) {
  return overrideParsedValues(SignedProofTemplate, args);
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
  const variables = { ...args, timestamp: Date.now() };

  return overrideParsedValues(ProofOfAgreementTemplate, variables);
}

export { hash };
