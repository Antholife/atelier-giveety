"use client";

import { Pause, PlayArrow } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const TIPS = [
  {
    id: "1",
    emoji: "🌱",
    title: "Commence petit",
    body: "Une mission de 2 h compte autant qu'une mission longue. L'essentiel : commencer.",
  },
  {
    id: "2",
    emoji: "🤝",
    title: "Rends visible ton engagement",
    body: "Ajoute un manager pour faire valider tes compétences en un clic.",
  },
  {
    id: "3",
    emoji: "🎯",
    title: "Choisis tes thèmes préférés",
    body: "Tu recevras des suggestions de missions taillées pour toi.",
  },
  {
    id: "4",
    emoji: "🏆",
    title: "Débloque des badges",
    body: "Chaque palier d'engagement révèle de nouveaux badges sur ton profil.",
  },
];

const ROTATION_MS = 4000;

export default function WireframeTipsCarousel() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % TIPS.length);
    }, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  const togglePlay = useCallback(() => setPlaying((v) => !v), []);

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
          💡 Conseils pour bien démarrer
        </Typography>
        <IconButton size="small" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
        </IconButton>
      </Stack>

      <Box
        sx={{
          position: "relative",
          height: 160,
          borderRadius: 2.5,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${alpha(dk.tertiaryLight, 0.5)} 0%, ${alpha(dk.primaryLight, 0.4)} 100%)`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            transform: `translateY(-${index * 100}%)`,
            transition: "transform 0.6s cubic-bezier(.4,1.4,.4,1)",
          }}
        >
          {TIPS.map((t) => (
            <Box
              key={t.id}
              sx={{
                height: "100%",
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ fontSize: 56, flexShrink: 0 }}>{t.emoji}</Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}>
                  {t.title}
                </Typography>
                <Typography sx={{ color: "primary.main", fontWeight: 500, mt: 0.5, opacity: 0.85 }}>
                  {t.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {playing ? (
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 3,
              bgcolor: dk.surfaceStrong,
              animation: `fillBar ${ROTATION_MS}ms linear infinite`,
              "@keyframes fillBar": {
                from: { width: "0%" },
                to: { width: "100%" },
              },
            }}
          />
        ) : null}
      </Box>

      <Stack direction="row" justifyContent="center" spacing={0.75} sx={{ mt: 1.5 }}>
        {TIPS.map((t, i) => (
          <Box
            key={t.id}
            onClick={() => setIndex(i)}
            sx={{
              width: i === index ? 24 : 6,
              height: 6,
              borderRadius: 9999,
              bgcolor: i === index ? dk.surfaceStrong : alpha(dk.border, 0.3),
              cursor: "pointer",
              transition: "width 0.3s ease, background 0.2s ease",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
