export interface ThemeType {
  id: string;
  name: string;
  /**
   * CSS to be injected into a <style> tag (e.g. inside an iframe/canvas preview).
   * It should be a complete stylesheet (selectors included).
   */
  style: string;
}

export const FONT_VARIABLES = `
--font-sans: "Plus Jakarta Sans";
--font-serif: "Playfair Display";
--font-mono: "JetBrains Mono";
--font-heading: "Space Grotesk";
`;

export const BASE_VARIABLES = `
${FONT_VARIABLES}

--radius: 14px;
--tracking-normal: 0em;

/* shadow tokens (safe defaults for previews) */
--shadow-color: hsl(0 0% 0% / 0.12);
--shadow-2xs: 0 1px 0 hsl(0 0% 0% / 0.06);
--shadow-xs: 0 1px 2px hsl(0 0% 0% / 0.08);
--shadow-sm: 0 2px 6px hsl(0 0% 0% / 0.10);
--shadow-md: 0 6px 18px hsl(0 0% 0% / 0.12);
--shadow-lg: 0 10px 30px hsl(0 0% 0% / 0.14);
--shadow-xl: 0 18px 50px hsl(0 0% 0% / 0.16);
--shadow-2xl: 0 28px 80px hsl(0 0% 0% / 0.18);
`;

function stylesheet(vars: string) {
  return `
:root{
${BASE_VARIABLES}
${vars}
}
`;
}

