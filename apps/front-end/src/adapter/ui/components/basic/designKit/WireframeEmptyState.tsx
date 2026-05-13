"use client";

import { Add, Search } from "@mui/icons-material";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

export default function WireframeEmptyState() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px dashed ${alpha(dk.border, 0.4)}`,
        p: { xs: 3, sm: 5 },
        textAlign: "center",
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 200 140"
        sx={{ width: 200, height: 140, mx: "auto", mb: 2 }}
      >
        <defs>
          <linearGradient id="empty-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={dk.primaryLight} />
            <stop offset="100%" stopColor={dk.surfaceAccent} />
          </linearGradient>
        </defs>
        <circle cx={100} cy={80} r={48} fill="url(#empty-grad)" />
        <rect x={62} y={50} width={76} height={60} rx={6} fill={dk.white} stroke={dk.surfaceStrong} strokeWidth={2} />
        <line x1={70} y1={62} x2={130} y2={62} stroke={alpha(dk.border, 0.4)} strokeWidth={2} />
        <line x1={70} y1={72} x2={120} y2={72} stroke={alpha(dk.border, 0.3)} strokeWidth={2} />
        <line x1={70} y1={82} x2={110} y2={82} stroke={alpha(dk.border, 0.3)} strokeWidth={2} />
        <circle cx={140} cy={50} r={14} fill={dk.tertiary} />
        <text x={140} y={55} textAnchor="middle" fontSize={16} fontWeight={800} fill={dk.white}>?</text>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
        Pas encore d'engagement
      </Typography>
      <Typography sx={{ color: "text.secondary", fontWeight: 500, mb: 3, maxWidth: 360, mx: "auto" }}>
        Trouve une mission proche de chez toi, on te certifiera tes compétences au fur et à mesure.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
        <Button
          startIcon={<Search />}
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 9999,
            px: 2.5,
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
          }}
        >
          Découvrir des missions
        </Button>
        <Button
          startIcon={<Add />}
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 9999,
            px: 2.5,
            bgcolor: dk.surfaceAccent,
            color: dk.surfaceStrong,
            "&:hover": { bgcolor: darken(dk.surfaceAccent, 0.05) },
          }}
        >
          Saisir manuellement
        </Button>
      </Stack>
    </Box>
  );
}
