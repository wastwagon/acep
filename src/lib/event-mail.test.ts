import { describe, expect, it } from "vitest";
import { __testMail } from "./event-mail";

describe("event-mail escaping", () => {
  it("escapes html entities in escapeHtml", () => {
    expect(__testMail.escapeHtml(`a<b>&"`)).toBe("a&lt;b&gt;&amp;&quot;");
  });
});
