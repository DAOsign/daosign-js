import * as ProofOfAuthorityTemplate from "./templates/Proof-of-Authority.json";
import * as ProofOfSignatureTemplate from "./templates/Proof-of-Signature.json";
import * as ProofOfAgreementTemplate from "./templates/Proof-of-Agreement.json";

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
  authorityCID: string;
  signatureCIDs: string[];
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
  ProofOfAgreement,
}

export type ProofMessageTypes = Record<string, TypedDataField[]>;
