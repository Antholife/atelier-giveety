"use client";

import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

type Props = {
  label?: string;
  value?: string;
  delta?: number;
  series?: number[];
};

const DEFAULT_SERIES = [4, 6, 5, 8, 7, 9, 12, 10, 13, 15, 14, 18];

export default function WireframeKPITile({
  label = "Heures ce mois",
  value = "42 h",
  delta = 18,
  series = DEFAULT_SERIES,
}: Props) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const W = 120;
  const H = 36;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = Math.max(1, max - min);
  const step = W / (series.length - 1);

  const points = series
    .map((v, i) => `${i * step},${H - ((v - min) / range) * H}`)
    .join(" ");
  const area = `0,${H} ${points} ${W},${H}`;
  const positive = delta >= 0;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: 2,
        cursor: "default",
        transition: "transform 0.15s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 10px 24px ${alpha(dk.surfaceStrong, 0.14)}`,
        },
      }}
    >
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.05em" }}>
        {label.toUpperCase()}
      </Typography>
      <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={1.5} sx={{ mt: 0.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          {positive ? (
            <ArrowDropUp sx={{ color: "tertiary.main", fontSize: 22 }} />
          ) : (
            <ArrowDropDown sx={{ color: "#E5484D", fontSize: 22 }} />
          )}
          <Typography sx={{ fontWeight: 800, color: positive ? "tertiary.main" : "#E5484D", fontSize: 13 }}>
            {Math.abs(delta)}%
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ mt: 1 }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none">
          <defs>
            <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dk.tertiary} stopOpacity="0.35" />
              <stop offset="100%" stopColor={dk.tertiary} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#kpiGrad)" />
          <polyline
            points={points}
            fill="none"
            stroke={dk.tertiary}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={W} cy={H - ((series[series.length - 1] - min) / range) * H} r={2.5} fill={dk.tertiary} />
        </svg>
      </Box>
    </Box>
  );
}
