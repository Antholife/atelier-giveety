"use client";

import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const MONTHS = ["Mai", "Juin", "Juil", "Août", "Sept", "Oct"];

type Item = {
  id: string;
  label: string;
  start: number;
  span: number;
  color: "primary" | "tertiary" | "muted";
};

const ITEMS: Item[] = [
  { id: "1", label: "Maraude hebdo", start: 0, span: 6, color: "primary" },
  { id: "2", label: "Festival Solidays", start: 1.7, span: 0.5, color: "tertiary" },
  { id: "3", label: "Atelier conversation", start: 0.5, span: 3, color: "muted" },
  { id: "4", label: "Mission longue Calais", start: 3, span: 2.5, color: "primary" },
  { id: "5", label: "Forum des assos", start: 4.5, span: 0.6, color: "tertiary" },
];

export default function WireframeGanttBar() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [hover, setHover] = useState<string | null>(null);

  const colorMap: Record<Item["color"], string> = {
    primary: dk.surfaceStrong,
    tertiary: dk.tertiary,
    muted: alpha(dk.surfaceStrong, 0.55),
  };

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
        Mes engagements planifiés
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Vue Gantt sur 6 mois.
      </Typography>

      <Stack direction="row" sx={{ pl: "120px", mb: 0.5 }}>
        {MONTHS.map((m) => (
          <Box
            key={m}
            sx={{
              flex: 1,
              textAlign: "center",
              fontSize: 10,
              fontWeight: 800,
              color: "text.secondary",
              borderLeft: `1px dashed ${alpha(dk.border, 0.3)}`,
              py: 0.5,
            }}
          >
            {m}
          </Box>
        ))}
      </Stack>

      <Stack spacing={0.75}>
        {ITEMS.map((item) => {
          const left = (item.start / MONTHS.length) * 100;
          const width = (item.span / MONTHS.length) * 100;
          const active = hover === item.id;
          return (
            <Stack key={item.id} direction="row" alignItems="center" spacing={0}>
              <Box sx={{ width: 120, flexShrink: 0, pr: 1 }}>
                <Typography sx={{ fontWeight: 700, color: "primary.main", fontSize: 12 }} noWrap>
                  {item.label}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, position: "relative", height: 28, bgcolor: alpha(dk.surfaceMuted, 0.2), borderRadius: 1 }}>
                {MONTHS.map((m, i) => (
                  <Box
                    key={m}
                    sx={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: `${(i / MONTHS.length) * 100}%`,
                      borderLeft: i === 0 ? "none" : `1px dashed ${alpha(dk.border, 0.2)}`,
                    }}
                  />
                ))}
                <Tooltip title={`${item.label} · ${item.span} mois`} placement="top" arrow>
                  <Box
                    onMouseEnter={() => setHover(item.id)}
                    onMouseLeave={() => setHover(null)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      bottom: 4,
                      left: `${left}%`,
                      width: `${width}%`,
                      borderRadius: 9999,
                      bgcolor: colorMap[item.color],
                      cursor: "pointer",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      transform: active ? "scaleY(1.15)" : "scaleY(1)",
                      boxShadow: active ? `0 4px 10px ${alpha(colorMap[item.color], 0.5)}` : "none",
                    }}
                  />
                </Tooltip>
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
