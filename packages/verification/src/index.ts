import { PDFDocument } from "pdf-lib";
import { hash } from "@daosign/core/src/index";
import IPFSProofService from "./services/ipfs";
import { existsInStorage } from "./storage";

export async function verifyCertificateBytes(pdfBytes: Buffer) {
  const IPFSService = new IPFSProofService();
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

  await IPFSService.verifyProofs(agreementProofCID);

  const fileCID = await hash(pdfBytes);

  const isStored = await existsInStorage(fileCID);
  if (!isStored) {
    throw new Error("Provided file is not stored");
  }

  return true;
}
