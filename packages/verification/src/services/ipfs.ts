import axios, {Axios} from "axios"
import { ProofOfAgreementIPFSVariables, SignedProofVariables } from "@daosign/core/src/types";

export default class IPFSProofService {
  private fetcher: Axios;

  constructor() {
    this.fetcher = axios.create({ baseURL: "https://daosign.mypinata.cloud" });
  }

  private async getIPFSProof(CID: string): Promise<any> {
    return this.fetcher.get(`ipfs/${CID}`, { responseType: 'arraybuffer' }).then((res) => {
      console.log(JSON.parse(res.data.toString()))
      return JSON.parse(res.data.toString())
    }).catch((e) => e);
  }

  private async getSignatureProofsArray(signatureProofCIDs: string[]): Promise<SignedProofVariables[]> {
    const signatureProofs = signatureProofCIDs.map(async (proofCID) => await this.getIPFSProof(proofCID));
    return Promise.all(signatureProofs);
  }

  async getFileProofs(agreementProofCID: string) {
    const agreementProof = await this.getIPFSProof(agreementProofCID) as ProofOfAgreementIPFSVariables;
    console.log(agreementProof)
    const signatureProofs = await this.getSignatureProofsArray(agreementProof.agreementSignProofs.map((item) => item.proofCID));
    const authorityProof = await this.getIPFSProof(agreementProof.agreementFileProofCID) as SignedProofVariables;

    return { authorityProof, signatureProofs, agreementProof }
  }
}