import { PDFDocument } from "pdf-lib";
import { hash } from "../../core/src";

export async function verifyCertificateBytes(pdfBytes: Buffer) {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const pdfSubject = pdfDoc.getSubject();

  if (!pdfSubject) {
    throw new Error("Provided file is not a DAOsign certificate");
  }

  let parsed;
  try {
    parsed = JSON.parse(pdfSubject);
  } catch (e) {
    throw new Error("Error parsing PDF metadata");
  }

  const agreementProofCID = parsed.agreementProofCID;
  if (!agreementProofCID) {
    throw new Error("Provided file is not a DAOsign certificate");
  }

  console.log("AuthorityCID:", agreementProofCID);

  const fileCID = await hash(pdfBytes);
  console.log("FileCID:", fileCID);

  return true;
}
