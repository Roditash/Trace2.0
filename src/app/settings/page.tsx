"use client";

// ============================================================================
// Settings - configuraciones básicas (Fase 3).
// Solo: tema oscuro y reducir animaciones. Persiste en localStorage.
// Nada más.
// ============================================================================

import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import Toggle from "@/components/ui/Toggle";
import { useSettings } from "@/context/SettingsContext";

function Row({
  title,
  description,
  control,
}: {
  title: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>
      {control}
    </div>
  );
}

export default function SettingsPage() {
  const { theme, reducedMotion, toggleTheme, toggleReducedMotion } =
    useSettings();

  return (
    <RevealGroup className="mx-auto max-w-2xl">
      <RevealItem>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Ajustes
        </h1>
        <p className="mt-2 text-muted">Preferencias básicas de la aplicación.</p>
      </RevealItem>

      <RevealItem className="mt-8">
        <Card className="divide-y divide-border !py-0">
          <Row
            title="Tema oscuro"
            description="Activa o desactiva el modo oscuro."
            control={
              <Toggle
                checked={theme === "dark"}
                onChange={toggleTheme}
                label="Tema oscuro"
              />
            }
          />
          <Row
            title="Reducir animaciones"
            description="Minimiza el movimiento de la interfaz."
            control={
              <Toggle
                checked={reducedMotion}
                onChange={toggleReducedMotion}
                label="Reducir animaciones"
              />
            }
          />
        </Card>
      </RevealItem>

      <RevealItem className="mt-4">
        <p className="text-center text-xs text-muted">
          Tus preferencias se guardan localmente en este navegador.
        </p>
      </RevealItem>
    </RevealGroup>
  );
}
