// ============================================================================
// Game Screen route - /worlds/[id]/[level]
// generateStaticParams genera las 15 combinaciones mundo/nivel para la
// exportación estática (output: "export"). Sin servidor, sin datos remotos.
// ============================================================================

import { WORLDS, getLevelsForWorld } from "@/lib/progression";
import GameView from "./view";

export function generateStaticParams() {
  // Una entrada por cada nivel dentro de cada mundo.
  return WORLDS.flatMap((w) =>
    getLevelsForWorld(w.id).map((lvl) => ({
      id: w.id,
      level: String(lvl.id),
    }))
  );
}

export default function GameScreenPage({
  params,
}: {
  params: { id: string; level: string };
}) {
  return <GameView worldId={params.id} levelId={Number(params.level)} />;
}
