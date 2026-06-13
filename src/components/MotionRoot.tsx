"use client";

// ============================================================================
// Trace - MotionRoot
// Envuelve la app con MotionConfig de Framer Motion y aplica la preferencia de
// "reducir animaciones" (ajuste del usuario u OS). Cumple sección 11 del
// ANIMATION_SYSTEM.md: con movimiento reducido, las animaciones se neutralizan.
// ============================================================================

import { MotionConfig } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

export default function MotionRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { reducedMotion } = useSettings();

  // "user" deja que Framer respete prefers-reduced-motion del SO;
  // si el usuario activa el ajuste, forzamos "always".
  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}
