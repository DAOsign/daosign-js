const path = require("path");
const fs = require("fs");

function getValidCertificate() {
  const filePath = path.resolve(__dirname, "files/valid.pdf");
  const file = fs.readFileSync(filePath);
  return file;
}

function getInvalidCertificate() {
  const filePath = path.resolve(__dirname, "files/invalid.pdf");
  const file = fs.readFileSync(filePath);
  return file;
}

module.exports = {
  getValidCertificate,
  getInvalidCertificate,
};
