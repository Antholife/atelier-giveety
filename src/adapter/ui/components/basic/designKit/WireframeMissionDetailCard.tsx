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
  Snackbar,
  Stack,
  Typography,
  useTheme,
  type SvgIconProps,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import { designKitPalette } from "./designKitPalette";

export type WireframeMissionDetailPayload = {
  /** Clé stable pour réinitialiser l’état local (boutons) au changement de mission */
  missionKey: string;
  title: string;
  /** Ligne sous le titre (« Org · vérifiée ») */
  orgVerification: string;
  chipA: string;
  chipB: string;
  when: string;
  duration: string;
  lieu: string;
  totalSpots: number;
  /** Inscrits au chargement / au changement de pin */
  registeredCount: number;
  prereqs: readonly string[];
};

const STATIC_DEFAULT_DETAIL: WireframeMissionDetailPayload = {
  missionKey: "fallback",
  title: "Maraude solidaire de quartier",
  orgVerification: "Les Petits Frères des Pauvres · vérifiée",
  chipA: "Solidarité",
  chipB: "Hebdo",
  when: "Sam. 18 mai · 19h",
  duration: "3 heures",
  lieu: "Plainpalais, Genève",
  totalSpots: 8,
  registeredCount: 5,
  prereqs: ["Être majeur·e", "Disponible 1× / semaine", "Tenue chaude"],
};

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

type WireframeMissionDetailCardProps = {
  mission?: WireframeMissionDetailPayload | null;
  /** Aligne la carte sur la hauteur du parent (ex. grille 50/50 avec la carte). */
  stretchHeight?: boolean;
};

export default function WireframeMissionDetailCard({ mission, stretchHeight }: WireframeMissionDetailCardProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  const d = mission ?? STATIC_DEFAULT_DETAIL;
  const [applied, setApplied] = useState(false);
  const [registered, setRegistered] = useState(d.registeredCount);
  const [saved, setSaved] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  useEffect(() => {
    setApplied(false);
    setSaved(false);
    setRegistered(d.registeredCount);
  }, [d.missionKey, d.registeredCount]);

  const capacity = Math.max(d.totalSpots, 1);

  const apply = useCallback(() => {
    setApplied((prev) => {
      const next = !prev;
      setRegistered((c) => c + (next ? 1 : -1));
      setSnack(next ? "Inscription envoyée ✓ (démo)" : "Tu as annulé ta candidature (démo)");
      return next;
    });
  }, []);

  const remaining = capacity - registered;
  const fillPct = (registered / capacity) * 100;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
        overflow: "hidden",
        ...(stretchHeight
          ? {
              height: "100%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }
          : {}),
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
          <Chip label={d.chipA} size="small" sx={{ bgcolor: dk.surfaceStrong, color: dk.white, fontWeight: 800 }} />
          <Chip
            label={d.chipB}
            size="small"
            sx={{ bgcolor: alpha(dk.white, 0.6), color: "primary.main", fontWeight: 800 }}
          />
        </Stack>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
          {d.title}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5, color: "text.secondary" }}>
          <Verified sx={{ fontSize: 14, color: "tertiary.main" }} />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {d.orgVerification}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: 3, ...(stretchHeight ? { flex: 1, display: "flex", flexDirection: "column" } : {}) }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
            gap: 1.5,
            mb: 2,
          }}
        >
          <InfoLine Icon={CalendarMonth} label="Quand" value={d.when} />
          <InfoLine Icon={AccessTime} label="Durée" value={d.duration} />
          <InfoLine Icon={LocationOn} label="Lieu" value={d.lieu} />
          <InfoLine Icon={Group} label="Équipe" value={`${registered} / ${capacity}`} />
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
                width: `${Math.min(Math.max(fillPct, 0), 100)}%`,
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
          {d.prereqs.map((p) => (
            <Stack key={p} direction="row" alignItems="center" spacing={1}>
              <CheckCircle sx={{ fontSize: 14, color: "tertiary.main" }} />
              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {p}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={stretchHeight ? { mt: "auto" } : undefined}>
          <Button
            fullWidth
            disableElevation
            onClick={apply}
            disabled={remaining <= 0 && !applied}
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
              color: saved ? "primary.main" : "text.secondary",
              border: `${saved ? 2 : 1}px solid ${saved ? dk.tertiary : alpha(dk.border, 0.3)}`,
              bgcolor: saved ? alpha(dk.tertiary, 0.06) : "transparent",
            }}
            onClick={() => {
              setSaved((s) => {
                const next = !s;
                setSnack(next ? "Mission ajoutée à tes favoris ⭐ (démo)" : "Retirée des favoris (démo)");
                return next;
              });
            }}
          >
            {saved ? "★ Sauvegardée" : "Sauvegarder"}
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2600}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
