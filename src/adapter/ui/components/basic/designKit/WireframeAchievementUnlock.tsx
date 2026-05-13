"use client";

import { Celebration, EmojiEvents, Replay } from "@mui/icons-material";
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const CONFETTI_COUNT = 28;

function Confetti() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const colors = [dk.tertiary, dk.surfaceStrong, dk.surfaceAccent, dk.mint];
  const pieces = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.4 + Math.random() * 1.2,
        rotate: Math.random() * 360,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 8,
      })),
    [colors],
  );

  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pieces.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: "absolute",
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            bgcolor: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `wf-confetti-fall ${p.duration}s ${p.delay}s linear forwards`,
            "@keyframes wf-confetti-fall": {
              "0%": { transform: `translateY(0) rotate(${p.rotate}deg)`, opacity: 1 },
              "100%": { transform: `translateY(420px) rotate(${p.rotate + 720}deg)`, opacity: 0 },
            },
          }}
        />
      ))}
    </Box>
  );
}

export default function WireframeAchievementUnlock() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const trigger = useCallback(() => {
    setTick((t) => t + 1);
    setOpen(true);
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Achievement modal · démo
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
        Clique pour rejouer l'animation de déblocage.
      </Typography>
      <Button
        startIcon={<Celebration />}
        disableElevation
        onClick={trigger}
        sx={{
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 800,
          px: 3,
          bgcolor: dk.surfaceStrong,
          color: dk.white,
          "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
        }}
      >
        Débloquer un badge
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 420 },
            bgcolor: dk.canvas,
            borderRadius: 3,
            overflow: "hidden",
            outline: "none",
            boxShadow: `0 24px 60px ${alpha("#000", 0.3)}`,
            animation: "wf-pop 0.35s ease",
            "@keyframes wf-pop": {
              "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: 0 },
              "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
            },
          }}
          key={tick}
        >
          <Box
            sx={{
              position: "relative",
              px: 4,
              pt: 5,
              pb: 4,
              textAlign: "center",
              background: `linear-gradient(160deg, ${alpha(dk.primaryLight, 0.6)} 0%, ${dk.white} 100%)`,
            }}
          >
            <Confetti key={tick} />
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                mx: "auto",
                mb: 2,
                background: `linear-gradient(135deg, ${dk.tertiary} 0%, ${dk.surfaceStrong} 100%)`,
                color: dk.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 0 12px ${alpha(dk.tertiary, 0.18)}`,
                position: "relative",
                animation: "wf-spin 0.8s ease",
                "@keyframes wf-spin": {
                  "0%": { transform: "rotate(-180deg) scale(0)" },
                  "100%": { transform: "rotate(0) scale(1)" },
                },
              }}
            >
              <EmojiEvents sx={{ fontSize: 48 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
              Badge débloqué !
            </Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600, mb: 3 }}>
              Tu viens d'atteindre <strong>+100h de bénévolat</strong>. Bravo Élise 🎉
            </Typography>
            <Stack direction="row" spacing={1.5} justifyContent="center">
              <Button
                startIcon={<Replay />}
                onClick={() => setTick((t) => t + 1)}
                sx={{
                  borderRadius: 9999,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: dk.surfaceAccent,
                  color: dk.surfaceStrong,
                  "&:hover": { bgcolor: darken(dk.surfaceAccent, 0.05) },
                }}
              >
                Rejouer
              </Button>
              <Button
                disableElevation
                onClick={() => setOpen(false)}
                sx={{
                  borderRadius: 9999,
                  textTransform: "none",
                  fontWeight: 800,
                  px: 3,
                  bgcolor: dk.surfaceStrong,
                  color: dk.white,
                  "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
                }}
              >
                Cool, merci !
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
