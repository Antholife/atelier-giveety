"use client";

import {
  Box,
  Button,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import type { DesignKitPalette } from "./designKitPalette";
import { designKitPalette } from "./designKitPalette";

type WireframeHeroProps = {
  logoLabel: string;
  title: string;
  subtitle: string;
};

const TITLE_ALTERNATIVES = [
  "Version alternative : le hero réagit au bouton « Titre suivant ».",
  "Encore une variante : ici on simule un carrousel de messages marketing.",
] as const;

function LogoRow({
  dk,
  logoLabel,
  onLogoClick,
  theme,
}: {
  dk: DesignKitPalette;
  logoLabel: string;
  onLogoClick: () => void;
  theme: Theme;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        component="button"
        type="button"
        onClick={onLogoClick}
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: dk.white,
          border: `2px solid ${alpha(dk.surfaceStrong, 0.35)}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 11,
          color: "primary.main",
          fontFamily: theme.typography.fontFamily,
          boxShadow: `0 4px 14px ${alpha(dk.surfaceStrong, 0.15)}`,
          "&:hover": { borderColor: dk.tertiary, transform: "scale(1.03)" },
          transition: "border-color 0.2s ease, transform 0.2s ease",
          "&:focus-visible": {
            boxShadow: `0 0 0 3px ${alpha(dk.surfaceAccent, 0.65)}`,
          },
        }}
        aria-label="Mélanger le sous-titre (démo)"
      >
        Logo
      </Box>
      <Typography
        sx={{
          fontWeight: 800,
          color: "primary.main",
          fontSize: 16,
          fontFamily: theme.typography.fontFamily,
        }}
      >
        {logoLabel}
      </Typography>
    </Stack>
  );
}

export default function WireframeHero({
  logoLabel,
  title: initialTitle,
  subtitle: initialSubtitle,
}: WireframeHeroProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const titles = useMemo(
    () => [initialTitle, ...TITLE_ALTERNATIVES],
    [initialTitle],
  );
  const [titleIndex, setTitleIndex] = useState(0);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [liked, setLiked] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const cycleTitle = useCallback(() => {
    setTitleIndex((i) => (i + 1) % titles.length);
    setSnackbar("Titre mis à jour (démo carrousel).");
  }, [titles.length]);

  const toggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      queueMicrotask(() => {
        setSnackbar(next ? "Merci pour le like fictif." : "Like retiré.");
      });
      return next;
    });
  }, []);

  const shuffleSubtitle = useCallback(() => {
    const pool = [
      initialSubtitle,
      "Sous-titre B : interaction confirmée côté démo.",
      "Sous-titre C : tout est local, rien n’est envoyé au serveur.",
    ];
    setSubtitle(pool[Math.floor(Math.random() * pool.length)]);
    setSnackbar("Sous-titre mélangé au hasard.");
  }, [initialSubtitle]);

  return (
    <Box>
      <Box
        sx={{
          borderRadius: 3,
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          py: 5,
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(145deg, ${dk.primaryLight} 0%, ${dk.white} 42%, ${alpha(dk.surfaceAccent, 0.35)} 72%, ${alpha(dk.mint, 0.55)} 100%)`,
          border: `1px solid ${alpha(dk.border, 0.35)}`,
          boxShadow: `0 16px 48px ${alpha(dk.surfaceStrong, 0.12)}`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-30%",
            right: "-15%",
            width: "55%",
            height: "85%",
            borderRadius: "50%",
            background: alpha(dk.tertiaryLight, 0.65),
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-25%",
            left: "-10%",
            width: "45%",
            height: "70%",
            borderRadius: "50%",
            background: alpha(dk.surfaceMuted, 0.9),
            pointerEvents: "none",
          },
        }}
      >
        <Stack
          alignItems="center"
          spacing={2}
          textAlign="center"
          maxWidth={520}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <LogoRow dk={dk} logoLabel={logoLabel} onLogoClick={shuffleSubtitle} theme={theme} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              lineHeight: 1.2,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            {titles[titleIndex]}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: 16,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            {subtitle}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
            <Button
              variant="contained"
              disableElevation
              onClick={toggleLike}
              sx={{
                borderRadius: 9999,
                textTransform: "none",
                fontWeight: 800,
                fontFamily: theme.typography.fontFamily,
                bgcolor: liked ? dk.tertiary : dk.surfaceStrong,
                color: dk.white,
                px: 2.5,
                "&:hover": {
                  bgcolor: liked ? darken(dk.tertiary, 0.08) : darken(dk.surfaceStrong, 0.1),
                },
              }}
            >
              {liked ? "★ Aimé" : "☆ J’aime cette vibe"}
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={cycleTitle}
              sx={{
                borderRadius: 9999,
                textTransform: "none",
                fontWeight: 800,
                fontFamily: theme.typography.fontFamily,
                bgcolor: dk.surfaceAccent,
                color: dk.surfaceStrong,
                border: `1px solid ${alpha(dk.surfaceStrong, 0.2)}`,
                px: 2.5,
                "&:hover": { bgcolor: darken(dk.surfaceAccent, 0.05) },
              }}
            >
              Titre suivant
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Snackbar
        open={snackbar !== null}
        message={snackbar}
        onClose={() => setSnackbar(null)}
        autoHideDuration={2600}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
}
