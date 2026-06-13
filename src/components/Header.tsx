"use client";

// ============================================================================
// Header - navegación global minimalista. ANIMATION_SYSTEM 7.9.
// Indicador de sección activa: pill compartido con spring.subtle (layoutId).
// Responsive: navegación en el header en desktop/tablet; barra inferior en móvil.
// ============================================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import Logo from "./ui/Logo";

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
          <Link href="/" aria-label="Trace, inicio" className="shrink-0">
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
                      className={`relative inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium transition-colors ${
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
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
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
                  className={`flex h-14 flex-col items-center justify-center text-xs font-medium transition-colors ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
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
