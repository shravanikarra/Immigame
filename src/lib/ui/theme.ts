/**
 * Theme tokens for Immigame
 * Neobrutalist design system
 */

export const palette = {
  mint: "#B7E5CD",
  teal: "#8ABEB9",
  navy: "#305669",
  clay: "#C1785A",
} as const;

export const semantic = {
  background: palette.navy,
  foreground: palette.mint,
  primary: palette.clay,
  primaryForeground: palette.mint,
  secondary: palette.teal,
  secondaryForeground: palette.navy,
  muted: palette.teal,
  mutedForeground: palette.navy,
  accent: palette.teal,
  accentForeground: palette.navy,
  border: palette.mint,
  ring: palette.mint,
} as const;

export const tokens = {
  borderThickness: "4px",
  borderRadius: "1rem", // rounded-2xl
  shadowOffset: "6px",
  shadowBlur: "0",
  shadowSpread: "0",
  shadowColor: "rgba(0, 0, 0, 0.9)",
} as const;

export const theme = {
  palette,
  semantic,
  tokens,
} as const;

export type Palette = typeof palette;
export type Semantic = typeof semantic;
export type Tokens = typeof tokens;
