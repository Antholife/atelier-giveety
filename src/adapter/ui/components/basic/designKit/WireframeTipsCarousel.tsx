"use client";

import { Close, Pause, PlayArrow } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import DismissRetentionDialog, { type DismissRetention } from "./DismissRetentionDialog";
import { designKitPalette } from "./designKitPalette";

const TIPS = [
  {
    id: "1",
    emoji: "🌱",
    title: "Commence petit",
    body: "Une mission de 2 h compte autant qu'une mission longue. L'essentiel : commencer.",
  },
  {
    id: "2",
    emoji: "🤝",
    title: "Préviens si ça bouge",
    body: "Un imprévu ? Dis-le vite à la structure après ton inscription : ils réorganisent plus facilement qu’avec des absences tardives.",
  },
  {
    id: "3",
    emoji: "🎯",
    title: "Rayon réaliste",
    body: "Choisis ta zone et tes créneaux dans les filtres : les missions proposées colleront à ce que tu peux vraiment tenir.",
  },
  {
    id: "4",
    emoji: "🏆",
    title: "Débloque des badges",
    body: "Chaque palier d'engagement révèle de nouveaux badges sur ton profil.",
  },
];

const ROTATION_MS = 8000;

const TRANSITION_DURATION_S = 1;

export type WireframeTipsCarouselProps = {
  /** Confirmer la fermeture via modale : temporaire (réouvrable) ou définitif (ex. localStorage côté parent). */
  onDismissChoice?: (retention: DismissRetention) => void;
  /** À côté de la checklist (dashboard) : la carte prend toute la hauteur disponible · le dégradé s'étire avec un minimum. */
  fillColumnHeight?: boolean;
};

/** Hauteur du bandeau dégradé (hors mode colonne flexible). */
const GRADIENT_H = 132;
/** En colonne jumelée : hauteur du slider réduite ; un spacer sous les points remplit pour garder la hauteur de carte alignée avec la checklist. */
const GRADIENT_H_PAIRED_MD = 128;

