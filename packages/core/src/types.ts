import * as ProofOfAuthorityTemplate from "./templates/proof/Proof-of-Authority.json";
import * as ProofOfSignatureTemplate from "./templates/proof/Proof-of-Signature.json";
import * as ProofOfAgreementTemplate from "./templates/proof/Proof-of-Agreement.json";

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

export interface ProofOfAuthorityIPFSVariables {
  sig: string;
  address: string;
  data: ProofOfAuthorityVariables;
}

export interface ProofOfSignatureIPFSVariables {
  sig: string;
  address: string;
  data: ProofOfSignatureVariables;
}

export interface ProofOfAgreementIPFSVariables {
  sig: string;
  address: string;
  data: ProofOfAgreementVariables;
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
