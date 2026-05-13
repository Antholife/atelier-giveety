"use client";

import { Box, Slider, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const SKILLS = [
  { id: "comm", label: "Communication", emoji: "🗣️" },
  { id: "lead", label: "Leadership", emoji: "🧭" },
  { id: "empathy", label: "Empathie", emoji: "💚" },
  { id: "tech", label: "Numérique", emoji: "💻" },
  { id: "logistics", label: "Organisation", emoji: "📦" },
];

const LEVELS = ["Découverte", "Initié·e", "Confirmé·e", "Expert·e"];

export default function WireframeSkillsAssessment() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [scores, setScores] = useState<Record<string, number>>({
    comm: 75,
    lead: 40,
    empathy: 90,
    tech: 60,
    logistics: 30,
  });

  const handleChange = useCallback((id: string) => (_e: Event, v: number | number[]) => {
    setScores((prev) => ({ ...prev, [id]: typeof v === "number" ? v : v[0] }));
  }, []);

  const avg = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / SKILLS.length);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Auto-évaluation
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Glisse pour ajuster ton niveau · 1 min.
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "tertiary.main", lineHeight: 1 }}>
            {avg}%
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
            Score global
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={2}>
        {SKILLS.map((s) => {
          const score = scores[s.id];
          const levelIdx = Math.min(LEVELS.length - 1, Math.floor(score / 25));
          return (
            <Box key={s.id}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
                <Box sx={{ fontSize: 18 }}>{s.emoji}</Box>
                <Typography sx={{ flex: 1, fontWeight: 800, color: "primary.main" }}>
                  {s.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 9999,
                    bgcolor: alpha(dk.tertiaryLight, 0.6),
                    color: "tertiary.main",
                    fontWeight: 800,
                  }}
                >
                  {LEVELS[levelIdx]}
                </Typography>
              </Stack>
              <Slider
                value={score}
                onChange={handleChange(s.id)}
                min={0}
                max={100}
                step={5}
                sx={{
                  color: dk.surfaceStrong,
                  "& .MuiSlider-thumb": { borderColor: dk.tertiary },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
