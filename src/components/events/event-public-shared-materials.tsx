import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Item = {
  id: string;
  title: string;
  body: string;
  portalUser: { displayName: string; organisation: string | null };
};

/**
 * Public copy of participant materials staff have approved for this event.
 */
export function EventPublicSharedMaterials({ items, eventTitle }: { items: Item[]; eventTitle: string }) {
  if (items.length === 0) return null;

  return (
    <Card className="mt-8 border-emerald-200/80 bg-emerald-50/30">
      <CardHeader>
        <CardTitle className="text-lg">Shared event materials</CardTitle>
        <p className="text-sm font-normal text-slate-600">
          The following text was shared by registered participants and approved for public view for &ldquo;{eventTitle}&rdquo;. It is
          not an official ACEP article; for publications see our news and resource centre.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((it) => (
          <article key={it.id} className="rounded-acepCard border border-slate-200/80 bg-white p-4 text-sm text-slate-800 shadow-sm">
            {it.title.trim() ? <h3 className="font-display text-base font-semibold text-slate-900">{it.title}</h3> : null}
            <p className="mt-1 text-xs text-slate-500">
              {it.portalUser.displayName}
              {it.portalUser.organisation ? ` · ${it.portalUser.organisation}` : ""}
            </p>
            <div className="mt-3 whitespace-pre-wrap text-slate-800">{it.body}</div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
