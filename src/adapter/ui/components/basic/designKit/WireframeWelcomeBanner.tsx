"use client";

import { ArrowForward, Close, SupervisorAccount, WarningAmber } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const DEFAULT_NAME = "Élise";

type WireframeWelcomeBannerProps = {
  name?: string;
  overline?: string;
  title?: string;
  message?: string;
  ctaLabel?: string;
  /** Sous-texte sous le bouton (ex. progression profil). */
  ctaSubline?: string;
  /** Masque le bloc CTA (bouton + sous-ligne). Utile si l’action est ailleurs sur la page. */
  hideActions?: boolean;
  /** Aspect brand, alerte (warning), ou demande critique (structure / Manager, fond rouge type erreur UI). */
  tone?: "brand" | "warning" | "info";
  /** Si false : pas de croix pour fermer ni bandeau replié — message toujours affiché. */
  dismissible?: boolean;
  /** Moins de padding et typographies réduites (ex. rappel sous le greeting). */
  compact?: boolean;
  /** Texte du lien quand la bannière est repliée (sinon valeur par défaut selon tone). */
  reopenLabel?: string;
};

export default function WireframeWelcomeBanner({
  name = DEFAULT_NAME,
  overline = "BIENVENUE",
  title,
  message = "Prête à transformer ton engagement en preuve concrète ? On commence par compléter ton profil.",
  ctaLabel = "Démarrer",
  ctaSubline,
  hideActions = false,
  tone = "brand",
  compact = false,
  reopenLabel,
  dismissible = true,
}: WireframeWelcomeBannerProps = {}) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(true);

  const resolvedTitle = title ?? `Salut ${name} 👋`;
  const isBrand = tone === "brand";
  const isWarning = tone === "warning";
  const isInfo = tone === "info";
  const accentMain = isWarning
    ? theme.palette.warning.main
    : isInfo
      ? theme.palette.error.main
      : theme.palette.primary.main;

  const defaultReopenLabel = isWarning
    ? "+ Réafficher l’alerte profil"
    : isInfo
      ? "+ Réafficher la demande de la structure"
      : "+ Réafficher la bannière de bienvenue";
  const reopenText = reopenLabel ?? defaultReopenLabel;

  const close = useCallback(() => {
    if (dismissible) setOpen(false);
  }, [dismissible]);

  if (!open && dismissible) {
    return (
      <Box
        sx={{
          borderRadius: compact ? 2 : 3,
          bgcolor: dk.white,
          border: `1px dashed ${
            isWarning ? alpha(theme.palette.warning.main, 0.45) : isInfo ? alpha(theme.palette.error.main, 0.45) : alpha(dk.border, 0.3)
          }`,
          py: compact ? 1 : 2,
          px: compact ? 1.5 : undefined,
          textAlign: "center",
          color: "text.secondary",
          fontWeight: 700,
          fontSize: compact ? 13 : undefined,
          cursor: "pointer",
        }}
        onClick={() => setOpen(true)}
      >
        {reopenText}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: compact ? 2 : 3,
        overflow: "hidden",
        ...(isBrand
          ? {
              background: `linear-gradient(120deg, ${dk.surfaceStrong} 0%, ${dk.tertiary} 100%)`,
              color: dk.white,
              p: compact ? { xs: 1.75, sm: 2.25 } : { xs: 2.5, sm: 3.5 },
              boxShadow: `0 12px 28px ${alpha(dk.surfaceStrong, 0.25)}`,
            }
          : {
              bgcolor: alpha(accentMain, compact ? (isInfo ? 0.12 : 0.1) : isInfo ? 0.15 : 0.13),
              color: theme.palette.primary.dark,
              border: `1px solid ${alpha(accentMain, 0.38)}`,
              borderLeft: `4px solid ${accentMain}`,
              boxShadow: `0 6px 16px ${alpha(accentMain, 0.12)}`,
              p: compact ? { xs: 1.25, sm: 1.5 } : { xs: 2.5, sm: 3.5 },
            }),
      }}
    >
      {isBrand ? (
        <>
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
              display: compact ? "none" : "block",
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
              display: compact ? "none" : "block",
            }}
          />
        </>
      ) : (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            opacity: compact ? 0.35 : 0.5,
            background: `radial-gradient(circle at 100% 0%, ${alpha(accentMain, isInfo ? 0.22 : 0.28)} 0%, transparent 45%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {dismissible ? (
        <IconButton
          size="small"
          onClick={close}
          sx={{
            position: "absolute",
            top: compact ? 6 : 12,
            right: compact ? 6 : 12,
            color: isBrand ? alpha(dk.white, 0.8) : alpha(theme.palette.primary.main, 0.55),
          }}
          aria-label="Fermer"
        >
          <Close fontSize={compact ? "small" : "medium"} />
        </IconButton>
      ) : null}

      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={compact ? 1.25 : 2}>
        {!isBrand ? (
          <Box
            sx={{
              width: compact ? 38 : 48,
              height: compact ? 38 : 48,
              borderRadius: compact ? "12px" : "14px",
              bgcolor: alpha(accentMain, 0.2),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `1px solid ${alpha(accentMain, 0.45)}`,
              color: isWarning ? theme.palette.warning.dark : isInfo ? theme.palette.error.dark : theme.palette.primary.dark,
            }}
          >
            {isWarning ? <WarningAmber sx={{ fontSize: compact ? 22 : 26 }} /> : null}
            {isInfo ? <SupervisorAccount sx={{ fontSize: compact ? 22 : 26 }} /> : null}
          </Box>
        ) : (
          <Box
            sx={{
              width: compact ? 48 : 64,
              height: compact ? 48 : 64,
              borderRadius: "50%",
              bgcolor: alpha(dk.white, 0.2),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: compact ? 22 : 28,
              flexShrink: 0,
              border: `2px solid ${alpha(dk.white, 0.4)}`,
            }}
          >
            {name[0]}
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            textAlign: { xs: "center", sm: "left" },
            pr: { xs: 0, sm: compact && dismissible ? 4 : 0 },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.08em",
              lineHeight: compact ? 1.2 : undefined,
              display: "block",
              ...(isWarning
                ? { color: theme.palette.primary.dark, opacity: 1 }
                : isInfo
                  ? { color: theme.palette.primary.dark, opacity: 1 }
                  : { opacity: 0.85 }),
              fontSize: compact ? "0.65rem" : undefined,
              mb: compact ? 0.25 : 0,
            }}
          >
            {overline}
          </Typography>
          <Typography
            variant={compact ? "subtitle1" : "h5"}
            sx={{
              fontWeight: 900,
              lineHeight: compact ? 1.2 : 1.1,
              color: !isBrand ? theme.palette.primary.dark : undefined,
              fontSize: compact ? "1rem" : undefined,
            }}
          >
            {resolvedTitle}
          </Typography>
          <Typography
            variant={compact ? "body2" : undefined}
            sx={{
              fontWeight: 600,
              color: !isBrand ? alpha(theme.palette.primary.dark, 0.88) : undefined,
              opacity: !isBrand ? 1 : 0.92,
              mt: compact ? 0.25 : 0.5,
              fontSize: compact ? "0.8125rem" : undefined,
              lineHeight: 1.38,
            }}
          >
            {message}
          </Typography>
        </Box>
        {!hideActions ? (
          <Stack
            sx={{
              flexShrink: 0,
              alignItems: { xs: "center", sm: "flex-end" },
              textAlign: { xs: "center", sm: "right" },
            }}
            spacing={compact ? 0.5 : 0.75}
          >
            <Button
              size={compact ? "small" : "medium"}
              endIcon={<ArrowForward sx={{ fontSize: compact ? 16 : 18 }} />}
              disableElevation
              sx={{
                borderRadius: 9999,
                textTransform: "none",
                fontWeight: 800,
                px: compact ? 2 : 3,
                py: compact ? 0.5 : 1.25,
                minHeight: compact ? 32 : undefined,
                fontSize: compact ? "0.8rem" : undefined,
                ...(isWarning
                  ? {
                      bgcolor: theme.palette.warning.dark,
                      color: dk.white,
                      "&:hover": { bgcolor: darken(theme.palette.warning.dark, 0.06), color: dk.white },
                    }
                  : isInfo
                    ? {
                        bgcolor: theme.palette.error.dark,
                        color: dk.white,
                        "&:hover": {
                          bgcolor: darken(theme.palette.error.dark, theme.palette.mode === "light" ? 0.08 : 0.04),
                          color: dk.white,
                        },
                      }
                    : {
                        bgcolor: dk.white,
                        color: "primary.main",
                        "&:hover": { bgcolor: darken(dk.white, 0.04) },
                      }),
              }}
            >
              {ctaLabel}
            </Button>
            {ctaSubline ? (
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: compact ? 12 : 13,
                  opacity: 0.9,
                  whiteSpace: { sm: "nowrap" },
                  ...(!isBrand ? { color: alpha(theme.palette.primary.dark, 0.85) } : {}),
                }}
              >
                · {ctaSubline}
              </Typography>
            ) : null}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  );
}
