"use client";

import GiveetyLogoWordmarkPrimary from "@/adapter/ui/assets/GiveetyLogoWordmarkPrimary";
import { AutoAwesome, PanTool, Science } from "@mui/icons-material";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

const motionSafe = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
  },
} as const;

const haloMotionSafe = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
    opacity: "0.5 !important",
  },
} as const;

/**
 * Slide d’ouverture du carrousel Design Kit : logo animé + message sur la nature non exhaustive de la vitrine.
 */
export default function DesignKitWelcomeSlide() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const tertiary = dk.tertiary;
  const primaryMain = theme.palette.primary.main;

  const chipKeyframeName = "dkWelcomeChipRise";
  const primaryHaloPulse = "dkPrimaryHaloSoft";

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "transparent",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1.5, sm: 2, md: 2.5 },
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "@keyframes dkBlockRise": {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes dkLineGlow": {
          "0%, 100%": {
            textShadow: `0 0 0 ${alpha(primaryMain, 0)}`,
            filter: "brightness(1)",
          },
          "50%": {
            textShadow: `0 0 20px ${alpha(primaryMain, 0.12)}, 0 1px 0 ${alpha(dk.white, 0.5)}`,
            filter: "brightness(1.015)",
          },
        },
        [`@keyframes ${primaryHaloPulse}`]: {
          "0%, 100%": { opacity: 0.45, transform: "scale(0.94)" },
          "50%": { opacity: 0.9, transform: "scale(1.02)" },
        },
        [`@keyframes ${chipKeyframeName}`]: {
          from: { opacity: 0, transform: "translateY(14px) scale(0.97)" },
          to: { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        "@keyframes dkChipHalo": {
          "0%, 100%": {
            boxShadow: `0 0 0 0 ${alpha(primaryMain, 0)}, 0 2px 10px ${alpha(primaryMain, 0.06)}`,
            borderColor: alpha(tertiary, 0.4),
          },
          "50%": {
            boxShadow: `0 0 28px 4px ${alpha(primaryMain, 0.18)}, 0 4px 16px ${alpha(primaryMain, 0.1)}`,
            borderColor: alpha(primaryMain, 0.42),
          },
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          mx: "auto",
          position: "relative",
          zIndex: 1,
          borderRadius: 3,
          px: { xs: 1.75, sm: 2.25, md: 2.75 },
          py: { xs: 1.5, sm: 1.75, md: 2 },
          isolation: "isolate",
          overflow: "hidden",
          /* Vitre plus « molle » : le fond animé se lit + se réfracte derrière. */
          bgcolor: alpha(dk.white, 0.18),
          backdropFilter: "blur(32px) saturate(220%)",
          WebkitBackdropFilter: "blur(32px) saturate(220%)",
          border: `1px solid ${alpha(dk.white, 0.55)}`,
          boxShadow: `
            0 0 0 1px ${alpha(dk.white, 0.28)} inset,
            inset 0 1px 1px ${alpha(dk.white, 0.65)},
            inset 0 -1px 0 ${alpha("#000", 0.04)},
            0 24px 56px ${alpha("#000", 0.1)},
            0 4px 20px ${alpha("#000", 0.05)}
          `,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: 0,
            background: `linear-gradient(
              132deg,
              ${alpha(dk.white, 0.55)} 0%,
              ${alpha(dk.white, 0.06)} 32%,
              transparent 48%,
              ${alpha(dk.white, 0.03)} 72%,
              ${alpha(dk.white, 0.22)} 100%
            )`,
            opacity: 0.85,
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: 0,
            background: `linear-gradient(
              210deg,
              transparent 35%,
              ${alpha(dk.white, 0.12)} 52%,
              transparent 68%
            )`,
            opacity: 0.7,
          },
          "& > *": { position: "relative", zIndex: 1 },
        }}
      >
      <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
        <Box
          sx={{
            position: "relative",
            width: { xs: 138, md: 172 },
            height: { xs: 45, md: 58 },
            animation:
              "dkWelcomeLogoIn 0.95s cubic-bezier(0.22, 1, 0.36, 1) both, dkWelcomeFloat 5s ease-in-out 1s infinite",
            "@keyframes dkWelcomeLogoIn": {
              from: { opacity: 0, transform: "scale(0.88) translateY(28px)" },
              to: { opacity: 1, transform: "scale(1) translateY(0)" },
            },
            "@keyframes dkWelcomeFloat": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-6px)" },
            },
            "& svg": {
              display: "block",
              width: "100%",
              height: "auto",
            },
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
              opacity: 1,
              transform: "none",
            },
          }}
        >
          <GiveetyLogoWordmarkPrimary sx={{ color: "primary.main", width: "100%", height: "auto" }} />
        </Box>

        <Box
          aria-hidden
          sx={{
            width: 48,
            height: 2,
            borderRadius: 999,
            mx: "auto",
            background: `linear-gradient(90deg, transparent, ${alpha(tertiary, 0.25)} 20%, ${tertiary} 50%, ${alpha(tertiary, 0.25)} 80%, transparent)`,
            opacity: 0.85,
          }}
        />

        <Box
          sx={{
            position: "relative",
            width: "100%",
            px: { xs: 1, md: 2 },
            py: { xs: 0.5, md: 0.75 },
            animation: "dkBlockRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
            ...motionSafe,
            "&::before": {
              content: '""',
              position: "absolute",
              inset: { xs: -8, md: -14 },
              borderRadius: 3,
              zIndex: -1,
              background: `radial-gradient(ellipse 92% 80% at 50% 42%, ${alpha(primaryMain, 0.14)} 0%, ${alpha(primaryMain, 0)} 72%)`,
              animation: `${primaryHaloPulse} 4.2s ease-in-out infinite`,
              animationDelay: "0.35s",
              ...haloMotionSafe,
            },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              letterSpacing: { xs: "0.1em", sm: "0.14em" },
              color: dk.tertiary,
              display: "block",
              mb: 0.5,
              animation: "dkBlockRise 0.62s cubic-bezier(0.22, 1, 0.36, 1) 0.16s both, dkLineGlow 4s ease-in-out 0.8s infinite",
              ...motionSafe,
            }}
          >
            Design Kit V1 · Giveety V2 · * Anthony CHAHAT
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 900,
              lineHeight: 1.15,
              fontSize: { xs: "1.32rem", sm: "1.58rem", md: "1.85rem" },
              letterSpacing: "-0.02em",
              color: "primary.main",
              animation: "dkBlockRise 0.68s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both",
              ...motionSafe,
            }}
          >
            Bienvenue dans la vitrine interactive
          </Typography>
          <Typography
            sx={{
              mt: 0.75,
              color: "text.secondary",
              fontWeight: 600,
              fontSize: { xs: "0.88rem", md: "0.94rem" },
              lineHeight: 1.38,
              animation: "dkBlockRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both, dkLineGlow 5.2s ease-in-out 1.4s infinite",
              ...motionSafe,
            }}
          >
            Parcours en slides : wireframes, pages complètes et composants pour cadrer l’expérience produit — sans prétendre couvrir
            tout le scope réel de l’application.
          </Typography>
          <Typography
            sx={{
              mt: 0.65,
              color: "text.secondary",
              fontWeight: 500,
              fontSize: { xs: "0.8rem", md: "0.86rem" },
              lineHeight: 1.42,
              animation: "dkBlockRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.48s both",
              ...motionSafe,
            }}
          >
            Les patterns présentés ici s’appuient sur une direction <strong>liquid glass</strong> (verre
            dépoli, profondeur, reflets légers) pour donner du relief aux surfaces tout en restant dans les
            couleurs Giveety — une intention UX/UI pour guider les maquettes, pas une règle d’implémentation
            figée.
          </Typography>
          <Typography
            sx={{
              mt: 0.65,
              color: "text.secondary",
              fontWeight: 500,
              fontSize: { xs: "0.8rem", md: "0.86rem" },
              lineHeight: 1.42,
              animation: "dkBlockRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.52s both",
              ...motionSafe,
            }}
          >
            Ce rendu reste toutefois <strong>techniquement exigeant</strong> : les navigateurs n’offrent pas
            encore un <strong>support complet et uniforme</strong> de tout le <strong>CSS « liquid glass »</strong>{" "}
            (p.ex. flou d’arrière-plan, superpositions, différences moteur à moteur). Dans ce carrousel, c’est
            volontairement le <strong>tableau de bord</strong> qui en contient le plus ; les autres slides n’en
            utilisent qu’une partie pour limiter les écarts de rendu.
          </Typography>
        </Box>

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={0.75}
          justifyContent="center"
          sx={{
            position: "relative",
            maxWidth: 560,
            py: { xs: 0, md: 0.15 },
            px: { xs: 0.5, md: 1 },
            "&::before": {
              content: '""',
              position: "absolute",
              inset: -6,
              borderRadius: 3,
              zIndex: -1,
              background: `radial-gradient(ellipse 100% 90% at 50% 50%, ${alpha(primaryMain, 0.12)} 0%, transparent 70%)`,
              animation: `${primaryHaloPulse} 4.8s ease-in-out infinite`,
              animationDelay: "0.2s",
              ...haloMotionSafe,
            },
          }}
        >
          <Chip
            size="small"
            icon={<Science sx={{ fontSize: 16, color: tertiary }} />}
            label="Maquettes & prototypes"
            variant="outlined"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              borderColor: alpha(tertiary, 0.45),
              animation: `${chipKeyframeName} 0.58s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both, dkChipHalo 3.1s ease-in-out 1s infinite`,
              ...motionSafe,
            }}
          />
          <Chip
            size="small"
            icon={<PanTool sx={{ fontSize: 16, color: tertiary }} />}
            label="Présentation & itération"
            variant="outlined"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              borderColor: alpha(tertiary, 0.45),
              animation: `${chipKeyframeName} 0.58s cubic-bezier(0.22, 1, 0.36, 1) 0.62s both, dkChipHalo 3.1s ease-in-out 1.15s infinite`,
              ...motionSafe,
            }}
          />
          <Chip
            size="small"
            icon={<AutoAwesome sx={{ fontSize: 16, color: tertiary }} />}
            label="Non exhaustif · évolutif"
            variant="outlined"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              borderColor: alpha(tertiary, 0.45),
              animation: `${chipKeyframeName} 0.58s cubic-bezier(0.22, 1, 0.36, 1) 0.74s both, dkChipHalo 3.1s ease-in-out 1.3s infinite`,
              ...motionSafe,
            }}
          />
        </Stack>

        <Box
          sx={{
            width: "100%",
            background: `linear-gradient(145deg, ${alpha(dk.white, 0.92)} 0%, ${alpha(dk.primaryLight, 0.38)} 52%, ${alpha(dk.tertiaryLight, 0.28)} 100%)`,
            border: `1px solid ${alpha(dk.border, 0.2)}`,
            borderRadius: 2.5,
            px: { xs: 1.75, sm: 2 },
            py: 1.15,
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "visible",
            boxShadow: `0 4px 18px ${alpha(primaryMain, 0.07)}`,
            animation:
              "dkBlockRise 0.72s cubic-bezier(0.22, 1, 0.36, 1) 0.85s both, dkFootnoteBoxGlow 3.4s ease-in-out 1.55s infinite",
            ...motionSafe,
            "@keyframes dkFootnoteBoxGlow": {
              "0%, 100%": {
                boxShadow: `0 4px 18px ${alpha(primaryMain, 0.07)}`,
              },
              "50%": {
                boxShadow: `0 4px 22px ${alpha(primaryMain, 0.1)}, 0 0 40px ${alpha(primaryMain, 0.12)}`,
              },
            },
            "&::before": {
              content: '""',
              position: "absolute",
              inset: -7,
              borderRadius: 3,
              zIndex: -1,
              background: `radial-gradient(ellipse 95% 90% at 50% 50%, ${alpha(primaryMain, 0.18)} 0%, transparent 68%)`,
              animation: `${primaryHaloPulse} 5s ease-in-out infinite`,
              animationDelay: "0.4s",
              ...haloMotionSafe,
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              fontWeight: 600,
              fontSize: { xs: "0.8rem", sm: "0.82rem" },
              lineHeight: 1.48,
              animation: "dkLineGlow 5.5s ease-in-out 1.8s infinite",
              ...motionSafe,
            }}
          >
            <strong>Ce n’est pas une documentation contractuelle</strong> : les écrans illustrent des intentions UX/UI, pas un inventaire
            figé des écrans en production. Utilise ce kit pour <strong>aligner les équipes</strong>, challenger des parcours et prioriser —
            puis itère côté produit réel.
          </Typography>
        </Box>
      </Stack>
      </Box>
    </Box>
  );
}
