"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const STAGES = [
  { id: "viewed", label: "Vu", value: 1240 },
  { id: "clicked", label: "Cliqué", value: 642 },
  { id: "applied", label: "Postulé", value: 248 },
  { id: "confirmed", label: "Confirmé", value: 98 },
];

export default function WireframeFunnelChart() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [hover, setHover] = useState<string | null>(null);

  const max = STAGES[0].value;

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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Funnel d'engagement
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Vu → cliqué → postulé → confirmé · 30 derniers jours.
      </Typography>

      <Stack spacing={1}>
        {STAGES.map((s, i) => {
          const pct = (s.value / max) * 100;
          const conv = i === 0 ? 100 : (s.value / STAGES[i - 1].value) * 100;
          const active = hover === s.id;
          return (
            <Stack
              key={s.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
              sx={{ cursor: "pointer" }}
            >
              <Typography sx={{ width: 80, fontWeight: 800, color: "primary.main", fontSize: 13 }}>
                {s.label}
              </Typography>
              <Box sx={{ flex: 1, position: "relative", height: 28 }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: `${(100 - pct) / 2}%`,
                    width: `${pct}%`,
                    height: "100%",
                    borderRadius: 1,
                    background: `linear-gradient(135deg, ${dk.surfaceStrong} 0%, ${dk.tertiary} 100%)`,
                    boxShadow: active ? `0 4px 12px ${alpha(dk.surfaceStrong, 0.4)}` : "none",
                    transition: "all 0.2s ease",
                    transform: active ? "scaleY(1.1)" : "scaleY(1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: dk.white,
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {s.value.toLocaleString("fr-FR")}
                </Box>
              </Box>
              <Box sx={{ width: 60, textAlign: "right" }}>
                <Typography variant="caption" sx={{ color: i === 0 ? "text.secondary" : "tertiary.main", fontWeight: 800 }}>
                  {i === 0 ? "—" : `${Math.round(conv)}%`}
                </Typography>
              </Box>
            </Stack>
          );
        })}
      </Stack>

      <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(dk.surfaceMuted, 0.3) }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
            Conversion globale
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "tertiary.main" }}>
            {Math.round((STAGES[STAGES.length - 1].value / STAGES[0].value) * 100)}% — Vu → Confirmé
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
