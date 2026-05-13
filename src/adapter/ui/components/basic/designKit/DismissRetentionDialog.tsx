"use client";

import { Close, DoNotDisturbAlt, Replay } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

export type DismissRetention = "temporary" | "permanent";

type DismissRetentionDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Ex. « les astuces » ou « Premiers pas Giveety » — complète la phrase du titre */
  scopeLabel: string;
  /** Titre court (« Astuces », « Liste ») pour qualifier le bloc */
  blockTitle?: string;
  onChooseTemporary: () => void;
  onChoosePermanent: () => void;
};

/** Modale masquage : style Giveety — dégradé header + boutons alignés WireframeButtons. */
export default function DismissRetentionDialog({
  open,
  onClose,
  scopeLabel,
  blockTitle,
  onChooseTemporary,
  onChoosePermanent,
}: DismissRetentionDialogProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  const titleLine = blockTitle
    ? `Masquer ce bloc (${blockTitle}) ?`
    : `Masquer ${scopeLabel} ?`;

  const warningAccent = theme.palette.warning.main;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="dismiss-retention-dialog-title"
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: alpha(dk.surfaceStrong, 0.42),
            backdropFilter: "blur(6px)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "min(100% - 24px, 420px)", sm: 440 },
          maxWidth: "100%",
          outline: "none",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: `0 22px 56px ${alpha("#000", 0.28)}, 0 0 0 1px ${alpha(dk.white, 0.08)}`,
          bgcolor: dk.white,
          animation: "dismiss-ret-pop 0.32s cubic-bezier(.34,1.4,.64,1)",
          "@keyframes dismiss-ret-pop": {
            from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.94)" },
            to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
          },
        }}
      >
        {/* En-tête dégradé */}
        <Box
          sx={{
            position: "relative",
            px: 2.5,
            pt: 2.75,
            pb: 2.25,
            color: dk.white,
            background: `linear-gradient(122deg, ${dk.surfaceStrong} 0%, ${alpha(dk.tertiary, 0.95)} 52%, ${alpha(dk.primaryLight, 0.65)} 100%)`,
            overflow: "hidden",
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: -50,
              right: -40,
              width: 140,
              height: 140,
              borderRadius: "50%",
              bgcolor: alpha(dk.white, 0.07),
            }}
          />
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              bottom: -30,
              left: -20,
              width: 88,
              height: 88,
              borderRadius: "50%",
              bgcolor: alpha(dk.white, 0.06),
            }}
          />

          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1} sx={{ position: "relative" }}>
            <Box sx={{ minWidth: 0, pr: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  fontWeight: 800,
                  letterSpacing: "0.09em",
                  opacity: 0.88,
                  fontSize: "0.65rem",
                  lineHeight: 1.2,
                }}
              >
                Confirmation
              </Typography>
              <Typography id="dismiss-retention-dialog-title" variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2, mt: 0.5 }}>
                {titleLine}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Fermer sans choisir"
              sx={{
                flexShrink: 0,
                color: alpha(dk.white, 0.88),
                bgcolor: alpha(dk.white, 0.12),
                "&:hover": { bgcolor: alpha(dk.white, 0.2) },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {/* Corps */}
        <Box
          sx={{
            px: 2.5,
            py: 2.25,
            background: `linear-gradient(180deg, ${alpha(dk.primaryLight, 0.38)} 0%, ${dk.white} 70%)`,
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="body2" sx={{ color: dk.textMuted, fontWeight: 600, lineHeight: 1.55 }}>
              Tu peux le masquer <Box component="span" sx={{ color: dk.text, fontWeight: 800 }}>pour maintenant</Box> : une zone
              plus bas te permettra de rouvrir ce bloc sur cette page.
            </Typography>
            <Typography variant="body2" sx={{ color: dk.textMuted, fontWeight: 600, lineHeight: 1.55 }}>
              Choisis <Box component="span" sx={{ color: "tertiary.main", fontWeight: 800 }}>Ne plus afficher</Box> pour le
              cacher sur cet appareil jusqu’à ce que les données locales soient effacées.
            </Typography>
          </Stack>
        </Box>

        {/* Actions — pill buttons Giveety (même ADN que WireframeButtons) */}
        <Box
          sx={{
            px: 2.5,
            pb: 2.25,
            pt: 0.5,
            bgcolor: dk.white,
            borderTop: `1px solid ${alpha(dk.border, 0.12)}`,
          }}
        >
          <Stack spacing={1.25}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
              <Button
                disableElevation
                fullWidth
                startIcon={<Replay sx={{ fontSize: 18 }} />}
                onClick={onChooseTemporary}
                sx={{
                  borderRadius: 9999,
                  flex: { sm: "1 1 0" },
                  minWidth: { sm: 0 },
                  py: 1.1,
                  px: 2.25,
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "0.875rem",
                  bgcolor: dk.surfaceAccent,
                  color: dk.surfaceStrong,
                  border: `1px solid ${alpha(dk.surfaceStrong, 0.18)}`,
                  boxShadow: `0 2px 8px ${alpha(dk.surfaceStrong, 0.08)}`,
                  "&:hover": { bgcolor: darken(dk.surfaceAccent, 0.07) },
                }}
              >
                Pour maintenant
              </Button>
              <Button
                disableElevation
                fullWidth
                startIcon={<DoNotDisturbAlt sx={{ fontSize: 18 }} />}
                onClick={onChoosePermanent}
                sx={{
                  borderRadius: 9999,
                  flex: { sm: "1 1 0" },
                  minWidth: { sm: 0 },
                  py: 1.1,
                  px: 2.25,
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "0.875rem",
                  color: dk.white,
                  background: `linear-gradient(125deg, ${darken(warningAccent, 0.12)} 0%, ${dk.tertiary} 48%, ${darken(dk.tertiary, 0.06)} 100%)`,
                  boxShadow: `0 4px 16px ${alpha(dk.tertiary, 0.35)}`,
                  "&:hover": {
                    background: `linear-gradient(125deg, ${darken(warningAccent, 0.18)} 0%, ${darken(dk.tertiary, 0.04)} 100%)`,
                    boxShadow: `0 6px 20px ${alpha(dk.tertiary, 0.42)}`,
                  },
                }}
              >
                Ne plus afficher
              </Button>
            </Stack>
            <Button
              variant="text"
              fullWidth
              onClick={onClose}
              sx={{
                py: 0.75,
                textTransform: "none",
                fontWeight: 700,
                color: dk.textMuted,
                borderRadius: 9999,
                "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.06), color: dk.surfaceStrong },
              }}
            >
              Annuler
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}
