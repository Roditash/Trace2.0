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

const SITE_NAME = "Trace";
const TITLE = "Trace — Aprende a pensar como programador";
const DESCRIPTION =
  "Resuelve problemas visuales y mira cómo el código aparece como consecuencia de tu razonamiento. 100% en tu navegador, sin cuentas.";

export const metadata: Metadata = {
  // Permite resolver rutas absolutas de OG/Twitter en el export estático.
  metadataBase: new URL("https://trace.app"),
  applicationName: SITE_NAME,
  title: {
    default: TITLE,
    template: "%s · Trace",
  },
  description: DESCRIPTION,
  keywords: [
    "aprender a programar",
    "pensamiento computacional",
    "Python",
    "lógica de programación",
    "juego educativo",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "es_ES",
    // opengraph-image.png en /app se detecta automáticamente.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  // Acompaña el cambio de tema de la barra del navegador (claro/oscuro).
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
  ],
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
