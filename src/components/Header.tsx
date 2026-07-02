"use client";

// ============================================================================
// Header - navegación global minimalista. ANIMATION_SYSTEM 7.9.
// Indicador de sección activa: pill compartido con spring.subtle (layoutId).
// Responsive: navegación en el header en desktop/tablet; barra inferior en móvil.
// ============================================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { spring } from "@/lib/motion";
import Logo from "./ui/Logo";

// Barra fina de progreso de scroll, anclada al borde inferior del header.
// Comunica "cuánto queda" de forma elegante (Vercel/Linear). Suavizada con
// spring para que no salte. Decorativa (aria-hidden).
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    mass: 0.3,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-accent to-accent-strong"
    />
  );
}

interface NavItem {
  href: string;
  label: string;
}

const NAV: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/worlds", label: "Mundos" },
  { href: "/profile", label: "Perfil" },
  { href: "/settings", label: "Ajustes" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      {/* Barra superior */}
      <header className="glass-bar sticky top-0 z-40 border-b border-glass/10">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            aria-label="Trace, inicio"
            className="group shrink-0 transition-transform duration-200 [@media(hover:hover)]:hover:scale-[1.03]"
          >
            <Logo />
          </Link>

          {/* Navegación en barra superior (tablet y desktop) */}
          <nav aria-label="Principal" className="hidden sm:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group/nav relative inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-colors ${
                        active ? "text-text" : "text-muted hover:text-text"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-lg bg-surface-2"
                          transition={spring.subtle}
                        />
                      )}
                      {item.label}
                      {!active && (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-3.5 bottom-1.5 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2 transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover/nav:scale-x-100"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        <ScrollProgress />
      </header>

      {/* Barra inferior (solo móvil) */}
      <nav
        aria-label="Principal móvil"
        className="glass-bar fixed inset-x-0 bottom-0 z-40 border-t border-glass/10 sm:hidden"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-14 flex-col items-center justify-center text-xs font-medium transition-colors ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill-mobile"
                      className="absolute top-0 h-0.5 w-8 rounded-full bg-accent"
                      transition={spring.subtle}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
