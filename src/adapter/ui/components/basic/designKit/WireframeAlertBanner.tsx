"use client";

import {
  CheckCircle,
  Close,
  ErrorOutline,
  InfoOutlined,
  Refresh,
  WarningAmber,
} from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ComponentType } from "react";
import type { SvgIconProps } from "@mui/material";
import { designKitPalette } from "./designKitPalette";

type Variant = "info" | "warning" | "success" | "error";

const VARIANTS: Record<
  Variant,
  { Icon: ComponentType<SvgIconProps>; title: string; body: string; color: string; label: string }
> = {
  info: {
    Icon: InfoOutlined,
    title: "Nouvelle fonctionnalité",
    body: "L'certificat collective est en bêta — clique pour la tester.",
    color: "#3F8DE8",
    label: "Info",
  },
  success: {
    Icon: CheckCircle,
    title: "Profil sauvegardé",
    body: "Tes modifications sont en ligne.",
    color: "#0BC5A0",
    label: "Succès",
  },
  warning: {
    Icon: WarningAmber,
    title: "Manager non confirmé",
    body: "Camille n'a pas encore validé son rôle. Relance-la ?",
    color: "#F4B400",
    label: "Warning",
  },
  error: {
    Icon: ErrorOutline,
    title: "Échec de l'envoi",
    body: "Connexion perdue. On retente automatiquement…",
    color: "#E5484D",
    label: "Erreur",
  },
};

export default function WireframeAlertBanner() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [variant, setVariant] = useState<Variant>("info");
  const [open, setOpen] = useState(true);

  const cycle = useCallback(() => {
    const arr: Variant[] = ["info", "success", "warning", "error"];
    setVariant((v) => arr[(arr.indexOf(v) + 1) % arr.length]);
    setOpen(true);
  }, []);

  const v = VARIANTS[variant];
  const Icon = v.Icon;

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
          Bannières contextuelles
        </Typography>
        <Button
          size="small"
          startIcon={<Refresh sx={{ fontSize: 14 }} />}
          onClick={cycle}
          sx={{ textTransform: "none", fontWeight: 700, color: "tertiary.main" }}
        >
          Variant : {v.label}
        </Button>
      </Stack>

      {open ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: alpha(v.color, 0.12),
            borderLeft: `4px solid ${v.color}`,
            transition: "all 0.2s ease",
          }}
        >
          <Icon sx={{ color: v.color, fontSize: 22, mt: 0.25 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
              {v.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, mt: 0.25 }}>
              {v.body}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} aria-label="Fermer">
            <Close fontSize="small" sx={{ color: "text.secondary" }} />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={() => setOpen(true)}
          sx={{
            p: 2,
            borderRadius: 2,
            border: `1px dashed ${alpha(dk.border, 0.3)}`,
            textAlign: "center",
            cursor: "pointer",
            color: "text.secondary",
            fontWeight: 700,
          }}
        >
          + Réafficher la bannière
        </Box>
      )}
    </Box>
  );
}
