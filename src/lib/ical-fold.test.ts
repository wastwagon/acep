import { describe, expect, it } from "vitest";
import { foldIcsLine } from "./ical-fold";

describe("foldIcsLine", () => {
  it("leaves short lines unchanged", () => {
    expect(foldIcsLine("SUMMARY:ACEP forum")).toBe("SUMMARY:ACEP forum");
  });

  it("folds a long ASCII line to at most 75 octets per part", () => {
    const val = "x".repeat(200);
    const line = `DESCRIPTION:${val}`;
    const out = foldIcsLine(line);
    const parts = out.split("\r\n");
    expect(parts.length).toBeGreaterThan(1);
    for (const p of parts) {
      expect(new TextEncoder().encode(p).length).toBeLessThanOrEqual(75);
    }
    // Unfold per RFC: drop CRLF+single leading space of continuation
    const unfolded = parts[0] + parts.slice(1).map((c) => c.replace(/^\s/, "")).join("");
    expect(unfolded).toBe(line);
  });
});
