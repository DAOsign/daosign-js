import axios, {Axios} from "axios"
import { ProofOfAgreementIPFSVariables, SignedProofVariables } from "@daosign/core/src/types";
import { verifyAgreementProof, verifyProof } from "@daosign/core/src/verification/verify";

export default class IPFSProofService {
  private fetcher: Axios;

  constructor() {
    this.fetcher = axios.create({ baseURL: "https://daosign.mypinata.cloud" });
  }

  private async getIPFSProof(CID: string): Promise<any> {
    return this.fetcher.get(`ipfs/${CID}`, { responseType: 'arraybuffer' }).then((res) => JSON.parse(res.data.toString())).catch((e) => e);
  }

  private async getSignatureProofsArray(signatureProofCIDs: string[]): Promise<SignedProofVariables[]> {
    const signatureProofs = signatureProofCIDs.map(async (proofCID) => await this.getIPFSProof(proofCID));
    return Promise.all(signatureProofs);
  }

  async getFileProofs(agreementProofCID: string) {
    const agreementProof = await this.getIPFSProof(agreementProofCID) as ProofOfAgreementIPFSVariables;
    const signatureProofs = await this.getSignatureProofsArray(agreementProof.agreementSignProofs.map((item) => item.proofCID));
    const authorityProof = await this.getIPFSProof(agreementProof.agreementFileProofCID) as SignedProofVariables;

    return { authorityProof, signatureProofs, agreementProof }
  }

  async verifyProofs(agreementProofCID: string) {
    const agreementProofs = await this.getFileProofs(agreementProofCID);

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