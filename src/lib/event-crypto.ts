import { createHash, randomBytes, randomInt } from "node:crypto";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function hashToken(plain: string) {
  return createHash("sha256").update(plain).digest("hex");
}

export function randomUrlToken() {
  return randomBytes(32).toString("base64url");
}

export function generateCheckInCode(): string {
  let s = "";
  for (let i = 0; i < 8; i += 1) {
    s += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  }
  return s;
}
