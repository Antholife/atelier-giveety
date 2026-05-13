"use client";

import { TrendingDown, TrendingFlat, TrendingUp } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

type Entry = {
  id: string;
  initials: string;
  name: string;
  hours: number;
  delta: number;
};

const ENTRIES: Entry[] = [
  { id: "1", initials: "EM", name: "Élise Marchand", hours: 184, delta: 2 },
  { id: "2", initials: "TL", name: "Théo Lefèvre", hours: 167, delta: -1 },
  { id: "3", initials: "NA", name: "Nora Aït", hours: 152, delta: 0 },
  { id: "4", initials: "JM", name: "Julien Marin", hours: 124, delta: 4 },
  { id: "5", initials: "SP", name: "Sara Petit", hours: 109, delta: -2 },
];

const PODIUM_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function WireframeLeaderboard() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

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
        Top bénévoles · ce mois
      </Typography>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="flex-end"
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        {[1, 0, 2].map((idx) => {
          const e = ENTRIES[idx];
          const heights = [82, 110, 64];
          return (
            <Stack key={e.id} alignItems="center" spacing={0.5} sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: dk.surfaceAccent,
                  color: dk.surfaceStrong,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  border: `3px solid ${PODIUM_COLORS[idx]}`,
                  position: "relative",
                  mb: 0.5,
                }}
              >
                {e.initials}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -6,
                    right: -6,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    bgcolor: PODIUM_COLORS[idx],
                    color: dk.surfaceStrong,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 11,
                    border: `2px solid ${dk.white}`,
                  }}
                >
                  {idx + 1}
                </Box>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.main" }} noWrap>
                {e.name.split(" ")[0]}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "tertiary.main" }}>
                {e.hours}h
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 72,
                  height: heights[idx],
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  background: `linear-gradient(180deg, ${PODIUM_COLORS[idx]} 0%, ${alpha(PODIUM_COLORS[idx], 0.5)} 100%)`,
                }}
              />
            </Stack>
          );
        })}
      </Stack>

      <Stack spacing={0.5}>
        {ENTRIES.slice(3).map((e, i) => {
          const rank = i + 4;
          const Icon = e.delta > 0 ? TrendingUp : e.delta < 0 ? TrendingDown : TrendingFlat;
          const deltaColor = e.delta > 0 ? "success.main" : e.delta < 0 ? "error.main" : "text.secondary";
          return (
            <Stack
              key={e.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                bgcolor: alpha(dk.surfaceMuted, 0.25),
              }}
            >
              <Typography sx={{ fontWeight: 800, color: "text.secondary", minWidth: 24 }}>
                #{rank}
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: dk.surfaceAccent,
                  color: dk.surfaceStrong,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {e.initials}
              </Box>
              <Typography sx={{ flex: 1, fontWeight: 700, color: "primary.main" }} noWrap>
                {e.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: deltaColor }}>
                <Icon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 800 }}>
                  {e.delta > 0 ? `+${e.delta}` : e.delta}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "tertiary.main", minWidth: 36, textAlign: "right" }}>
                {e.hours}h
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