export const THEMES = [
  {
    id: "paper",
    name: "Paper (Light)",
    style: stylesheet(`
--background: #fbfbfb;
--foreground: #121212;
--card: #ffffff;
--card-foreground: #121212;
--popover: #ffffff;
--popover-foreground: #121212;
--primary: #111827;
--primary-foreground: #ffffff;
--secondary: #f1f5f9;
--secondary-foreground: #0f172a;
--muted: #f3f4f6;
--muted-foreground: #6b7280;
--accent: #e5e7eb;
--accent-foreground: #111827;
--destructive: #ef4444;
--destructive-foreground: #ffffff;
--border: #e5e7eb;
--input: #e5e7eb;
--ring: #111827;
--link: #2563eb;
`),
  },
  {
    id: "midnight",
    name: "Midnight (Dark)",
    style: stylesheet(`
--background: #0b1020;
--foreground: #e5e7eb;
--card: #0f172a;
--card-foreground: #e5e7eb;
--popover: #0f172a;
--popover-foreground: #e5e7eb;
--primary: #93c5fd;
--primary-foreground: #071018;
--secondary: #111827;
--secondary-foreground: #e5e7eb;
--muted: #111827;
--muted-foreground: #9ca3af;
--accent: #1f2937;
--accent-foreground: #e5e7eb;
--destructive: #fb7185;
--destructive-foreground: #0b1020;
--border: #1f2937;
--input: #1f2937;
--ring: #93c5fd;
--link: #60a5fa;
--shadow-color: hsl(220 50% 2% / 0.55);
`),
  },
  {
    id: "ocean",
    name: "Ocean",
    style: stylesheet(`
--background: #f3fbff;
--foreground: #06283d;
--card: #ffffff;
--card-foreground: #06283d;
--popover: #ffffff;
--popover-foreground: #06283d;
--primary: #0ea5e9;
--primary-foreground: #001018;
--secondary: #e0f2fe;
--secondary-foreground: #0b1f2a;
--muted: #e8f6ff;
--muted-foreground: #35627a;
--accent: #bae6fd;
--accent-foreground: #06283d;
--destructive: #ef4444;
--destructive-foreground: #ffffff;
--border: #cfe9f7;
--input: #cfe9f7;
--ring: #0284c7;
--link: #0369a1;
`),
  },
  {
    id: "sunset",
    name: "Sunset",
    style: stylesheet(`
--background: #fff7ed;
--foreground: #27130b;
--card: #ffffff;
--card-foreground: #27130b;
--popover: #ffffff;
--popover-foreground: #27130b;
--primary: #f97316;
--primary-foreground: #1a0c07;
--secondary: #ffedd5;
--secondary-foreground: #27130b;
--muted: #fff1e6;
--muted-foreground: #7c3f2b;
--accent: #fed7aa;
--accent-foreground: #27130b;
--destructive: #ef4444;
--destructive-foreground: #ffffff;
--border: #fcd3b6;
--input: #fcd3b6;
--ring: #ea580c;
--link: #c2410c;
`),
  },
  {
    id: "forest",
    name: "Forest",
    style: stylesheet(`
--background: #f6fbf7;
--foreground: #0b1f14;
--card: #ffffff;
--card-foreground: #0b1f14;
--popover: #ffffff;
--popover-foreground: #0b1f14;
--primary: #16a34a;
--primary-foreground: #031108;
--secondary: #dcfce7;
--secondary-foreground: #0b1f14;
--muted: #eaf7ee;
--muted-foreground: #2d6a4f;
--accent: #bbf7d0;
--accent-foreground: #0b1f14;
--destructive: #ef4444;
--destructive-foreground: #ffffff;
--border: #cfe9d8;
--input: #cfe9d8;
--ring: #15803d;
--link: #166534;
`),
  },
  {
    id: "mono",
    name: "Mono",
    style: stylesheet(`
--background: #ffffff;
--foreground: #0a0a0a;
--card: #ffffff;
--card-foreground: #0a0a0a;
--popover: #ffffff;
--popover-foreground: #0a0a0a;
--primary: #0a0a0a;
--primary-foreground: #ffffff;
--secondary: #f5f5f5;
--secondary-foreground: #0a0a0a;
--muted: #f5f5f5;
--muted-foreground: #525252;
--accent: #e5e5e5;
--accent-foreground: #0a0a0a;
--destructive: #dc2626;
--destructive-foreground: #ffffff;
--border: #e5e5e5;
--input: #e5e5e5;
--ring: #0a0a0a;
--link: #0a0a0a;
--font-sans: "JetBrains Mono";
--font-mono: "JetBrains Mono";
--font-heading: "JetBrains Mono";
`),
  },
  {
    id: "lavender",
    name: "Lavender",
    style: stylesheet(`
--background: #f9f7ff;
--foreground: #1e1b4b;
--card: #ffffff;
--card-foreground: #1e1b4b;
--popover: #ffffff;
--popover-foreground: #1e1b4b;
--primary: #7c3aed;
--primary-foreground: #ffffff;
--secondary: #ede9fe;
--secondary-foreground: #1e1b4b;
--muted: #f3f0ff;
--muted-foreground: #6d28d9;
--accent: #ddd6fe;
--accent-foreground: #1e1b4b;
--destructive: #ef4444;
--destructive-foreground: #ffffff;
--border: #ddd6fe;
--input: #ddd6fe;
--ring: #7c3aed;
--link: #6d28d9;
`),
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    style: stylesheet(`
--background: #fff5f7;
--foreground: #3b0a1f;
--card: #ffffff;
--card-foreground: #3b0a1f;
--popover: #ffffff;
--popover-foreground: #3b0a1f;
--primary: #e11d48;
--primary-foreground: #ffffff;
--secondary: #ffe4e6;
--secondary-foreground: #3b0a1f;
--muted: #fff1f2;
--muted-foreground: #9f1239;
--accent: #fecdd3;
--accent-foreground: #3b0a1f;
--destructive: #dc2626;
--destructive-foreground: #ffffff;
--border: #fecdd3;
--input: #fecdd3;
--ring: #e11d48;
--link: #be123c;
`),
  },
  {
    id: "neon",
    name: "Neon",
    style: stylesheet(`
--background: #0a0a0f;
--foreground: #e0e0ff;
--card: #0f0f1a;
--card-foreground: #e0e0ff;
--popover: #0f0f1a;
--popover-foreground: #e0e0ff;
--primary: #00ff88;
--primary-foreground: #000;
--secondary: #1a1a2e;
--secondary-foreground: #e0e0ff;
--muted: #16213e;
--muted-foreground: #00ccff;
--accent: #0f3460;
--accent-foreground: #00ff88;
--destructive: #ff004f;
--destructive-foreground: #ffffff;
--border: #1e1e3a;
--input: #1e1e3a;
--ring: #00ff88;
--link: #00ccff;
`),
  },
  {
    id: "cyber",
    name: "Cyber",
    style: stylesheet(`
--background: #0d0d0e;
--foreground: #f0f0f0;
--card: #111113;
--card-foreground: #f0f0f0;
--popover: #111113;
--popover-foreground: #f0f0f0;
--primary: #facc15;
--primary-foreground: #000;
--secondary: #1c1c1e;
--secondary-foreground: #f0f0f0;
--muted: #1c1c1e;
--muted-foreground: #999;
--accent: #27272a;
--accent-foreground: #facc15;
--destructive: #ef4444;
--destructive-foreground: #fff;
--border: #27272a;
--input: #27272a;
--ring: #facc15;
--link: #facc15;
`),
  },
  {
    id: "peach",
    name: "Peach",
    style: stylesheet(`
--background: #fffaf7;
--foreground: #431407;
--card: #ffffff;
--card-foreground: #431407;
--popover: #ffffff;
--popover-foreground: #431407;
--primary: #fb923c;
--primary-foreground: #fff;
--secondary: #ffedd5;
--secondary-foreground: #431407;
--muted: #fff7ed;
--muted-foreground: #9a3412;
--accent: #fed7aa;
--accent-foreground: #431407;
--destructive: #ef4444;
--destructive-foreground: #fff;
--border: #fdba74;
--input: #fdba74;
--ring: #f97316;
--link: #ea580c;
`),
  },
  {
    id: "glacier",
    name: "Glacier",
    style: stylesheet(`
--background: #f0f9ff;
--foreground: #0c1445;
--card: #ffffff;
--card-foreground: #0c1445;
--popover: #ffffff;
--popover-foreground: #0c1445;
--primary: #0284c7;
--primary-foreground: #fff;
--secondary: #e0f2fe;
--secondary-foreground: #0c1445;
--muted: #f0f9ff;
--muted-foreground: #0369a1;
--accent: #bae6fd;
--accent-foreground: #0c1445;
--destructive: #ef4444;
--destructive-foreground: #fff;
--border: #7dd3fc;
--input: #7dd3fc;
--ring: #0284c7;
--link: #0369a1;
`),
  },
  {
    id: "monochrome",
    name: "Monochrome",
    style: stylesheet(`
--background: #fafafa;
--foreground: #111;
--card: #ffffff;
--card-foreground: #111;
--popover: #ffffff;
--popover-foreground: #111;
--primary: #222;
--primary-foreground: #fff;
--secondary: #e5e5e5;
--secondary-foreground: #111;
--muted: #f5f5f5;
--muted-foreground: #666;
--accent: #d4d4d4;
--accent-foreground: #111;
--destructive: #dc2626;
--destructive-foreground: #fff;
--border: #d4d4d4;
--input: #d4d4d4;
--ring: #222;
--link: #333;
`),
  },
] as const satisfies ReadonlyArray<ThemeType>;

export type ThemeId = (typeof THEMES)[number]["id"];

export const DEFAULT_THEME_ID: ThemeId = "paper";

export const THEME_BY_ID: Record<ThemeId, ThemeType> = THEMES.reduce(
  (acc, theme) => {
    acc[theme.id] = theme;
    return acc;
  },
  {} as Record<ThemeId, ThemeType>
);

export function isThemeId(value: string): value is ThemeId {
  return value in THEME_BY_ID;
}

/**
 * If `value` matches a known theme id, returns its stylesheet.
 * Otherwise treats `value` as raw CSS and returns it (useful for DB-stored CSS).
 */
export function resolveThemeStyle(value?: string | null) {
  if (!value) return THEME_BY_ID[DEFAULT_THEME_ID].style;
  if (isThemeId(value)) return THEME_BY_ID[value].style;
  return value;
}

export function getTheme(value?: string | null): ThemeType {
  if (!value) return THEME_BY_ID[DEFAULT_THEME_ID];
  if (isThemeId(value)) return THEME_BY_ID[value];
  return { id: "custom", name: "Custom", style: value };
}