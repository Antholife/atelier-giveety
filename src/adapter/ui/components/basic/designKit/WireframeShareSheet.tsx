"use client";

import {
  Close,
  ContentCopy,
  Email,
  LinkedIn,
  QrCode2,
  Share,
  Telegram,
  WhatsApp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Snackbar,
  Stack,
  Typography,
  useTheme,
  type SvgIconProps,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ComponentType } from "react";
import { designKitPalette } from "./designKitPalette";

const NETWORKS: { id: string; label: string; Icon: ComponentType<SvgIconProps>; color: string }[] = [
  { id: "linkedin", label: "LinkedIn", Icon: LinkedIn, color: "#0A66C2" },
  { id: "whatsapp", label: "WhatsApp", Icon: WhatsApp, color: "#25D366" },
  { id: "telegram", label: "Telegram", Icon: Telegram, color: "#0088CC" },
  { id: "mail", label: "E-mail", Icon: Email, color: "#5B5BD6" },
  { id: "qr", label: "QR code", Icon: QrCode2, color: "#2A2C45" },
];

const LINK = "https://giveety.app/u/elise-marchand";

export default function WireframeShareSheet() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(LINK);
      setSnack("Lien copié !");
    } catch {
      setSnack("Impossible de copier.");
    }
  }, []);

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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Partager mon profil
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Modale multi-réseaux + lien + QR.
      </Typography>

      <Button
        startIcon={<Share />}
        onClick={() => setOpen(true)}
        disableElevation
        sx={{
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 800,
          bgcolor: dk.surfaceStrong,
          color: dk.white,
          "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
        }}
      >
        Ouvrir la share sheet
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 0, sm: "50%" },
            left: { xs: 0, sm: "50%" },
            right: { xs: 0, sm: "auto" },
            transform: { xs: "none", sm: "translate(-50%, 50%)" },
            width: { xs: "100%", sm: 420 },
            bgcolor: dk.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: { xs: 0, sm: 24 },
            borderBottomRightRadius: { xs: 0, sm: 24 },
            outline: "none",
            p: 3,
            boxShadow: `0 -8px 28px ${alpha(dk.surfaceStrong, 0.18)}`,
            animation: "slideUp 0.32s cubic-bezier(.4,1.4,.4,1)",
            "@keyframes slideUp": {
              from: { opacity: 0, transform: "translate(0, 10%)" },
              to: { opacity: 1, transform: "translate(-50%, 50%)" },
            },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
              Partager
            </Typography>
            <IconButton onClick={() => setOpen(false)} size="small" aria-label="Fermer">
              <Close />
            </IconButton>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(5, 1fr)", sm: "repeat(5, 1fr)" },
              gap: 1.5,
              mb: 2.5,
            }}
          >
            {NETWORKS.map((n) => (
              <Stack
                key={n.id}
                alignItems="center"
                spacing={0.75}
                onClick={() => setSnack(`Partagé via ${n.label}`)}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: alpha(n.color, 0.15),
                    color: n.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.15s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <n.Icon />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.main", fontSize: 11 }}>
                  {n.label}
                </Typography>
              </Stack>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(dk.surfaceMuted, 0.4),
              border: `1px solid ${alpha(dk.border, 0.18)}`,
            }}
          >
            <Box
              sx={{
                flex: 1,
                fontFamily: "monospace",
                fontSize: 12,
                fontWeight: 700,
                color: "primary.main",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                px: 1,
              }}
            >
              {LINK}
            </Box>
            <IconButton size="small" onClick={copy} aria-label="Copier" sx={{ color: "primary.main" }}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2000}
        message={snack}
        onClose={() => setSnack(null)}
      />
    </Box>
  );
}
