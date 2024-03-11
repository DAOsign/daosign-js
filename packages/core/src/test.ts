import { verifyProof } from './verification/verify';
import { ProofType } from './types';
import {expect, jest, test, describe, it} from '@jest/globals';


// Примеры шаблонов, которые уже предоставлены
import * as ProofOfAuthorityTemplate from './templates/Proof-of-Authority.json';
import * as ProofOfSignatureTemplate from './templates/Proof-of-Signature.json';
import * as ProofOfAgreementTemplate from './templates/Proof-of-Agreement.json';

describe('verifyProof', () => {
  it('should verify a correct ProofOfAuthority proof', () => {
    const proof = {
      ...ProofOfAuthorityTemplate,
      message: {
        ...ProofOfAuthorityTemplate.message,
        from: '0x0000000000000000000000000000000000000001', // предположим, что это валидный адрес
        agreementCID: 'QmNNDiywA3KVUNYUCvHEQY1nC3XB5rcmXAMiwe9EpFZYVE',
        signers: [{
          "addr": "0xb1ff285b5e42cd2a0abf67e4552cf5a6986edba4",
          "metadata": "{111}"
        }],
        timestamp: '1609459200', // Замените на корректный timestamp
        metadata: '{}'
      }
    };

    expect(() => verifyProof(proof)).not.toThrow();
  });

  it('should verify a correct ProofOfSignature proof', () => {
    const proof = {
      ...ProofOfSignatureTemplate,
      message: {
        ...ProofOfSignatureTemplate.message,
        authorityCID: "QmNNDiywA3KVUNYUCvHEQY1nC3XB5rcmXAMiwe9EpFZYVE",
        name: "Proof-of-Signature",
        signer: "0xb1ff285b5e42cd2a0abf67e4552cf5a6986edba4",
        app: "daosign",
        timestamp: 1708961095857,
        metadata: {}
      }
    };

    expect(() => verifyProof(proof)).not.toThrow();
  });

  it('should verify a correct ProofOfSignature proof', () => {
    const proof = {
      ...ProofOfAuthorityTemplate,
      message: {
        ...ProofOfAuthorityTemplate.message,
        name: "Proof-of-Authority",
        from: "0xb1ff285b5e42cd2a0abf67e4552cf5a6986edba4",
        agreementCID: "QmdUvtwa3N2BrjVhQ6uTcD3LLQXbhMiPFYMsBxeXMpHBBt",
        signers: [
          {
            addr: "0xb1ff285b5e42cd2a0abf67e4552cf5a6986edba4",
            metadata: {}
          }
        ],
        app: "daosign",
        timestamp: 1708961088444,
        metadata: {}
      }
    };

    expect(() => verifyProof(proof)).not.toThrow();
  });

  it('should throw an error for a proof with incorrect domain name', () => {
    const invalidProof = {
      ...ProofOfAuthorityTemplate,
      domain: {
        ...ProofOfAuthorityTemplate.domain,
        name: 'invalidName',
      }
    };

    expect(() => verifyProof(invalidProof)).toThrow('Proof name malformed');
  });

  it('fails verifying ProofOfAgreement with invalid types data', () => {
    const proof = {
      ...ProofOfAgreementTemplate,
      types: {
        ProofOfAgreement: [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "from",
            "type": "address"
          },
          {
            "name": "agreementCID",
            "type": "string"
          },
          {
            "name": "signers",
            "type": "Signer[]"
          },
          {
            "name": "app",
            "type": "string"
          }
        ]
      }
    };

    expect(() => verifyProof(proof)).toThrow('Proof type values mismatch');
  });


  // Добавьте здесь больше тестов для других некорректных кейсов
});