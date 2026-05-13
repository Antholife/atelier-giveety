"use client";

import { CardGiftcard, Check, ContentCopy, Link as LinkIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const LINK = "giveety.app/r/elise-em42";
const GOAL = 5;

export default function WireframeReferralCard() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [invited, setInvited] = useState(2);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(LINK).catch(() => undefined);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }, []);

  const fakeInvite = useCallback(() => {
    setInvited((c) => Math.min(GOAL, c + 1));
  }, []);

  const pct = Math.min(100, (invited / GOAL) * 100);
  const reached = invited >= GOAL;

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: { xs: 2.5, sm: 3 },
        background: `linear-gradient(140deg, ${alpha(dk.tertiaryLight, 0.7)} 0%, ${dk.white} 60%, ${alpha(dk.primaryLight, 0.6)} 100%)`,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 24px ${alpha(dk.surfaceStrong, 0.08)}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            bgcolor: dk.tertiary,
            color: dk.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardGiftcard />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Parraine, gagne un badge !
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Badge « Ambassadeur » à {GOAL} ami·es inscrit·es
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          p: 1,
          pl: 2,
          mb: 2,
          borderRadius: 9999,
          bgcolor: dk.canvas,
          border: `1px solid ${alpha(dk.border, 0.2)}`,
        }}
      >
        <LinkIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        <Typography
          variant="body2"
          sx={{
            flex: 1,
            minWidth: 0,
            fontFamily: "monospace",
            fontWeight: 700,
            color: "primary.main",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {LINK}
        </Typography>
        <IconButton
          size="small"
          onClick={copy}
          sx={{
            bgcolor: copied ? dk.surfaceStrong : alpha(dk.surfaceMuted, 0.4),
            color: copied ? dk.white : "primary.main",
            "&:hover": { bgcolor: copied ? dk.surfaceStrong : alpha(dk.surfaceMuted, 0.7) },
          }}
          aria-label={copied ? "Copié" : "Copier"}
        >
          {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
        </IconButton>
      </Stack>

      <Box sx={{ mb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
            {invited} / {GOAL} ami·es inscrit·es
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "tertiary.main" }}>
            {reached ? "Objectif atteint 🎉" : `${GOAL - invited} restant·es`}
          </Typography>
        </Stack>
        <Box sx={{ height: 8, borderRadius: 9999, bgcolor: alpha(dk.border, 0.18), overflow: "hidden" }}>
          <Box
            sx={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: 9999,
              background: `linear-gradient(90deg, ${dk.surfaceStrong}, ${dk.tertiary})`,
              transition: "width 0.4s ease",
            }}
          />
        </Box>
      </Box>

      <Button
        fullWidth
        disableElevation
        onClick={fakeInvite}
        disabled={reached}
        sx={{
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 800,
          bgcolor: dk.surfaceStrong,
          color: dk.white,
          "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
        }}
      >
        Simuler une nouvelle inscription
      </Button>
    </Box>
  );
}
