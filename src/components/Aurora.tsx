// ============================================================================
// Aurora - firma visual ambiental de Trace.
//
// Una capa fija a pantalla completa con manchas de acento que derivan muy
// lentamente, más una textura de grano finísima por encima. Es la atmósfera
// que da identidad al producto: luz viva, no un patrón copiable. Puramente
// decorativa (aria-hidden, pointer-events-none) y de coste de render mínimo
// (transform/opacity en el compositor). Respeta "reducir movimiento" vía CSS.
// ============================================================================

export default function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />
      {/* Grano por encima de la aurora, debajo del contenido. */}
      <div className="grain-overlay absolute inset-0" />
    </div>
  );
}
