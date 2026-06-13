import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import { ProgressProvider } from "@/context/ProgressContext";
import MotionRoot from "@/components/MotionRoot";
import AppFrame from "@/components/AppFrame";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trace — Aprende a pensar como programador",
  description:
    "Trace: aprende a pensar como programador mediante retos visuales. Aplicación 100% en tu navegador.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} dark`}>
      <body className="min-h-screen font-sans">
        <SettingsProvider>
          <ProgressProvider>
            <MotionRoot>
              <AppFrame>{children}</AppFrame>
            </MotionRoot>
          </ProgressProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
