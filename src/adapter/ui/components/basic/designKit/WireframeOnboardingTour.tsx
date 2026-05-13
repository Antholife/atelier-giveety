"use client";

import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Spot = { id: string; top: number; left: number; w: number; h: number };

const ZONES: Spot[] = [
  { id: "nav", top: 12, left: 12, w: 80, h: 36 },
  { id: "stats", top: 64, left: 12, w: 220, h: 50 },
  { id: "card", top: 130, left: 12, w: 220, h: 90 },
];

const STEPS = [
  {
    id: "nav",
    title: "1 — Navigation principale",
    body: "Toutes tes sections clés sont ici : profil, missions, certificats.",
  },
  {
    id: "stats",
    title: "2 — Tes KPI en un coup d'œil",
    body: "Heures cumulées, missions réalisées, badges débloqués.",
  },
  {
    id: "card",
    title: "3 — Carte d'engagement",
    body: "Clique sur une mission pour voir tout son détail et postuler en 1 clic.",
  },
];

export default function WireframeOnboardingTour() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const currentStep = STEPS[step];
  const currentSpot = ZONES.find((z) => z.id === currentStep.id) ?? ZONES[0];

  const next = useCallback(() => {
    if (step >= STEPS.length - 1) {
      setDone(true);
      return;
    }
    setStep((s) => s + 1);
  }, [step]);

  const restart = useCallback(() => {
    setDone(false);
    setStep(0);
  }, []);

  const tooltipTop = currentSpot.top + currentSpot.h + 12;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Tour guidé
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Spotlight + tooltips étapes.
          </Typography>
        </Box>
        {done ? (
          <Button onClick={restart} size="small" sx={{ textTransform: "none", fontWeight: 700, color: "tertiary.main" }}>
            Refaire le tour
          </Button>
        ) : null}
      </Stack>

      <Box
        sx={{
          position: "relative",
          height: 270,
          borderRadius: 2,
          bgcolor: alpha(dk.surfaceMuted, 0.3),
          border: `1px solid ${alpha(dk.border, 0.18)}`,
          overflow: "hidden",
        }}
      >
        {ZONES.map((z) => (
          <Box
            key={z.id}
            sx={{
              position: "absolute",
              top: z.top,
              left: z.left,
              width: z.w,
              height: z.h,
              borderRadius: 1.5,
              bgcolor: dk.white,
              border: `1px solid ${alpha(dk.border, 0.15)}`,
              boxShadow: `0 2px 6px ${alpha(dk.surfaceStrong, 0.06)}`,
            }}
          />
        ))}

        {!done ? (
          <>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: alpha("#000", 0.55),
                pointerEvents: "none",
                transition: "all 0.3s ease",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: currentSpot.top - 4,
                left: currentSpot.left - 4,
                width: currentSpot.w + 8,
                height: currentSpot.h + 8,
                borderRadius: 2,
                boxShadow: `0 0 0 9999px ${alpha("#000", 0.55)}, 0 0 0 3px ${dk.tertiary}`,
                background: "transparent",
                transition: "all 0.32s cubic-bezier(.4,1.4,.4,1)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: tooltipTop,
                left: currentSpot.left,
                maxWidth: 230,
                p: 1.5,
                borderRadius: 2,
                bgcolor: dk.white,
                boxShadow: `0 12px 28px ${alpha("#000", 0.3)}`,
                transition: "all 0.32s cubic-bezier(.4,1.4,.4,1)",
                pointerEvents: "auto",
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.25 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "tertiary.main", letterSpacing: "0.05em" }}>
                  {step + 1} / {STEPS.length}
                </Typography>
                <IconButton size="small" onClick={() => setDone(true)} sx={{ p: 0.25 }} aria-label="Skip">
                  <Close sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>
              <Typography sx={{ fontWeight: 800, color: "primary.main", fontSize: 13 }}>
                {currentStep.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mt: 0.25 }}>
                {currentStep.body}
              </Typography>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                <Button
                  size="small"
                  disableElevation
                  onClick={next}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    bgcolor: dk.surfaceStrong,
                    color: dk.white,
                    borderRadius: 9999,
                    px: 2,
                    "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
                  }}
                >
                  {step === STEPS.length - 1 ? "Terminer" : "Suivant"}
                </Button>
              </Stack>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              p: 2,
              textAlign: "center",
              bgcolor: alpha(dk.tertiaryLight, 0.3),
            }}
          >
            <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
              Tour terminé 🎉
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Tu peux relancer ce tour à tout moment depuis ton profil.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
