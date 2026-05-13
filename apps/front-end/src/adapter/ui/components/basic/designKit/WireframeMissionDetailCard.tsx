"use client";

import {
  AccessTime,
  CalendarMonth,
  CheckCircle,
  Group,
  LocationOn,
  Verified,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  useTheme,
  type SvgIconProps,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ComponentType } from "react";
import { designKitPalette } from "./designKitPalette";

const TOTAL_SPOTS = 8;

function InfoLine({
  Icon,
  label,
  value,
}: {
  Icon: ComponentType<SvgIconProps>;
  label: string;
  value: string;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Icon sx={{ fontSize: 18, color: "primary.main" }} />
      <Box>
        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", lineHeight: 1, fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function WireframeMissionDetailCard() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [applied, setApplied] = useState(false);
  const [registered, setRegistered] = useState(3);

  const apply = useCallback(() => {
    setApplied((prev) => {
      const next = !prev;
      setRegistered((c) => c + (next ? 1 : -1));
      return next;
    });
  }, []);

  const remaining = TOTAL_SPOTS - registered;
  const fillPct = (registered / TOTAL_SPOTS) * 100;

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
          px: 3,
          py: 2.5,
          background: `linear-gradient(120deg, ${alpha(dk.tertiaryLight, 0.6)} 0%, ${alpha(dk.primaryLight, 0.4)} 100%)`,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap", gap: 0.75 }}>
          <Chip
            label="Solidarité"
            size="small"
            sx={{ bgcolor: dk.surfaceStrong, color: dk.white, fontWeight: 800 }}
          />
          <Chip
            label="Hebdo"
            size="small"
            sx={{ bgcolor: alpha(dk.white, 0.6), color: "primary.main", fontWeight: 800 }}
          />
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
          Maraude solidaire de quartier
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5, color: "text.secondary" }}>
          <Verified sx={{ fontSize: 14, color: "tertiary.main" }} />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            Les Petits Frères des Pauvres · vérifiée
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
            gap: 1.5,
            mb: 2,
          }}
        >
          <InfoLine Icon={CalendarMonth} label="Quand" value="Sam. 18 mai · 19h" />
          <InfoLine Icon={AccessTime} label="Durée" value="3 heures" />
          <InfoLine Icon={LocationOn} label="Lieu" value="Paris 19e" />
          <InfoLine Icon={Group} label="Équipe" value={`${registered} / ${TOTAL_SPOTS}`} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
              Inscriptions
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "tertiary.main" }}>
              {remaining} place{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""}
            </Typography>
          </Stack>
          <Box sx={{ height: 6, borderRadius: 9999, bgcolor: alpha(dk.border, 0.15), overflow: "hidden" }}>
            <Box
              sx={{
                width: `${fillPct}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${dk.surfaceStrong}, ${dk.tertiary})`,
                transition: "width 0.4s ease",
              }}
            />
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: "0.08em", display: "block", mb: 0.5 }}>
          PRÉREQUIS
        </Typography>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          {["Être majeur·e", "Disponible 1× / semaine", "Tenue chaude"].map((p) => (
            <Stack key={p} direction="row" alignItems="center" spacing={1}>
              <CheckCircle sx={{ fontSize: 14, color: "tertiary.main" }} />
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {p}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            fullWidth
            disableElevation
            onClick={apply}
            disabled={remaining === 0 && !applied}
            sx={{
              borderRadius: 9999,
              textTransform: "none",
              fontWeight: 800,
              py: 1.25,
              bgcolor: applied ? alpha(dk.mint, 0.6) : dk.surfaceStrong,
              color: applied ? "primary.main" : dk.white,
              "&:hover": {
                bgcolor: applied ? alpha(dk.mint, 0.8) : darken(dk.surfaceStrong, 0.1),
              },
            }}
          >
            {applied ? "✓ Inscrit·e" : "Postuler à cette mission"}
          </Button>
          <Button
            sx={{
              borderRadius: 9999,
              textTransform: "none",
              fontWeight: 700,
              px: 2.5,
              color: "text.secondary",
              border: `1px solid ${alpha(dk.border, 0.3)}`,
            }}
          >
            Sauvegarder
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
