/**
 * RFC 5545 line folding: max 75 octets per line, CRLF + one space for continuation.
 */

function fitUtf8End(buf: Uint8Array, start: number, end: number): number {
  if (end <= start) return start + 1;
  const td = new TextDecoder("utf-8", { fatal: true });
  let e = end;
  while (e > start) {
    try {
      td.decode(buf.subarray(start, e));
      return e;
    } catch {
      e -= 1;
    }
  }
  return start + 1;
}

/**
 * Folds a single iCalendar content line (property name, colon, and value) to ≤75 octets per part.
 */
export function foldIcsLine(line: string): string {
  const te = new TextEncoder();
  const buf = te.encode(line);
  if (buf.length <= 75) {
    return line;
  }
  const parts: string[] = [];
  const td = new TextDecoder();
  let i = 0;
  const firstEnd = fitUtf8End(buf, i, Math.min(75, buf.length));
  parts.push(td.decode(buf.subarray(i, firstEnd)));
  i = firstEnd;
  while (i < buf.length) {
    const chunkEnd = fitUtf8End(buf, i, Math.min(i + 74, buf.length));
    const seg = new Uint8Array(1 + (chunkEnd - i));
    seg[0] = 0x20;
    seg.set(buf.subarray(i, chunkEnd), 1);
    parts.push(td.decode(seg));
    i = chunkEnd;
  }
  return parts.join("\r\n");
}
