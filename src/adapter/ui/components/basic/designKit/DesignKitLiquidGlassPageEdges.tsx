"use client";

import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

const reduceMotion = {
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none !important",
  },
} as const;

type DesignKitLiquidGlassPageEdgesProps = {
  /** Accueil : formes fluides + loupes latérales (démo liquid glass) */
  active: boolean;
};

/** Couleurs d’ambiance (hors palette stricte) pour varier le fond animé. */
const FLUID_ACCENTS = {
  blue: "#2563EB",
  sky: "#0EA5E9",
  cyan: "#06B6D4",
  indigo: "#4F46E5",
  violet: "#7C3AED",
  rose: "#EC4899",
  amber: "#F59E0B",
  lime: "#84CC16",
  fuchsia: "#D946EF",
  emerald: "#10B981",
  orange: "#FB923C",
} as const;

type FluidSpec = {
  id: string;
  w: { xs: string; md: string };
  h: { xs: string; md: string };
  borderRadius: string;
  /** Si défini : triangle (ou autre polygone CSS) au lieu du border-radius seul */
  clipPath?: string;
  bg: string;
  glass?: boolean;
  top: string;
  left: string;
  anim: string;
  duration: number;
  delay: number;
};

/**
 * Fond d’ambiance slide Accueil : formes fluides plein écran (plein de couleurs + géométries)
 * + **loupes rondes** liquid glass sur les côtés (sans bandeaux dégradés) — pointer-events: none partout.
 */
