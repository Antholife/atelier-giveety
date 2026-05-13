"use client";

import {
  EmojiEvents,
  Lock,
  LocalFireDepartment,
  Psychology,
  Star,
  WorkspacePremium,
  type SvgIconComponent,
} from "@mui/icons-material";
import { Box, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

type Badge = {
  id: string;
  label: string;
  desc: string;
  icon: SvgIconComponent;
  earned: boolean;
  progress?: number;
};

const BADGES: Badge[] = [
  { id: "100h", label: "+100h", desc: "100 heures cumulées", icon: WorkspacePremium, earned: true },
  { id: "mentor", label: "Mentor", desc: "5 nouveaux accompagnés", icon: Psychology, earned: true },
  { id: "fire", label: "Streak 30j", desc: "30 jours consécutifs", icon: LocalFireDepartment, earned: true },
  { id: "top", label: "Top 10", desc: "Classement mensuel", icon: EmojiEvents, earned: false, progress: 0.7 },
  { id: "polyglot", label: "Polyglotte", desc: "3 langues attestées", icon: Star, earned: false, progress: 0.33 },
  { id: "ambassador", label: "Ambassadeur", desc: "10 amis parrainés", icon: Star, earned: false, progress: 0.1 },
];

export default function WireframeBadgeShowcase() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const earned = BADGES.filter((b) => b.earned).length;

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
            Mes badges
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {earned} / {BADGES.length} débloqués
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(3, 1fr)", sm: "repeat(6, 1fr)" },
          gap: 2,
        }}
      >
        {BADGES.map((b) => {
          const Icon = b.icon;
          return (
            <Tooltip
              key={b.id}
              title={
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, display: "block" }}>
                    {b.label}
                  </Typography>
                  <Typography variant="caption">{b.desc}</Typography>
                </Box>
              }
              arrow
            >
              <Stack alignItems="center" spacing={0.75} sx={{ cursor: "help" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: b.earned
                      ? `linear-gradient(135deg, ${dk.tertiary} 0%, ${dk.surfaceStrong} 100%)`
                      : alpha(dk.border, 0.12),
                    color: b.earned ? dk.white : alpha(dk.textMuted, 0.6),
                    boxShadow: b.earned
                      ? `0 6px 18px ${alpha(dk.tertiary, 0.4)}`
                      : "none",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.06)" },
                    filter: b.earned ? "none" : "grayscale(0.6)",
                  }}
                >
                  <Icon sx={{ fontSize: 26 }} />
                  {!b.earned ? (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        bgcolor: dk.white,
                        border: `2px solid ${darken(dk.border, 0.05)}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: dk.textMuted,
                      }}
                    >
                      <Lock sx={{ fontSize: 11 }} />
                    </Box>
                  ) : null}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: b.earned ? "primary.main" : "text.secondary",
                    textAlign: "center",
                    lineHeight: 1.1,
                  }}
                  noWrap
                >
                  {b.label}
                </Typography>
                {!b.earned && b.progress !== undefined ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: 4,
                      borderRadius: 9999,
                      bgcolor: alpha(dk.border, 0.18),
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${b.progress * 100}%`,
                        height: "100%",
                        bgcolor: dk.tertiary,
                      }}
                    />
                  </Box>
                ) : null}
              </Stack>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
