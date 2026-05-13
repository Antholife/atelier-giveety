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
        border: `1px solid ${alpha(dk.border, 0.2)}`,
        background: `linear-gradient(145deg, ${alpha(dk.white, 0.98)} 0%, ${alpha(dk.primaryLight, 0.28)} 38%, ${alpha(dk.tertiaryLight, 0.38)} 100%)`,
        boxShadow: `0 20px 48px ${alpha(dk.surfaceStrong, 0.08)}`,
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 4, sm: 5, md: 6 },
        minHeight: { xs: 320, md: 380 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        isolation: "isolate",
        "@keyframes dkBlockRise": {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes dkLineGlow": {
          "0%, 100%": {
            textShadow: `0 0 0 ${alpha(primaryMain, 0)}, 0 0 0 ${alpha(primaryMain, 0)}`,
            filter: "brightness(1)",
          },
          "50%": {
            textShadow: `0 0 28px ${alpha(primaryMain, 0.2)}, 0 0 56px ${alpha(primaryMain, 0.08)}`,
            filter: "brightness(1.02)",
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
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "-20%",
          zIndex: 0,
          opacity: 0.55,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, ${alpha(tertiary, 0.35)} 0%, transparent 55%),
            radial-gradient(ellipse 70% 55% at 85% 20%, ${alpha(dk.surfaceStrong, 0.12)} 0%, transparent 50%),
            radial-gradient(ellipse 90% 70% at 50% 95%, ${alpha(tertiary, 0.22)} 0%, transparent 45%),
            radial-gradient(ellipse 50% 45% at 50% 48%, ${alpha(primaryMain, 0.09)} 0%, transparent 62%),
            linear-gradient(125deg, ${alpha(dk.white, 0)} 0%, ${alpha(tertiary, 0.06)} 40%, ${alpha(dk.white, 0)} 80%)
          `,
          backgroundSize: "140% 140%",
          animation: "dkWelcomeBgPulse 14s ease-in-out infinite alternate",
          "@keyframes dkWelcomeBgPulse": {
            "0%": { transform: "translate(0%, 0%) rotate(0deg) scale(1)", opacity: 0.5 },
            "50%": { transform: "translate(-2.5%, 1.5%) rotate(1.2deg) scale(1.04)", opacity: 0.68 },
            "100%": { transform: "translate(1.5%, -2%) rotate(-0.9deg) scale(1.02)", opacity: 0.56 },
          },
          ...motionSafe,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 0,
          opacity: 0.35,
          backgroundImage: `repeating-linear-gradient(
            -22deg,
            ${alpha(tertiary, 0)} 0px,
            ${alpha(tertiary, 0)} 52px,
            ${alpha(tertiary, 0.045)} 52px,
            ${alpha(tertiary, 0.045)} 54px
          )`,
          backgroundSize: "80px 80px",
          animation: "dkWelcomeStripeShift 22s linear infinite",
          "@keyframes dkWelcomeStripeShift": {
            from: { backgroundPosition: "0 0" },
            to: { backgroundPosition: "120px 80px" },
          },
          ...motionSafe,
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: { xs: "-18%", md: "-8%" },
          right: { xs: "-22%", md: "-6%" },
          width: { xs: 240, md: 360 },
          height: { xs: 240, md: 360 },
          borderRadius: "50%",
          zIndex: 0,
          background: `radial-gradient(circle, ${alpha(tertiary, 0.42)} 0%, ${alpha(primaryMain, 0.08)} 45%, transparent 62%)`,
          animation: "dkWelcomeOrbA 11s ease-in-out infinite",
          "@keyframes dkWelcomeOrbA": {
            "0%, 100%": { opacity: 0.65, transform: "scale(1) translate(0, 0)" },
            "33%": { opacity: 0.95, transform: "scale(1.12) translate(-8px, 12px)" },
            "66%": { opacity: 0.75, transform: "scale(1.04) translate(10px, -6px)" },
          },
          ...motionSafe,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: { xs: "-24%", md: "-14%" },
          left: { xs: "-20%", md: "-6%" },
          width: { xs: 280, md: 400 },
          height: { xs: 280, md: 400 },
          borderRadius: "50%",
          zIndex: 0,
          background: `radial-gradient(circle, ${alpha(primaryMain, 0.14)} 0%, ${alpha(tertiary, 0.22)} 38%, transparent 65%)`,
          animation: "dkWelcomeOrbB 13s ease-in-out infinite",
          "@keyframes dkWelcomeOrbB": {
            "0%, 100%": { transform: "scale(1.05) translate(0, 0)", opacity: 0.55 },
            "50%": { transform: "scale(1.15) translate(16px, -20px)", opacity: 0.85 },
          },
          ...motionSafe,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: `linear-gradient(
            105deg,
            ${alpha(theme.palette.common.white, 0)} 40%,
            ${alpha(theme.palette.common.white, 0.14)} 50%,
            ${alpha(theme.palette.common.white, 0)} 60%
          )`,
          backgroundSize: "200% 100%",
          animation: "dkWelcomeSheen 9s ease-in-out infinite",
          "@keyframes dkWelcomeSheen": {
            "0%, 100%": { backgroundPosition: "160% center", opacity: 0 },
            "15%": { opacity: 0.7 },
            "35%": { backgroundPosition: "-60% center", opacity: 0.5 },
            "50%": { opacity: 0 },
          },
          pointerEvents: "none",
          ...motionSafe,
        }}
      />

      <Stack spacing={3} sx={{ position: "relative", zIndex: 1, alignItems: "center", textAlign: "center", maxWidth: 680 }}>
        <Box
          sx={{
            position: "relative",
            width: { xs: 168, md: 200 },
            height: { xs: 56, md: 68 },
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
          sx={{
            position: "relative",
            width: "100%",
            px: { xs: 1, md: 2 },
            py: { xs: 1.5, md: 2 },
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
              letterSpacing: "0.2em",
              color: dk.tertiary,
              display: "block",
              mb: 1,
              animation: "dkBlockRise 0.62s cubic-bezier(0.22, 1, 0.36, 1) 0.16s both, dkLineGlow 4s ease-in-out 0.8s infinite",
              ...motionSafe,
            }}
          >
            Design Kit · Giveety V2
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 900,
              color: "primary.dark",
              lineHeight: 1.15,
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
              animation: "dkBlockRise 0.68s cubic-bezier(0.22, 1, 0.36, 1) 0.28s both, dkLineGlow 4.8s ease-in-out 1.1s infinite",
              ...motionSafe,
            }}
          >
            Bienvenue dans la vitrine interactive
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              color: "text.secondary",
              fontWeight: 600,
              fontSize: { xs: "0.95rem", md: "1.02rem" },
              lineHeight: 1.5,
              animation: "dkBlockRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both, dkLineGlow 5.2s ease-in-out 1.4s infinite",
              ...motionSafe,
            }}
          >
            Parcours en slides : wireframes, pages complètes et composants pour cadrer l’expérience produit — sans prétendre couvrir
            tout le scope réel de l’application.
          </Typography>
        </Box>

        <Stack
          direction="row"
          flexWrap="wrap"
          gap={1}
          justifyContent="center"
          sx={{
            position: "relative",
            maxWidth: 560,
            py: { xs: 0.75, md: 1 },
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
            icon={<Science sx={{ fontSize: 18, color: tertiary }} />}
            label="Maquettes & prototypes"
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderColor: alpha(tertiary, 0.45),
              animation: `${chipKeyframeName} 0.58s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both, dkChipHalo 3.1s ease-in-out 1s infinite`,
              ...motionSafe,
            }}
          />
          <Chip
            icon={<PanTool sx={{ fontSize: 18, color: tertiary }} />}
            label="Présentation & itération"
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderColor: alpha(tertiary, 0.45),
              animation: `${chipKeyframeName} 0.58s cubic-bezier(0.22, 1, 0.36, 1) 0.62s both, dkChipHalo 3.1s ease-in-out 1.15s infinite`,
              ...motionSafe,
            }}
          />
          <Chip
            icon={<AutoAwesome sx={{ fontSize: 18, color: tertiary }} />}
            label="Non exhaustif · évolutif"
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderColor: alpha(tertiary, 0.45),
              animation: `${chipKeyframeName} 0.58s cubic-bezier(0.22, 1, 0.36, 1) 0.74s both, dkChipHalo 3.1s ease-in-out 1.3s infinite`,
              ...motionSafe,
            }}
          />
        </Stack>

        <Box
          sx={{
            width: "100%",
            bgcolor: alpha(dk.white, 0.72),
            border: `1px solid ${alpha(dk.border, 0.2)}`,
            borderRadius: 2.5,
            px: { xs: 2, sm: 2.5 },
            py: 2,
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
              inset: -10,
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
              lineHeight: 1.55,
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
  );
}
