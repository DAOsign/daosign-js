const { verifyCertificateBytes } = require("../dist");
const { getValidCertificate, getInvalidCertificate } = require("./utils");

describe("Verification module verifies", () => {
  test("Verifies valid certificate", async () => {
    const certificateBytes = getValidCertificate();
    const isValid = await verifyCertificateBytes(certificateBytes);

    expect(isValid).toBe(true);
  });

  test("Throws error for invalid certificate", async () => {
    const certificateBytes = getInvalidCertificate();
    try {
      await verifyCertificateBytes(certificateBytes);
    } catch (e) {
      expect(e.message).toBe("Provided file is not a DAOsign certificate");
    }
  });
});
