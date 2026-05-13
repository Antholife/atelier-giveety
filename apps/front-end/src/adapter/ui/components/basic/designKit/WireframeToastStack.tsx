"use client";

import { CheckCircle, Close, ErrorOutline, InfoOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import type { SvgIconProps } from "@mui/material";
import { designKitPalette } from "./designKitPalette";

type Variant = "success" | "info" | "error";

const PRESETS: { variant: Variant; title: string; body: string }[] = [
  { variant: "success", title: "Mission ajoutée", body: "Maraude · 18 mai" },
  { variant: "info", title: "Manager invité", body: "Camille a reçu un mail" },
  { variant: "error", title: "Échec de sync", body: "On retente dans 5 s" },
  { variant: "success", title: "Certificat prête", body: "Téléchargement disponible" },
];

const ICONS: Record<Variant, ComponentType<SvgIconProps>> = {
  success: CheckCircle,
  info: InfoOutlined,
  error: ErrorOutline,
};

const COLORS: Record<Variant, string> = {
  success: "#0BC5A0",
  info: "#3F8DE8",
  error: "#E5484D",
};

type Toast = { id: string; variant: Variant; title: string; body: string };

export default function WireframeToastStack() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(() => {
    counterRef.current += 1;
    const i = counterRef.current % PRESETS.length;
    const p = PRESETS[i];
    const id = `toast-${Date.now()}-${counterRef.current}`;
    setToasts((prev) => [...prev, { id, ...p }]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const last = toasts[toasts.length - 1];
    const timer = window.setTimeout(() => dismiss(last.id), 4000);
    return () => window.clearTimeout(timer);
  }, [toasts, dismiss]);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
        minHeight: 240,
        overflow: "hidden",
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Pile de toasts
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Auto-disparition en 4 s · clique pour empiler.
      </Typography>

      <Button
        onClick={push}
        disableElevation
        sx={{
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 800,
          bgcolor: dk.surfaceStrong,
          color: dk.white,
          "&:hover": { bgcolor: dk.surfaceStrong, opacity: 0.9 },
        }}
      >
        + Déclencher un toast
      </Button>

      <Stack
        spacing={1}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          left: 16,
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.variant];
          const color = COLORS[t.variant];
          return (
            <Stack
              key={t.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                pointerEvents: "all",
                pl: 1.5,
                pr: 1,
                py: 1,
                borderRadius: 2,
                bgcolor: dk.white,
                border: `1px solid ${alpha(dk.border, 0.18)}`,
                boxShadow: `0 8px 22px ${alpha(dk.surfaceStrong, 0.18)}`,
                minWidth: 240,
                maxWidth: "100%",
                animation: "toastEnter 0.32s cubic-bezier(.4,1.4,.4,1)",
                "@keyframes toastEnter": {
                  from: { opacity: 0, transform: "translateY(10px) scale(0.96)" },
                  to: { opacity: 1, transform: "translateY(0) scale(1)" },
                },
              }}
            >
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: alpha(color, 0.18), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon sx={{ color, fontSize: 18 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: "primary.main", fontSize: 13 }}>
                  {t.title}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  {t.body}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => dismiss(t.id)} aria-label="Fermer">
                <Close fontSize="small" />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
