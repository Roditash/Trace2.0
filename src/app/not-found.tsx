"use client";

// ============================================================================
// 404 - página no encontrada. Sobria, coherente con el sistema.
// ============================================================================

import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <RevealGroup className="mx-auto flex max-w-md flex-col items-center gap-6 py-16 text-center">
      <RevealItem>
        <span className="text-5xl font-semibold tracking-tight text-muted">
          404
        </span>
      </RevealItem>
      <RevealItem>
        <h1 className="text-xl font-semibold">Página no encontrada</h1>
        <p className="mt-2 text-sm text-muted">
          La ruta que buscas no existe o aún no está disponible.
        </p>
      </RevealItem>
      <RevealItem>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </RevealItem>
    </RevealGroup>
  );
}
