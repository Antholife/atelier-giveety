"use client";

import { Check } from "@mui/icons-material";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const STEPS = [
  { id: "engage", label: "Je m’engage", hint: "Choisir une mission" },
  { id: "act", label: "J’agis", hint: "Sur le terrain" },
  { id: "atteste", label: "On m’atteste", hint: "Mon manager valide" },
  { id: "valorise", label: "Je valorise", hint: "Sur mon CV" },
  { id: "share", label: "Je partage", hint: "Je transmets" },
] as const;

const NODE_SIZE = 32;
const TRACK_HEIGHT = 4;

export default function WireframeProgressJourney() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [current, setCurrent] = useState(2);

  const next = useCallback(
    () => setCurrent((c) => Math.min(STEPS.length - 1, c + 1)),
    [],
  );
  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);

  const progressPct = useMemo(
    () => (current / (STEPS.length - 1)) * 100,
    [current],
  );

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
          Étape {current + 1} / {STEPS.length}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
          {Math.round(progressPct)}% du parcours
        </Typography>
      </Stack>

      <Box sx={{ position: "relative", px: `${NODE_SIZE / 2}px`, pb: 5 }}>
        <Box sx={{ position: "relative", height: NODE_SIZE }}>
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
              height: TRACK_HEIGHT,
              borderRadius: 9999,
              bgcolor: alpha(dk.border, 0.18),
              transform: "translateY(-50%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: TRACK_HEIGHT,
              borderRadius: 9999,
              background: `linear-gradient(90deg, ${dk.surfaceStrong}, ${dk.tertiary})`,
              transform: "translateY(-50%)",
              width: `${progressPct}%`,
              transition: "width 0.4s ease",
            }}
          />

          {STEPS.map((step, i) => {
            const isDone = i < current;
            const isActive = i === current;
            const leftPct = (i / (STEPS.length - 1)) * 100;
            return (
              <Box
                key={step.id}
                role="button"
                tabIndex={0}
                onClick={() => setCurrent(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCurrent(i);
                  }
                }}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: `${leftPct}%`,
                  transform: "translate(-50%, -50%)",
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: isDone
                    ? dk.surfaceStrong
                    : isActive
                      ? dk.tertiary
                      : dk.canvas,
                  color: isDone || isActive ? dk.white : dk.textMuted,
                  border: `2px solid ${
                    isDone || isActive ? "transparent" : alpha(dk.border, 0.4)
                  }`,
                  boxShadow: isActive
                    ? `0 0 0 6px ${alpha(dk.tertiary, 0.18)}`
                    : "none",
                  transition: "all 0.2s ease",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  outline: "none",
                  "&:focus-visible": {
                    boxShadow: `0 0 0 4px ${alpha(dk.surfaceAccent, 0.7)}`,
                  },
                }}
              >
                {isDone ? <Check fontSize="small" /> : i + 1}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ position: "relative", height: 44, mt: 1.5 }}>
          {STEPS.map((step, i) => {
            const isActive = i === current;
            const leftPct = (i / (STEPS.length - 1)) * 100;
            return (
              <Stack
                key={step.id}
                alignItems="center"
                spacing={0.25}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: `${leftPct}%`,
                  transform: "translateX(-50%)",
                  width: { xs: 80, sm: 110 },
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? "primary.main" : "text.secondary",
                    lineHeight: 1.2,
                  }}
                  noWrap
                >
                  {step.label}
                </Typography>
                {isActive ? (
                  <Typography
                    variant="caption"
                    sx={{ color: "tertiary.main", fontWeight: 700, fontSize: 10, lineHeight: 1.1 }}
                    noWrap
                  >
                    {step.hint}
                  </Typography>
                ) : null}
              </Stack>
            );
          })}
        </Box>
      </Box>

      <Stack direction="row" spacing={1.5} justifyContent="flex-end">
        <Button
          disableElevation
          disabled={current === 0}
          onClick={prev}
          sx={{
            borderRadius: 9999,
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            bgcolor: dk.surfaceAccent,
            color: dk.surfaceStrong,
            "&:hover": { bgcolor: darken(dk.surfaceAccent, 0.05) },
          }}
        >
          Précédent
        </Button>
        <Button
          disableElevation
          disabled={current === STEPS.length - 1}
          onClick={next}
          sx={{
            borderRadius: 9999,
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
          }}
        >
          Suivant
        </Button>
      </Stack>
    </Box>
  );
}
