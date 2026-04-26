"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EventCheckinPanel({ eventId }: { eventId: string }) {
  const reactId = useId();
  const readerId = `checkin-qr-${eventId.replace(/[^a-zA-Z0-9]/g, "")}-${reactId.replace(/:/g, "")}`;
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState<null | { kind: "attendee" | "exhibitor"; name: string; already: boolean }>(null);
  const [scanning, setScanning] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const scannerRef = useRef<{ stop: () => Promise<unknown>; clear: () => void } | null>(null);
  const decodeLockRef = useRef(false);

  const stopScanner = useCallback(async () => {
    const s = scannerRef.current;
    scannerRef.current = null;
    if (!s) return;
    try {
      await s.stop();
    } catch {
      // already stopped
    }
    try {
      s.clear();
    } catch {
      // ignore
    }
  }, []);

  const checkInWithCode = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim().toUpperCase();
      if (!trimmed) return false;
      setBusy(true);
      setMsg(null);
      setOk(null);
      try {
        const res = await fetch(`/api/admin/events/${eventId}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkInCode: trimmed }),
          credentials: "include",
        });
        const d = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          kind?: "attendee" | "exhibitor";
          registration?: { fullName?: string; companyName?: string; contactName?: string };
          already?: boolean;
          message?: string;
        };
        if (!res.ok || !d.ok) {
          setMsg(d.message || "No confirmed registration matches this code.");
          return false;
        }
        const label =
          d.kind === "exhibitor" && d.registration?.companyName
            ? `${d.registration.companyName} (${d.registration.contactName ?? "contact"})`
            : (d.registration?.fullName ?? "?");
        setOk({
          kind: d.kind === "exhibitor" ? "exhibitor" : "attendee",
          name: label,
          already: d.already === true,
        });
        setCode("");
        return true;
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "failed");
        return false;
      } finally {
        setBusy(false);
      }
    },
    [eventId]
  );

  useEffect(() => {
    if (!scanning) return;

    let cancelled = false;
    const run = async () => {
      setCamError(null);
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const scanner = new Html5Qrcode(readerId, { verbose: false });
        scannerRef.current = scanner;

        const onSuccess = async (decodedText: string) => {
          if (decodeLockRef.current) return;
          const c = decodedText.trim().toUpperCase();
          if (!/^[A-Z0-9]{6,12}$/.test(c)) return;
          decodeLockRef.current = true;
          try {
            await scanner.stop();
            scannerRef.current = null;
            scanner.clear();
          } catch {
            // ignore
          }
          setScanning(false);
          setCode(c);
          const success = await checkInWithCode(c);
          if (!success) {
            setCode(c);
          }
          decodeLockRef.current = false;
        };

        await scanner.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: { width: 260, height: 260 } },
          (text) => {
            void onSuccess(text);
          },
          () => {}
        );
      } catch (e) {
        if (!cancelled) {
          setCamError(e instanceof Error ? e.message : "Camera could not start (HTTPS or permission required).");
          setScanning(false);
        }
      }
    };

    const t = requestAnimationFrame(() => {
      void run();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(t);
      void stopScanner();
    };
  }, [scanning, readerId, checkInWithCode, stopScanner]);

  async function goManual() {
    await checkInWithCode(code);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Scan an attendee or exhibitor QR (the value matches the printed code), or type the code manually.
      </p>

      {!scanning ? (
        <Button type="button" variant="secondary" onClick={() => setScanning(true)}>
          Start QR / barcode scanner
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void stopScanner();
                setScanning(false);
              }}
            >
              Stop camera
            </Button>
          </div>
          <div
            id={readerId}
            className="max-h-[min(360px,55vh)] w-full max-w-md overflow-hidden rounded-acepCard border border-slate-200 bg-black/5"
          />
          {camError && <p className="text-sm text-red-700">{camError}</p>}
          <p className="text-xs text-slate-500">
            Works on HTTPS or localhost. Grant camera permission when prompted. Many 1D barcodes are supported if your
            ticket uses them.
          </p>
        </div>
      )}

      <div className="border-t border-slate-200 pt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Manual entry</p>
        <div className="flex max-w-sm flex-wrap gap-2">
          <input
            className={cn(
              "flex h-9 w-full max-w-xs rounded-acepBtn border border-slate-300 bg-white px-3 font-mono text-sm uppercase ring-offset-2 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acep-primary/40"
            )}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="E.g. AB2X4FGH"
          />
          <Button type="button" onClick={() => void goManual()} disabled={busy || !code.trim()}>
            {busy ? "…" : "Check in"}
          </Button>
        </div>
      </div>

      {msg && <p className="text-sm text-red-700">{msg}</p>}
      {ok && (
        <p className={cn("text-sm", ok.already ? "text-amber-800" : "text-emerald-800")}>
          <span className="font-medium">[{ok.kind === "exhibitor" ? "Exhibitor" : "Attendee"}]</span>{" "}
          {ok.already ? "Already checked in: " : "Checked in: "}
          {ok.name}
        </p>
      )}
    </div>
  );
}
