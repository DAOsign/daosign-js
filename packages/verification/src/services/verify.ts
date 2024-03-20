import IPFSProofService from "./ipfs";
import { ProofOfAgreementIPFSVariables, SignedProofVariables } from "@daosign/core/src/types";
import { verifyAgreementProof, verifyProof } from "@daosign/core/src/verification/verify";

export default class VerifyProofService {
  IPFSService: IPFSProofService
  constructor() {
    this.IPFSService = new IPFSProofService();
  }


  async verifyProofs(agreementProofCID: string) {
    const agreementProofs = await this.IPFSService.getFileProofs(agreementProofCID);

    this.verifyAuthorityProof(agreementProofs.authorityProof);
    this.verifySignatureProofs(agreementProofs.signatureProofs);
    this.verifyAgreementProof(agreementProofs.agreementProof);

    return true;
  }

  verifyAuthorityProof(authorityProof: SignedProofVariables) {
    return verifyProof(authorityProof.data);
  }

  verifySignatureProofs(signatureProofs: SignedProofVariables[]) {
    signatureProofs.forEach((proof) => verifyProof(proof.data));
    return true;
  }

  verifyAgreementProof(agreementProof: ProofOfAgreementIPFSVariables) {
    return verifyAgreementProof(agreementProof);
  }
}