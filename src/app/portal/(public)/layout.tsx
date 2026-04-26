export default function PortalPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
