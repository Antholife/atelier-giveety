"use client";

import { TrendingUp } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const SPARK = [12, 18, 14, 22, 19, 27, 24, 31, 29, 35, 33, 41];
const TARGET = 12482;

export default function WireframeImpactCounter() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(TARGET * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const max = Math.max(...SPARK);
  const points = SPARK.map((v, i) => {
    const x = (i / (SPARK.length - 1)) * 100;
    const y = 100 - (v / max) * 100;
    return `${x},${y}`;
  });
  const areaPath = `M0,100 L${points.join(" L")} L100,100 Z`;
  const linePath = `M${points.join(" L")}`;

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: { xs: 2.5, sm: 3 },
        background: `linear-gradient(135deg, ${dk.surfaceStrong} 0%, ${dk.tertiary} 100%)`,
        color: dk.white,
        boxShadow: `0 12px 32px ${alpha(dk.surfaceStrong, 0.25)}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: alpha(dk.white, 0.08),
        }}
      />
      <Stack direction="row" spacing={3} alignItems="center" sx={{ position: "relative" }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5, opacity: 0.85 }}>
            <TrendingUp sx={{ fontSize: 18 }} />
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: "0.1em" }}>
              IMPACT COLLECTIF
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: 36, sm: 48 },
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value.toLocaleString("fr-FR")}
            <Box component="span" sx={{ fontSize: 20, opacity: 0.85, ml: 0.5 }}>
              h
            </Box>
          </Typography>
          <Typography sx={{ mt: 0.5, opacity: 0.85, fontWeight: 600 }}>
            de bénévolat données par la communauté ce mois-ci
          </Typography>
        </Box>
        <Box sx={{ width: 120, flexShrink: 0 }}>
          <Box
            component="svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            sx={{ width: "100%", height: 70 }}
          >
            <path d={areaPath} fill={alpha(dk.white, 0.2)} />
            <path d={linePath} fill="none" stroke={dk.white} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Box>
          <Typography variant="caption" sx={{ display: "block", textAlign: "center", opacity: 0.85, fontWeight: 700 }}>
            +18% vs M-1
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
