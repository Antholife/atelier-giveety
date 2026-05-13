import type { Theme } from "@mui/material/styles";

/**
 * Couleurs du kit démo alignées sur le thème Giveety (`adapter/ui/theme`).
 */
export function designKitPalette(theme: Theme) {
  const { palette } = theme;
  return {
    pageBg: palette.background.page,
    surface: palette.background.card,
    surfaceMuted: palette.secondary.light,
    surfaceAccent: palette.secondary.main,
    surfaceStrong: palette.primary.main,
    primaryLight: palette.primary.light,
    tertiary: palette.tertiary.main,
    tertiaryLight: palette.tertiary.light,
    border: palette.border.main,
    text: palette.text.primary,
    textMuted: palette.text.secondary,
    /** Fond canvas (clair / sombre) — préférer à un blanc littéral pour les surfaces pleines. */
    canvas: palette.background.default,
    /** Blanc pur : texte sur primaire, verre, reflets. */
    white: palette.common.white,
    /** Alias sémantique pour effets « liquid glass » (même valeur que `white`). */
    frost: palette.common.white,
    mint: palette.pdf?.defaultSkillColor ?? "#A8E6CF",
  };
}

export type DesignKitPalette = ReturnType<typeof designKitPalette>;
