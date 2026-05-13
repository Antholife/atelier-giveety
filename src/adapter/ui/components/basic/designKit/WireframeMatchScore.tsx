"use client";

import { Bolt, CheckCircle, Place, Schedule } from "@mui/icons-material";
import { Box, Slider, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Criterion = {
  id: string;
  label: string;
  icon: typeof CheckCircle;
  weight: number;
  match: number;
};

const INITIAL: Criterion[] = [
  { id: "skills", label: "Compétences", icon: Bolt, weight: 40, match: 0.85 },
  { id: "distance", label: "Distance", icon: Place, weight: 25, match: 0.72 },
  { id: "schedule", label: "Disponibilités", icon: Schedule, weight: 20, match: 0.91 },
  { id: "values", label: "Valeurs", icon: CheckCircle, weight: 15, match: 0.65 },
];

export default function WireframeMatchScore() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [criteria, setCriteria] = useState<Criterion[]>(INITIAL);
  const [animatedScore, setAnimatedScore] = useState(0);

  const score = useMemo(
    () =>
      Math.round(
        criteria.reduce((acc, c) => acc + c.match * c.weight, 0) /
          criteria.reduce((acc, c) => acc + c.weight, 0) *
          100,
      ),
    [criteria],
  );

  useEffect(() => {
    const start = animatedScore;
    const startTime = performance.now();
    const duration = 500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      setAnimatedScore(Math.round(start + (score - start) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const verdict =
    score >= 85 ? { label: "Match parfait", color: dk.tertiary } :
    score >= 70 ? { label: "Bon match", color: dk.surfaceStrong } :
    { label: "À considérer", color: dk.textMuted };

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 2 }}>
        Match score · Maraude solidaire
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
        <Box sx={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
          <Box
            component="svg"
            viewBox="0 0 140 140"
            sx={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
          >
            <circle cx={70} cy={70} r={radius} fill="none" stroke={alpha(dk.border, 0.15)} strokeWidth={10} />
            <circle
              cx={70}
              cy={70}
              r={radius}
              fill="none"
              stroke={verdict.color}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease" }}
            />
          </Box>
          <Stack
            alignItems="center"
            sx={{ position: "absolute", inset: 0, justifyContent: "center" }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, color: verdict.color, lineHeight: 1 }}>
              {animatedScore}%
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mt: 0.5 }}>
              {verdict.label}
            </Typography>
          </Stack>
        </Box>

        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          {criteria.map((c, i) => {
            const Icon = c.icon;
            return (
              <Box key={c.id}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <Icon sx={{ fontSize: 16, color: "primary.main" }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, flex: 1 }}>
                    {c.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "tertiary.main" }}>
                    {Math.round(c.match * 100)}%
                  </Typography>
                </Stack>
                <Slider
                  value={c.match * 100}
                  onChange={(_, v) =>
                    setCriteria((prev) =>
                      prev.map((p, idx) =>
                        idx === i ? { ...p, match: (v as number) / 100 } : p,
                      ),
                    )
                  }
                  size="small"
                  sx={{
                    color: verdict.color,
                    "& .MuiSlider-thumb": { width: 14, height: 14 },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
