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
