/** One CSV field (RFC-style quoting when needed). */
export function csvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const s = String(value);
  if (s === "") return '""';
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function csvLine(fields: (string | number | null | undefined)[]): string {
  return fields.map((f) => csvField(f)).join(",") + "\r\n";
}
