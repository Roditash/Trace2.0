"use client";

// ============================================================================
// Trace - Contexto de preferencias (Fase 3)
// Solo dos ajustes: tema oscuro y reducir animaciones.
// Persistencia local en el navegador (localStorage). Nada más.
// ============================================================================

import { createContext, useContext, useEffect, useState } from "react";

interface Settings {
  theme: "dark" | "light";
  reducedMotion: boolean;
}

interface SettingsContextValue extends Settings {
  ready: boolean;
  toggleTheme: () => void;
  toggleReducedMotion: () => void;
}

const STORAGE_KEY = "trace.settings.v1";

const DEFAULTS: Settings = {
  theme: "dark",
  reducedMotion: false,
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function read(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  // Carga inicial desde el navegador.
  useEffect(() => {
    setSettings(read());
    setReady(true);
  }, []);

  // Persistir y aplicar al documento.
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // almacenamiento no disponible: ignorar
    }
    const root = document.documentElement;
    root.classList.toggle("dark", settings.theme === "dark");
    // Marca para que el CSS/animaciones reduzcan movimiento por elección del usuario.
    root.dataset.reducedMotion = settings.reducedMotion ? "true" : "false";
  }, [settings, ready]);

  const toggleTheme = () =>
    setSettings((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" }));

  const toggleReducedMotion = () =>
    setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion }));

  return (
    <SettingsContext.Provider
      value={{ ...settings, ready, toggleTheme, toggleReducedMotion }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings debe usarse dentro de <SettingsProvider>");
  return ctx;
}
