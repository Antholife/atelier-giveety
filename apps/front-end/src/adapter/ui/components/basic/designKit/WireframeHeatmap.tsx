"use client";

import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

const WEEKS = 30;
const DAYS = 7;

function generate() {
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  };
  const random = rng(42);
  const matrix: number[][] = [];
  for (let w = 0; w < WEEKS; w += 1) {
    const col: number[] = [];
    for (let d = 0; d < DAYS; d += 1) {
      const r = random();
      let level = 0;
      if (r > 0.5) level = 1;
      if (r > 0.7) level = 2;
      if (r > 0.85) level = 3;
      if (r > 0.95) level = 4;
      col.push(level);
    }
    matrix.push(col);
  }
  return matrix;
}

const MONTH_LABELS = ["mai", "juin", "juil", "août", "sept", "oct", "nov"];
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

export default function WireframeHeatmap() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const data = useMemo(generate, []);

  const total = data.flat().reduce((acc, v) => acc + v, 0);
  const active = data.flat().filter((v) => v > 0).length;

  const colorFor = (level: number) => {
    if (level === 0) return alpha(dk.border, 0.12);
    if (level === 1) return alpha(dk.tertiary, 0.25);
    if (level === 2) return alpha(dk.tertiary, 0.5);
    if (level === 3) return alpha(dk.tertiary, 0.75);
    return dk.tertiary;
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
        overflow: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Calendrier d'engagement
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {active} jours actifs · {total} actions sur 30 semaines
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Moins
          </Typography>
          {[0, 1, 2, 3, 4].map((l) => (
            <Box key={l} sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: colorFor(l) }} />
          ))}
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Plus
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ display: "flex", overflowX: "auto", pb: 1 }}>
        <Stack spacing={0.5} sx={{ pr: 0.75, pt: 2 }}>
          {DAY_LABELS.map((d, i) => (
            <Box
              key={i}
              sx={{
                height: 12,
                fontSize: 10,
                color: alpha(dk.textMuted, 0.7),
                fontWeight: 600,
                visibility: i % 2 === 0 ? "visible" : "hidden",
              }}
            >
              {d}
            </Box>
          ))}
        </Stack>
        <Box>
          <Stack direction="row" spacing={1.25} sx={{ mb: 0.5, pl: 0.25 }}>
            {MONTH_LABELS.slice(0, Math.ceil(WEEKS / 4.3)).map((m, i) => (
              <Typography
                key={`${m}-${i}`}
                variant="caption"
                sx={{ fontSize: 10, color: "text.secondary", fontWeight: 600, minWidth: 50 }}
              >
                {m}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {data.map((week, w) => (
              <Stack key={w} spacing={0.5}>
                {week.map((level, d) => (
                  <Tooltip
                    key={d}
                    title={
                      <Typography variant="caption">
                        Semaine {w + 1} · {level === 0 ? "Aucun engagement" : `${level * 2}h d'engagement`}
                      </Typography>
                    }
                    arrow
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 0.5,
                        bgcolor: colorFor(level),
                        cursor: "pointer",
                        transition: "transform 0.1s ease",
                        "&:hover": { transform: "scale(1.4)" },
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
