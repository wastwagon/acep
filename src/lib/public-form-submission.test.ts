import { describe, expect, it } from "vitest";
import { parsePublicFormSubmissionBody } from "./public-form-submission";

describe("parsePublicFormSubmissionBody", () => {
  it("accepts a valid electricity complaint", () => {
    const r = parsePublicFormSubmissionBody({
      kind: "ELECTRICITY_COMPLAINT",
      data: {
        name: "A User",
        email: "a@example.com",
        phone: "",
        region: "Greater Accra",
        district: "Accra",
        category: "Power Outage",
        description: "Ten chars min description here ok.",
      },
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.kind).toBe("ELECTRICITY_COMPLAINT");
  });

  it("rejects electricity with short description", () => {
    const r = parsePublicFormSubmissionBody({
      kind: "ELECTRICITY_COMPLAINT",
      data: {
        name: "A",
        email: "a@b.co",
        region: "X",
        category: "Other",
        description: "short",
      },
    });
    expect(r.success).toBe(false);
  });

  it("accepts anonymous tax whistleblower without email", () => {
    const r = parsePublicFormSubmissionBody({
      kind: "TAX_WHISTLEBLOWER",
      data: {
        anonymous: true,
        email: "",
        category: "Tax evasion",
        violationDescription: "Detailed violation text at least ten.",
      },
    });
    expect(r.success).toBe(true);
  });

  it("requires valid email when not anonymous", () => {
    const r = parsePublicFormSubmissionBody({
      kind: "TAX_WHISTLEBLOWER",
      data: {
        anonymous: false,
        email: "not-an-email",
        category: "Fraud",
        violationDescription: "Detailed violation text at least ten.",
      },
    });
    expect(r.success).toBe(false);
  });
});