export default function WireframeTipsCarousel({
  onDismissChoice,
  fillColumnHeight = false,
}: WireframeTipsCarouselProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % TIPS.length);
    }, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  const togglePlay = useCallback(() => setPlaying((v) => !v), []);

  const slideGradient = fillColumnHeight
    ? `linear-gradient(
      152deg,
      ${alpha(dk.white, 0.78)} 0%,
      ${alpha(dk.surfaceMuted, 0.22)} 52%,
      ${alpha(dk.border, 0.14)} 100%
    )`
    : `linear-gradient(135deg, ${alpha(dk.tertiaryLight, 0.5)} 0%, ${alpha(dk.primaryLight, 0.4)} 100%)`;

  const toolbarBtnSx = {
    zIndex: 1,
    bgcolor: fillColumnHeight ? alpha("#000", 0.12) : alpha(dk.surfaceStrong, 0.22),
    color: fillColumnHeight ? theme.palette.text.primary : dk.surfaceStrong,
    "&:hover": {
      bgcolor: fillColumnHeight ? alpha("#000", 0.18) : alpha(dk.surfaceStrong, 0.34),
    },
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: fillColumnHeight ? "transparent" : dk.canvas,
        border: fillColumnHeight ? "none" : `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: fillColumnHeight
          ? "none"
          : `0 4px 18px ${alpha("#000", 0.06)}`,
        p:
          fillColumnHeight
            ? { xs: 1.25, sm: 1.5, md: 1.75 }
            : { xs: 1.75, sm: 2 },
        width: "100%",
        ...(fillColumnHeight
          ? {
              flex: { xs: "none", md: 1 },
              minHeight: { md: 0 },
              height: { md: "100%" },
              display: "flex",
              flexDirection: "column",
            }
          : {}),
      }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: 2.5,
          overflow: "hidden",
          background: slideGradient,
          ...(fillColumnHeight
            ? {
                flex: { xs: "none", md: "0 0 auto" },
                minHeight: { xs: GRADIENT_H, md: GRADIENT_H_PAIRED_MD },
                height: { xs: GRADIENT_H, md: GRADIENT_H_PAIRED_MD },
              }
            : { height: GRADIENT_H }),
        }}
      >
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ position: "absolute", top: fillColumnHeight ? { xs: 6, md: 8 } : 8, right: fillColumnHeight ? { xs: 6, md: 8 } : 8, zIndex: 1 }}
        >
          <IconButton
            size="small"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            sx={toolbarBtnSx}
          >
            {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
          </IconButton>
          {onDismissChoice ? (
            <IconButton
              size="small"
              onClick={() => setDismissDialogOpen(true)}
              aria-label="Masquer uniquement les astuces"
              sx={toolbarBtnSx}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          ) : null}
        </Stack>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            transform: `translateY(-${index * 100}%)`,
            transition: `transform ${TRANSITION_DURATION_S}s cubic-bezier(.4,1.4,.4,1)`,
          }}
        >
          {TIPS.map((t) => (
            <Box
              key={t.id}
              sx={{
                height: "100%",
                p: fillColumnHeight ? { xs: 1.75, sm: 2, md: 2.25 } : 2.25,
                display: "flex",
                alignItems: "center",
                gap: fillColumnHeight ? { xs: 1.25, md: 1.5 } : 1.5,
              }}
            >
              <Box
                sx={{
                  fontSize: fillColumnHeight ? { xs: 40, md: 48 } : 48,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {t.emoji}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: fillColumnHeight ? "text.primary" : "primary.main",
                    lineHeight: 1.12,
                    ...(fillColumnHeight
                      ? { fontSize: { xs: "0.95rem", md: "1.05rem" } }
                      : { fontSize: "1.05rem" }),
                  }}
                >
                  {t.title}
                </Typography>
                <Typography
                  sx={{
                    color: fillColumnHeight ? "text.secondary" : "primary.main",
                    fontWeight: 500,
                    mt: fillColumnHeight ? { xs: 0.35, md: 0.45 } : 0.45,
                    opacity: fillColumnHeight ? 1 : 0.88,
                    lineHeight: fillColumnHeight ? 1.38 : 1.38,
                    fontSize: fillColumnHeight ? { xs: "0.78rem", md: "0.82rem" } : "0.82rem",
                  }}
                >
                  {t.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {playing ? (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 3,
              bgcolor: fillColumnHeight ? alpha("#000", 0.35) : dk.surfaceStrong,
              animation: `fillBar ${ROTATION_MS}ms linear infinite`,
              "@keyframes fillBar": {
                from: { width: "0%" },
                to: { width: "100%" },
              },
            }}
          />
        ) : null}
      </Box>

      <Stack
        direction="row"
        justifyContent="center"
        spacing={0.75}
        sx={{
          mt: fillColumnHeight ? { xs: 1, md: 1.15 } : 1.15,
          flexShrink: 0,
        }}
      >
        {TIPS.map((t, i) => (
          <Box
            key={t.id}
            onClick={() => setIndex(i)}
            sx={{
              width: i === index ? (fillColumnHeight ? { xs: 20, md: 22 } : 22) : 5,
              height: fillColumnHeight ? { xs: 5, md: 5 } : 5,
              borderRadius: 9999,
              bgcolor: i === index ? dk.surfaceStrong : alpha(dk.border, 0.3),
              cursor: "pointer",
              transition: "width 0.3s ease, background 0.2s ease, height 0.2s ease",
            }}
          />
        ))}
      </Stack>

      {fillColumnHeight ? <Box sx={{ flex: 1, minHeight: 0 }} /> : null}

      {onDismissChoice ? (
        <DismissRetentionDialog
          open={dismissDialogOpen}
          onClose={() => setDismissDialogOpen(false)}
          scopeLabel="les astuces"
          blockTitle="Astuces"
          onChooseTemporary={() => {
            setDismissDialogOpen(false);
            onDismissChoice("temporary");
          }}
          onChoosePermanent={() => {
            setDismissDialogOpen(false);
            onDismissChoice("permanent");
          }}
        />
      ) : null}
    </Box>
  );
}
