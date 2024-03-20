### Daosign Core

# DAOsign Core

This core package includes basic functional to create, validate both signing proof payload and proof itself.

## Usage

To use, follow these steps:

1. Install core package:
   ```
   npm install @daosign/cre
   ```

2. Import create payload function:
   ```
   import { createProofOfAuthorityPayload } from "@daosign/core"
   ```

## Example

Example usage:

```
import { createProofOfAuthorityPayload, createSignedProof } from "@daosign/core"

//create payload
function createPayload(signer ,agreementCID, agreementSigners) {
    const payload = createProofOfAuthorityPayload({from: signer, agreementCID: agreementCID, signers: agreementSigners});
    return payload;
}

function createSignedProof(signer, signingPayload, signature){
  const signedPayload = { address:signer, data: signingPayload, sig: signature};
  const proofPayload = createSignedProofPayload(signedPayload);
  return proofPayload;
}

```
