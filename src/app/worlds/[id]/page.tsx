// ============================================================================
// World Detail - placeholder visual (Fase 3). Sin niveles ni lógica.
// generateStaticParams permite exportación estática (output: "export").
// ============================================================================

import { WORLDS } from "@/lib/progression";
import WorldDetailView from "./view";

export function generateStaticParams() {
  return WORLDS.map((w) => ({ id: w.id }));
}

export default function WorldDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <WorldDetailView id={params.id} />;
}
