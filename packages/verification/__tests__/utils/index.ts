import * as path from "path";
import * as fs from "fs";

export function getValidCertificate() {
  const filePath = path.resolve(__dirname, "files/valid.pdf");
  const file = fs.readFileSync(filePath);
  return file;
}

export function getUnstoredValidCertificate() {
  const filePath = path.resolve(__dirname, "files/valid_unstored.pdf");
  const file = fs.readFileSync(filePath);
  return file;
}

export function getInvalidCIDCertificate() {
  const filePath = path.resolve(__dirname, "files/invalid_CID.pdf");
  const file = fs.readFileSync(filePath);
  return file;
}

export function getInvalidCertificate() {
  const filePath = path.resolve(__dirname, "files/invalid.pdf");
  const file = fs.readFileSync(filePath);
  return file;
}