export default function DesignKitLiquidGlassPageEdges({ active }: DesignKitLiquidGlassPageEdgesProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;

  const fluidShapes = useMemo((): FluidSpec[] => {
    const a = (hex: string, v = 0.22) => alpha(hex, v);
    return [
      {
        id: "a",
        w: { xs: "min(72vw, 260px)", md: "280px" },
        h: { xs: "min(28vw, 120px)", md: "140px" },
        borderRadius: "36px",
        bg: a(FLUID_ACCENTS.blue, 0.2),
        top: "6%",
        left: "-4%",
        anim: "dkFluid0",
        duration: 29,
        delay: 0,
      },
      {
        id: "b",
        w: { xs: "min(52vw, 200px)", md: "220px" },
        h: { xs: "min(52vw, 200px)", md: "220px" },
        borderRadius: "50%",
        bg: a(FLUID_ACCENTS.cyan, 0.18),
        glass: true,
        top: "42%",
        left: "72%",
        anim: "dkFluid1",
        duration: 24,
        delay: -3,
      },
      {
        id: "c",
        w: { xs: "min(88vw, 320px)", md: "360px" },
        h: { xs: "20vw", md: "72px" },
        borderRadius: "9999px",
        bg: a(primary, 0.16),
        top: "78%",
        left: "8%",
        anim: "dkFluid2",
        duration: 33,
        delay: -7,
      },
      {
        id: "d",
        w: { xs: "min(40vw, 160px)", md: "180px" },
        h: { xs: "min(48vw, 200px)", md: "240px" },
        borderRadius: "18px",
        bg: a(tertiary, 0.2),
        top: "12%",
        left: "58%",
        anim: "dkFluid3",
        duration: 27,
        delay: -2,
      },
      {
        id: "e",
        w: { xs: "min(36vw, 140px)", md: "160px" },
        h: { xs: "min(36vw, 140px)", md: "160px" },
        borderRadius: "50%",
        bg: a(FLUID_ACCENTS.violet, 0.19),
        top: "55%",
        left: "-6%",
        anim: "dkFluid4",
        duration: 31,
        delay: -9,
      },
      {
        id: "f",
        w: { xs: "min(64vw, 240px)", md: "260px" },
        h: { xs: "min(30vw, 130px)", md: "150px" },
        borderRadius: "12px",
        bg: a(FLUID_ACCENTS.indigo, 0.17),
        glass: true,
        top: "68%",
        left: "48%",
        anim: "dkFluid5",
        duration: 26,
        delay: -4,
      },
      {
        id: "g",
        w: { xs: "min(75vw, 300px)", md: "320px" },
        h: { xs: "min(22vw, 100px)", md: "110px" },
        borderRadius: "8px",
        bg: a(FLUID_ACCENTS.sky, 0.21),
        top: "-4%",
        left: "38%",
        anim: "dkFluid6",
        duration: 35,
        delay: -11,
      },
      {
        id: "h",
        w: { xs: "min(44vw, 180px)", md: "200px" },
        h: { xs: "min(44vw, 180px)", md: "200px" },
        borderRadius: "28%",
        bg: alpha(dk.surfaceMuted, 0.4),
        top: "30%",
        left: "22%",
        anim: "dkFluid7",
        duration: 22,
        delay: -5,
      },
      {
        id: "i",
        w: { xs: "min(48vw, 200px)", md: "220px" },
        h: { xs: "min(26vw, 110px)", md: "120px" },
        borderRadius: "9999px",
        bg: a(FLUID_ACCENTS.rose, 0.16),
        top: "88%",
        left: "62%",
        anim: "dkFluid8",
        duration: 30,
        delay: -8,
      },
      {
        id: "j",
        w: { xs: "min(56vw, 200px)", md: "240px" },
        h: { xs: "min(56vw, 200px)", md: "240px" },
        borderRadius: "50%",
        bg: alpha(primary, 0.12),
        glass: true,
        top: "48%",
        left: "40%",
        anim: "dkFluid9",
        duration: 28,
        delay: -6,
      },
      {
        id: "k",
        w: { xs: "min(90vw, 100%)", md: "min(480px, 38vw)" },
        h: { xs: "120px", md: "160px" },
        borderRadius: "44px",
        bg: a(FLUID_ACCENTS.blue, 0.12),
        top: "20%",
        left: "55%",
        anim: "dkFluid10",
        duration: 34,
        delay: -12,
      },
      /* Triangles + nouvelles teintes */
      {
        id: "tri-u",
        w: { xs: "min(40vw, 180px)", md: "200px" },
        h: { xs: "min(36vw, 170px)", md: "190px" },
        borderRadius: "0",
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        bg: a(FLUID_ACCENTS.amber, 0.24),
        top: "2%",
        left: "68%",
        anim: "dkFluid11",
        duration: 27,
        delay: -5,
      },
      {
        id: "tri-d",
        w: { xs: "min(44vw, 190px)", md: "210px" },
        h: { xs: "min(40vw, 180px)", md: "200px" },
        borderRadius: "0",
        clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
        bg: a(FLUID_ACCENTS.lime, 0.22),
        top: "62%",
        left: "-3%",
        anim: "dkFluid12",
        duration: 31,
        delay: -8,
      },
      {
        id: "tri-l",
        w: { xs: "min(38vw, 170px)", md: "190px" },
        h: { xs: "min(34vw, 160px)", md: "175px" },
        borderRadius: "0",
        clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
        bg: a(FLUID_ACCENTS.fuchsia, 0.2),
        glass: true,
        top: "38%",
        left: "78%",
        anim: "dkFluid13",
        duration: 25,
        delay: -2,
      },
      {
        id: "tri-r",
        w: { xs: "min(36vw, 160px)", md: "185px" },
        h: { xs: "min(32vw, 150px)", md: "170px" },
        borderRadius: "0",
        clipPath: "polygon(100% 50%, 0% 0%, 0% 100%)",
        bg: a(FLUID_ACCENTS.emerald, 0.23),
        top: "72%",
        left: "35%",
        anim: "dkFluid14",
        duration: 29,
        delay: -10,
      },
      {
        id: "tri-up2",
        w: { xs: "min(28vw, 120px)", md: "140px" },
        h: { xs: "min(26vw, 115px)", md: "130px" },
        borderRadius: "0",
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        bg: a(FLUID_ACCENTS.orange, 0.26),
        top: "44%",
        left: "8%",
        anim: "dkFluid15",
        duration: 23,
        delay: -6,
      },
    ];
  }, [dk, primary, tertiary]);

  if (!active) return null;

  /** Colonnes latérales minimales : uniquement les loupes rondes (plus de bandeaux dégradés). */
  const sideRailSx = {
    display: { xs: "none", sm: "block" },
    position: "fixed" as const,
    top: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: "none" as const,
    overflow: "visible",
    width: { sm: 100, md: 104, lg: 112 },
    isolation: "isolate" as const,
  };

  const loupeBase = {
    position: "absolute" as const,
    left: "50%",
    width: { sm: 88, md: 104 },
    height: { sm: 88, md: 104 },
    marginLeft: { sm: "-44px", md: "-52px" },
    borderRadius: "50%",
    /* Forte diffusion = contraste net avec la bande (effet loupe lisible). */
    backdropFilter: "blur(30px) saturate(220%)",
    WebkitBackdropFilter: "blur(30px) saturate(220%)",
    bgcolor: alpha(dk.frost, 0.06),
    border: `3px solid ${alpha(dk.frost, 0.88)}`,
    boxShadow: `
      inset 0 2px 12px ${alpha(dk.frost, 0.5)},
      inset 0 -2px 8px ${alpha("#000", 0.12)},
      0 0 0 1px ${alpha("#000", 0.12)},
      0 16px 44px ${alpha("#000", 0.2)},
      0 0 48px ${alpha(tertiary, 0.35)}
    `,
  };

  return (
    <>
      {/* Calque plein écran : formes (rects, pills, ronds, triangles…) */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          "@keyframes dkFluid0": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
            "22%": { transform: "translate(18vw, 22vh) rotate(22deg) scale(1.04)" },
            "48%": { transform: "translate(-10vw, 48vh) rotate(-14deg) scale(0.96)" },
            "71%": { transform: "translate(24vw, -6vh) rotate(18deg) scale(1.02)" },
          },
          "@keyframes dkFluid1": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "33%": { transform: "translate(-35vw, 28vh) rotate(-160deg)" },
            "66%": { transform: "translate(12vw, -18vh) rotate(120deg)" },
          },
          "@keyframes dkFluid2": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "27%": { transform: "translate(40vw, -12vh) skewX(-6deg)" },
            "58%": { transform: "translate(-25vw, 10vh) skewX(4deg)" },
            "82%": { transform: "translate(8vw, 5vh)" },
          },
          "@keyframes dkFluid3": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "30%": { transform: "translate(-22vw, 35vh) rotate(12deg)" },
            "55%": { transform: "translate(16vw, -20vh) rotate(-8deg)" },
            "78%": { transform: "translate(-8vw, -8vh) rotate(6deg)" },
          },
          "@keyframes dkFluid4": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "40%": { transform: "translate(45vw, -25vh) scale(1.08)" },
            "70%": { transform: "translate(15vw, 40vh) scale(0.92)" },
          },
          "@keyframes dkFluid5": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "25%": { transform: "translate(-30vw, 8vh) rotate(-25deg)" },
            "50%": { transform: "translate(20vw, -30vh) rotate(20deg)" },
            "75%": { transform: "translate(-12vw, 22vh) rotate(12deg)" },
          },
          "@keyframes dkFluid6": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "35%": { transform: "translate(28vw, 30vh)" },
            "65%": { transform: "translate(-32vw, 5vh)" },
          },
          "@keyframes dkFluid7": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "20%": { transform: "translate(25vw, 18vh) rotate(90deg)" },
            "45%": { transform: "translate(-18vw, 32vh) rotate(180deg)" },
            "72%": { transform: "translate(10vw, -14vh) rotate(270deg)" },
          },
          "@keyframes dkFluid8": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "30%": { transform: "translate(-40vw, -15vh)" },
            "60%": { transform: "translate(18vw, 8vh)" },
          },
          "@keyframes dkFluid9": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(-15vw, -35vh) scale(1.12)" },
          },
          "@keyframes dkFluid10": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "33%": { transform: "translate(-20vw, 25vh) rotate(-8deg)" },
            "66%": { transform: "translate(30vw, -18vh) rotate(10deg)" },
          },
          "@keyframes dkFluid11": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "30%": { transform: "translate(-28vw, 30vh) rotate(-55deg)" },
            "60%": { transform: "translate(14vw, -22vh) rotate(40deg)" },
          },
          "@keyframes dkFluid12": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "40%": { transform: "translate(38vw, -18vh) rotate(72deg)" },
            "75%": { transform: "translate(-12vw, 25vh) rotate(-35deg)" },
          },
          "@keyframes dkFluid13": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
            "35%": { transform: "translate(-42vw, 8vh) rotate(-90deg) scale(1.06)" },
            "70%": { transform: "translate(8vw, 35vh) rotate(45deg) scale(0.94)" },
          },
          "@keyframes dkFluid14": {
            "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
            "25%": { transform: "translate(20vw, -28vh) rotate(60deg)" },
            "55%": { transform: "translate(-25vw, 15vh) rotate(-50deg)" },
          },
          "@keyframes dkFluid15": {
            "0%, 100%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
            "50%": { transform: "translate(55vw, 12vh) scale(1.1) rotate(180deg)" },
          },
          ...reduceMotion,
        }}
      >
        {fluidShapes.map((s) => (
          <Box
            key={s.id}
            sx={{
              position: "absolute",
              width: s.w,
              height: s.h,
              ...(s.clipPath
                ? {
                    clipPath: s.clipPath,
                    borderRadius: 0,
                  }
                : { borderRadius: s.borderRadius }),
              bgcolor: s.bg,
              top: s.top,
              left: s.left,
              willChange: "transform",
              animation: `${s.anim} ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
              ...(s.glass
                ? {
                    backdropFilter: "blur(28px) saturate(210%)",
                    WebkitBackdropFilter: "blur(28px) saturate(210%)",
                    border: `1px solid ${alpha(dk.frost, 0.42)}`,
                    boxShadow: `0 8px 32px ${alpha("#000", 0.08)}, inset 0 1px 0 ${alpha(dk.frost, 0.35)}`,
                  }
                : {
                    boxShadow: `0 4px 28px ${alpha("#000", 0.06)}`,
                  }),
              ...reduceMotion,
            }}
          />
        ))}
      </Box>

      {/* Gauche : loupes rondes uniquement */}
      <Box
        aria-hidden
        sx={{
          ...sideRailSx,
          left: 0,
        }}
      >
        <Box
          sx={{
            ...loupeBase,
            animation: "dkLgLeftLoupe 11s ease-in-out infinite",
            "@keyframes dkLgLeftLoupe": {
              "0%, 100%": { top: "10%" },
              "50%": { top: "70%" },
            },
            ...reduceMotion,
          }}
        />
        <Box
          sx={{
            ...loupeBase,
            width: { sm: 52, md: 56 },
            height: { sm: 52, md: 56 },
            marginLeft: { sm: "-26px", md: "-28px" },
            backdropFilter: "blur(22px) saturate(230%)",
            WebkitBackdropFilter: "blur(22px) saturate(230%)",
            bgcolor: alpha(dk.frost, 0.05),
            border: `2.5px solid ${alpha(dk.frost, 0.82)}`,
            boxShadow: `
              inset 0 1px 10px ${alpha(dk.frost, 0.45)},
              0 0 0 1px ${alpha("#000", 0.1)},
              0 10px 32px ${alpha("#000", 0.18)}
            `,
            animation: "dkLgLeftLoupeSmall 14s ease-in-out infinite",
            animationDelay: "-3.5s",
            "@keyframes dkLgLeftLoupeSmall": {
              "0%, 100%": { top: "68%" },
              "50%": { top: "14%" },
            },
            opacity: 0.88,
            ...reduceMotion,
          }}
        />
      </Box>

      {/* Droite : loupe ronde uniquement */}
      <Box
        aria-hidden
        sx={{
          ...sideRailSx,
          right: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: { sm: 72, md: 84 },
            height: { sm: 72, md: 84 },
            borderRadius: "50%",
            backdropFilter: "blur(26px) saturate(225%)",
            WebkitBackdropFilter: "blur(26px) saturate(225%)",
            bgcolor: alpha(dk.frost, 0.07),
            border: `3px solid ${alpha(dk.frost, 0.85)}`,
            boxShadow: `
              inset 0 2px 10px ${alpha(dk.frost, 0.4)},
              0 0 0 1px ${alpha("#000", 0.1)},
              0 14px 40px ${alpha("#000", 0.18)}
            `,
            animation: "dkLgRightOrb 9s ease-in-out infinite",
            "@keyframes dkLgRightOrb": {
              "0%, 100%": { top: "16%", left: "6%" },
              "50%": { top: "56%", left: "20%" },
            },
            ...reduceMotion,
          }}
        />
      </Box>
    </>
  );
}
