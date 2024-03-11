# DAOsign Vertification Tool

This verification tool is designed to verify DAOsign certificate.

## Usage

To user, follow these steps:

1. Install veritifcation tool:
   `npm install @daosign/verification`

2. Import verify function:
   `import { verifyCertificateBytes } from "@daosign/verification"`

3. Pass Certificate file bytes to verify function
   `function verify(file) {
    return verifyCertificateBytes(bytes);
}`

## Example

Example usage:

`
import fs from "fs";
import { verifyCertificateBytes } from "@daosign/verification"

async function validate(filePath) {
    const file = fs.readFileSync(filePath);
    return await verifyCertificateBytes(file);
}
`
