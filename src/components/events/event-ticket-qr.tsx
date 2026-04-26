"use client";

import QRCode from "react-qr-code";

export function EventTicketQr({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <QRCode value={value} size={200} className="mx-auto" />
      <p className="mt-2 text-lg font-mono font-semibold tracking-wider text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
