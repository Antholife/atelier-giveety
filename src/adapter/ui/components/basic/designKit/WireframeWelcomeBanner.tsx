"use client";

import { ArrowForward, Close } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const NAME = "Élise";

export default function WireframeWelcomeBanner() {
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
        + Réafficher la bannière de bienvenue
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        background: `linear-gradient(120deg, ${dk.surfaceStrong} 0%, ${dk.tertiary} 100%)`,
        color: dk.white,
        p: { xs: 2.5, sm: 3.5 },
        overflow: "hidden",
        boxShadow: `0 12px 28px ${alpha(dk.surfaceStrong, 0.25)}`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: alpha(dk.white, 0.08),
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -40,
          right: 60,
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: alpha(dk.white, 0.06),
        }}
      />

      <IconButton
        size="small"
        onClick={close}
        sx={{ position: "absolute", top: 12, right: 12, color: alpha(dk.white, 0.8) }}
        aria-label="Fermer"
      >
        <Close />
      </IconButton>

      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: alpha(dk.white, 0.2),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 28,
            flexShrink: 0,
            border: `2px solid ${alpha(dk.white, 0.4)}`,
          }}
        >
          {NAME[0]}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", sm: "left" } }}>
          <Typography variant="overline" sx={{ fontWeight: 800, opacity: 0.85, letterSpacing: "0.08em" }}>
            BIENVENUE
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
            Salut {NAME} 👋
          </Typography>
          <Typography sx={{ fontWeight: 600, opacity: 0.92, mt: 0.5 }}>
            Prête à transformer ton engagement en preuve concrète ? On commence par compléter ton profil.
          </Typography>
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
            py: 1.25,
            flexShrink: 0,
            "&:hover": { bgcolor: darken(dk.white, 0.04) },
          }}
        >
          Démarrer
        </Button>
      </Stack>
    </Box>
  );
}
