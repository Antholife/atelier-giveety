"use client";

import { CheckCircle, ChevronRight, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Item = {
  id: string;
  title: string;
  desc: string;
  done: boolean;
};

const INITIAL: Item[] = [
  { id: "1", title: "Compléter ton profil", desc: "Photo, bio, ville", done: true },
  { id: "2", title: "Ajouter ta première mission", desc: "Importe ou saisis", done: true },
  { id: "3", title: "Inviter ton premier manager", desc: "Pour qu'il certifie tes compétences", done: false },
  { id: "4", title: "Sélectionner 3 compétences favorites", desc: "Elles ressortiront sur ton certificat", done: false },
  { id: "5", title: "Générer ta première certificat", desc: "Elle est prête à partager !", done: false },
];

export default function WireframeChecklist() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [items, setItems] = useState<Item[]>(INITIAL);

  const toggle = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }, []);

  const completed = items.filter((i) => i.done).length;
  const pct = Math.round((completed / items.length) * 100);
  const allDone = completed === items.length;

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Premiers pas Giveety
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {completed} / {items.length} étapes terminées
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: allDone ? "tertiary.main" : "primary.main" }}>
          {pct}%
        </Typography>
      </Stack>

      <Box
        sx={{
          height: 8,
          borderRadius: 9999,
          bgcolor: alpha(dk.border, 0.18),
          overflow: "hidden",
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${dk.surfaceStrong}, ${dk.tertiary})`,
            transition: "width 0.4s ease",
          }}
        />
      </Box>

      <Stack spacing={0.75}>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => toggle(item.id)}
            sx={{
              px: 1.5,
              py: 1.25,
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: item.done ? alpha(dk.mint, 0.25) : alpha(dk.surfaceMuted, 0.2),
              border: `1px solid ${item.done ? alpha(dk.surfaceStrong, 0.2) : alpha(dk.border, 0.15)}`,
              transition: "all 0.15s ease",
              "&:hover": { transform: "translateX(2px)" },
            }}
          >
            {item.done ? (
              <CheckCircle sx={{ color: "primary.main", fontSize: 22 }} />
            ) : (
              <RadioButtonUnchecked sx={{ color: alpha(dk.textMuted, 0.6), fontSize: 22 }} />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  textDecoration: item.done ? "line-through" : "none",
                  opacity: item.done ? 0.7 : 1,
                }}
              >
                {item.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {item.desc}
              </Typography>
            </Box>
            {!item.done ? <ChevronRight sx={{ color: "text.secondary" }} /> : null}
          </Stack>
        ))}
      </Stack>

      {allDone ? (
        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: alpha(dk.tertiaryLight, 0.5), textAlign: "center" }}>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            🎉 Bravo, tu es prête à briller sur Giveety !
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}
