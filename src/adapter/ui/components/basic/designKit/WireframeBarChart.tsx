"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const DATA = [
  { label: "Jan", value: 12 },
  { label: "Fév", value: 18 },
  { label: "Mar", value: 22 },
  { label: "Avr", value: 16 },
  { label: "Mai", value: 28 },
  { label: "Juin", value: 32 },
  { label: "Juil", value: 24 },
  { label: "Août", value: 8 },
  { label: "Sep", value: 26 },
  { label: "Oct", value: 34 },
  { label: "Nov", value: 30 },
  { label: "Déc", value: 22 },
];

export default function WireframeBarChart() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...DATA.map((d) => d.value));
  const total = DATA.reduce((acc, d) => acc + d.value, 0);
  const avg = (total / DATA.length).toFixed(1);

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Heures par mois
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {total}h cumulées · moyenne {avg}h/mois
          </Typography>
        </Box>
        {hovered !== null ? (
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 9999,
              bgcolor: dk.surfaceStrong,
              color: dk.white,
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {DATA[hovered].label} : {DATA[hovered].value}h
          </Box>
        ) : null}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ height: 160 }}>
        {DATA.map((d, i) => {
          const h = (d.value / max) * 100;
          const isHover = hovered === i;
          return (
            <Stack
              key={d.label}
              alignItems="center"
              spacing={0.5}
              sx={{ flex: 1, height: "100%", justifyContent: "flex-end", cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <Box
                sx={{
                  width: "100%",
                  height: `${h}%`,
                  borderRadius: 1,
                  background: isHover
                    ? `linear-gradient(180deg, ${dk.tertiary} 0%, ${dk.surfaceStrong} 100%)`
                    : `linear-gradient(180deg, ${alpha(dk.surfaceStrong, 0.85)} 0%, ${dk.surfaceStrong} 100%)`,
                  transition: "all 0.15s ease",
                  transform: isHover ? "scaleY(1.04)" : "scaleY(1)",
                  transformOrigin: "bottom",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: 10,
                  fontWeight: isHover ? 800 : 600,
                  color: isHover ? "primary.main" : "text.secondary",
                }}
              >
                {d.label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
