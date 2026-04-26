import { z } from "zod";

const electricityPayload = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(80).optional().default(""),
  region: z.string().min(1).max(100),
  district: z.string().max(200).optional().default(""),
  category: z.string().min(1).max(100),
  description: z.string().min(10).max(8000),
});

const taxPayload = z
  .object({
    name: z.string().max(200).optional().default(""),
    email: z.string().max(320).optional().default(""),
    phone: z.string().max(80).optional().default(""),
    category: z.string().min(1).max(200),
    entityName: z.string().max(300).optional().default(""),
    entityType: z.string().max(200).optional().default(""),
    violationDescription: z.string().min(10).max(12000),
    evidence: z.string().max(12000).optional().default(""),
    anonymous: z.boolean(),
  })
  .refine((d) => d.anonymous || z.string().email().safeParse(d.email).success, {
    message: "email_invalid",
    path: ["email"],
  });

export const publicFormSubmissionBodySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("ELECTRICITY_COMPLAINT"), data: electricityPayload }),
  z.object({ kind: z.literal("TAX_WHISTLEBLOWER"), data: taxPayload }),
]);

export type PublicFormSubmissionInput = z.infer<typeof publicFormSubmissionBodySchema>;

export function parsePublicFormSubmissionBody(raw: unknown) {
  return publicFormSubmissionBodySchema.safeParse(raw);
}
