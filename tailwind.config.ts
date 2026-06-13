import type { Config } from "tailwindcss";

/** Helper para colores basados en variables CSS con soporte de opacidad. */
function withVar(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: withVar("--bg"),
        surface: withVar("--surface"),
        "surface-2": withVar("--surface-2"),
        border: withVar("--border"),
        text: withVar("--text"),
        muted: withVar("--text-muted"),
        accent: withVar("--accent"),
        "accent-strong": withVar("--accent-strong"),
        success: withVar("--success"),
        danger: withVar("--danger"),
        "code-bg": withVar("--code-bg"),
        star: withVar("--star"),
        glass: withVar("--glass-edge"),
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
