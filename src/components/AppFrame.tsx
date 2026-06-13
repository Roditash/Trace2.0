"use client";

// ============================================================================
// AppFrame - estructura global. Header + contenedor + transición de página.
// Page transition: ANIMATION_SYSTEM 5.11 / 8 (transition.page, pageVariants).
// ============================================================================

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Header";
import { pageVariants, transition } from "@/lib/motion";

export default function AppFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition.page}
          className="mx-auto w-full max-w-content flex-1 px-5 pb-24 pt-8 sm:px-8 sm:pb-12 sm:pt-12"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
