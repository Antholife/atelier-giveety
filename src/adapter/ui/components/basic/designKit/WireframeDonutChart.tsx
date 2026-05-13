"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Segment = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export default function WireframeDonutChart() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const segments: Segment[] = useMemo(
    () => [
      { id: "soft", label: "Savoir-être", value: 8, color: dk.surfaceStrong },
      { id: "hard", label: "Savoir-faire", value: 5, color: dk.tertiary },
      { id: "lang", label: "Langues", value: 3, color: dk.surfaceAccent },
      { id: "tech", label: "Outils", value: 2, color: dk.mint },
    ],
    [dk],
  );
  const [active, setActive] = useState<string | null>(null);
  const total = segments.reduce((acc, s) => acc + s.value, 0);

  const SIZE = 180;
  const STROKE = 24;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * RADIUS;

  let acc = 0;
  const arcs = segments.map((s) => {
    const len = (s.value / total) * CIRC;
    const offset = -acc;
    acc += len;
    return { ...s, len, offset };
  });

  const activeSeg = active ? segments.find((s) => s.id === active) : null;

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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 2 }}>
        Répartition de mes compétences
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
        <Box sx={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
          <Box
            component="svg"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            sx={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
          >
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke={alpha(dk.border, 0.1)} strokeWidth={STROKE} />
            {arcs.map((a) => {
              const isHover = active === a.id;
              return (
                <circle
                  key={a.id}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={a.color}
                  strokeWidth={isHover ? STROKE + 4 : STROKE}
                  strokeDasharray={`${a.len} ${CIRC - a.len}`}
                  strokeDashoffset={a.offset}
                  onMouseEnter={() => setActive(a.id)}
                  onMouseLeave={() => setActive(null)}
                  style={{ cursor: "pointer", transition: "stroke-width 0.15s ease" }}
                />
              );
            })}
          </Box>
          <Stack
            alignItems="center"
            sx={{ position: "absolute", inset: 0, justifyContent: "center", pointerEvents: "none" }}
          >
            {activeSeg ? (
              <>
                <Typography variant="h4" sx={{ fontWeight: 800, color: activeSeg.color, lineHeight: 1 }}>
                  {Math.round((activeSeg.value / total) * 100)}%
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  {activeSeg.label}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1 }}>
                  {total}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  compétences
                </Typography>
              </>
            )}
          </Stack>
        </Box>

        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          {segments.map((s) => {
            const pct = Math.round((s.value / total) * 100);
            const isActive = active === s.id;
            return (
              <Stack
                key={s.id}
                direction="row"
                alignItems="center"
                spacing={1.5}
                onMouseEnter={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: 1.5,
                  cursor: "pointer",
                  bgcolor: isActive ? alpha(s.color, 0.15) : "transparent",
                  transition: "background-color 0.15s ease",
                }}
              >
                <Box sx={{ width: 14, height: 14, borderRadius: 0.75, bgcolor: s.color }} />
                <Typography variant="caption" sx={{ flex: 1, fontWeight: 700 }}>
                  {s.label}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
                  {s.value} · {pct}%
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
