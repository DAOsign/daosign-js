import { verifyCertificateBytes } from "../src";
import {
  getValidCertificate,
  getInvalidCertificate,
  getUnstoredValidCertificate,
} from "./utils";
import { expect, describe, it } from "@jest/globals";

describe("Verification module verifies", () => {
  it("Verifies valid certificate", async () => {
    const certificateBytes = getValidCertificate();

    await expect(
      verifyCertificateBytes(certificateBytes)
    ).resolves.toBeTruthy();
  });

  it("Throws error for unstored certificate", async () => {
    const certificateBytes = getUnstoredValidCertificate();

    await expect(
      async () => await verifyCertificateBytes(certificateBytes)
    ).rejects.toThrow("Provided file is not stored");
  });

  it("Throws error for invalid certificate", async () => {
    const certificateBytes = getInvalidCertificate();

    await expect(
      async () => await verifyCertificateBytes(certificateBytes)
    ).rejects.toThrow("Provided file is not a DAOsign certificate");
  });
});
