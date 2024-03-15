import * as ProofOfAuthorityTemplate from "./templates/signature/Proof-of-Authority.json";
import * as ProofOfSignatureTemplate from "./templates/signature/Proof-of-Signature.json";
import * as ProofOfAgreementTemplate from "./templates/signature/Proof-of-Agreement.json";

export interface ProofOfAuthorityVariables {
  from: string;
  agreementCID: string;
  signers: string[];
}

export interface ProofOfSignatureVariables {
  authorityCID: string;
  signer: string;
}

export interface ProofOfAgreementVariables {
  agreementFileProofCID: string;
  agreementSignProofs: ProofOfAgreementItemVariables[];
}

interface ProofOfAgreementItemVariables {
  proofCID: string;
}

export interface SignedProofVariables {
  sig: string;
  address: string;
  data: Record<string, any>;
}

export type Proof = Record<string, any>;

export type Template =
  | typeof ProofOfAgreementTemplate
  | typeof ProofOfAuthorityTemplate
  | typeof ProofOfSignatureTemplate;

export interface TypedDataField {
  name: string;
  type: string;
}

export enum ProofType {
  ProofOfAuthority,
  ProofOfSignature,
  // ProofOfAgreement,
}

export type ProofMessageTypes = Record<string, TypedDataField[]>;
