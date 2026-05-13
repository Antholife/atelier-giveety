"use client";

import { LocationOn, OpenInNew, Verified } from "@mui/icons-material";
import { Box, Button, Chip, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const ORGA = {
  name: "Singa France",
  initials: "SF",
  city: "Paris · Lyon · Lille",
  bio: "Asso d'inclusion par la rencontre interculturelle. On soutient l'arrivée et l'engagement des personnes nouvellement arrivées.",
  tags: ["Inclusion", "Médiation", "Hebdo"],
  stats: [
    { label: "Membres", value: "1.2k" },
    { label: "Missions", value: "37" },
    { label: "Heures", value: "8.4k" },
  ],
  missions: [
    { id: "1", title: "Atelier conversation FLE", spots: 4 },
    { id: "2", title: "Accompagnement administratif", spots: 2 },
    { id: "3", title: "Café d'accueil hebdomadaire", spots: 6 },
  ],
};

export default function WireframeOrgaProfile() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [following, setFollowing] = useState(false);

  const toggle = useCallback(() => setFollowing((v) => !v), []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: 110,
          background: `linear-gradient(120deg, ${dk.surfaceStrong} 0%, ${dk.tertiary} 100%)`,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            px: 1.25,
            py: 0.5,
            borderRadius: 9999,
            bgcolor: alpha(dk.white, 0.2),
            color: dk.white,
            fontSize: 11,
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Verified sx={{ fontSize: 14 }} />
          Vérifiée
        </Box>
      </Box>

      <Box sx={{ px: 3, pb: 3 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            bgcolor: dk.white,
            border: `4px solid ${dk.white}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 24,
            color: "primary.main",
            mt: -5,
            mb: 1.5,
            boxShadow: `0 4px 14px ${alpha(dk.surfaceStrong, 0.18)}`,
            background: `linear-gradient(135deg, ${dk.primaryLight} 0%, ${dk.surfaceAccent} 100%)`,
          }}
        >
          {ORGA.initials}
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-start" }} spacing={1.5}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}>
              {ORGA.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "text.secondary", mt: 0.5 }}>
              <LocationOn sx={{ fontSize: 14 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {ORGA.city}
              </Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              disableElevation
              onClick={toggle}
              sx={{
                borderRadius: 9999,
                textTransform: "none",
                fontWeight: 800,
                px: 2.5,
                bgcolor: following ? dk.surfaceAccent : dk.surfaceStrong,
                color: following ? dk.surfaceStrong : dk.white,
                "&:hover": {
                  bgcolor: following ? darken(dk.surfaceAccent, 0.05) : darken(dk.surfaceStrong, 0.1),
                },
              }}
            >
              {following ? "Abonné·e" : "Suivre"}
            </Button>
            <Button
              endIcon={<OpenInNew sx={{ fontSize: 14 }} />}
              sx={{ textTransform: "none", fontWeight: 700, color: "primary.main" }}
            >
              Site
            </Button>
          </Stack>
        </Stack>

        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, mt: 1.5 }}>
          {ORGA.bio}
        </Typography>

        <Stack direction="row" spacing={0.75} sx={{ mt: 1.5, flexWrap: "wrap", gap: 0.75 }}>
          {ORGA.tags.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{ bgcolor: alpha(dk.primaryLight, 0.7), color: "primary.main", fontWeight: 700 }}
            />
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(dk.surfaceMuted, 0.3) }}
        >
          {ORGA.stats.map((s) => (
            <Stack key={s.label} alignItems="center" sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, color: "primary.main" }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                {s.label}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, mt: 2, mb: 1, display: "block", letterSpacing: "0.08em" }}>
          MISSIONS OUVERTES
        </Typography>
        <Stack spacing={0.75}>
          {ORGA.missions.map((m) => (
            <Stack
              key={m.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                border: `1px solid ${alpha(dk.border, 0.15)}`,
                cursor: "pointer",
                "&:hover": { bgcolor: alpha(dk.surfaceAccent, 0.3) },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, color: "primary.main" }} noWrap>
                  {m.title}
                </Typography>
              </Box>
              <Chip label={`${m.spots} places`} size="small" sx={{ bgcolor: alpha(dk.tertiaryLight, 0.6), color: "tertiary.main", fontWeight: 800 }} />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
