"use client";

import { ArrowForward, AutoAwesome, Close } from "@mui/icons-material";
import { Box, Button, Chip, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

export default function WireframeUpgradeBanner() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(true);

  const close = useCallback(() => setOpen(false), []);

  if (!open) {
    return (
      <Box
        sx={{
          borderRadius: 3,
          bgcolor: dk.white,
          border: `1px dashed ${alpha(dk.border, 0.3)}`,
          p: 2,
          textAlign: "center",
          color: "text.secondary",
          fontWeight: 700,
          cursor: "pointer",
        }}
        onClick={() => setOpen(true)}
      >
        + Réafficher le CTA Pro
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        background: `linear-gradient(120deg, #2A2C45 0%, ${dk.surfaceStrong} 50%, ${dk.tertiary} 100%)`,
        color: dk.white,
        p: { xs: 2.5, sm: 3 },
        overflow: "hidden",
        boxShadow: `0 12px 32px ${alpha(dk.surfaceStrong, 0.3)}`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 80% 20%, ${alpha(dk.white, 0.18)} 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          bgcolor: alpha(dk.white, 0.06),
        }}
      />

      <IconButton
        size="small"
        onClick={close}
        sx={{ position: "absolute", top: 10, right: 10, color: alpha(dk.white, 0.85), zIndex: 1 }}
        aria-label="Fermer"
      >
        <Close fontSize="small" />
      </IconButton>

      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={2} sx={{ position: "relative" }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2.5,
            bgcolor: alpha(dk.white, 0.16),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AutoAwesome sx={{ fontSize: 30, color: "#FFD86B" }} />
        </Box>
        <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5, justifyContent: { xs: "center", sm: "flex-start" } }}>
            <Chip
              label="OFFRE LIMITÉE"
              size="small"
              sx={{ bgcolor: alpha("#FFD86B", 0.85), color: "#2A2C45", fontWeight: 800, fontSize: 9, height: 18 }}
            />
            <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.85, letterSpacing: "0.06em" }}>
              -20% LA 1ère ANNÉE
            </Typography>
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.05 }}>
            Passe à Giveety Pro
          </Typography>
          <Typography sx={{ fontWeight: 600, opacity: 0.92, mt: 0.5, fontSize: { xs: 13, sm: 14 } }}>
            Certificats illimitées, templates premium, stats avancées.
          </Typography>
        </Box>
        <Stack alignItems={{ xs: "center", sm: "flex-end" }} spacing={1}>
          <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
            <Stack direction="row" alignItems="baseline" spacing={0.5} justifyContent={{ xs: "center", sm: "flex-end" }}>
              <Typography
                sx={{ textDecoration: "line-through", opacity: 0.6, fontWeight: 700 }}
              >
                7€
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>5€</Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 700 }}>/mois</Typography>
            </Stack>
          </Box>
          <Button
            endIcon={<ArrowForward />}
            disableElevation
            sx={{
              borderRadius: 9999,
              textTransform: "none",
              fontWeight: 800,
              bgcolor: dk.white,
              color: "primary.main",
              px: 3,
              py: 1,
              "&:hover": { bgcolor: darken(dk.white, 0.04) },
            }}
          >
            Passer à Pro
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
