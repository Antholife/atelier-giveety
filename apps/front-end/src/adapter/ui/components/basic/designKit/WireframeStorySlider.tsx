"use client";

import { Add, Close } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Modal,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Story = {
  id: string;
  initials: string;
  name: string;
  unread: boolean;
  caption: string;
};

const STORIES: Story[] = [
  { id: "s1", initials: "+", name: "Toi", unread: false, caption: "" },
  { id: "s2", initials: "EM", name: "Élise", unread: true, caption: "Maraude de samedi 🌙" },
  { id: "s3", initials: "TL", name: "Théo", unread: true, caption: "Atelier FLE complet ✨" },
  { id: "s4", initials: "NA", name: "Nora", unread: true, caption: "Régie en coulisses 🎭" },
  { id: "s5", initials: "JM", name: "Julien", unread: false, caption: "Berges nettoyées 🌊" },
  { id: "s6", initials: "SP", name: "Sara", unread: false, caption: "Mini-foot du week-end ⚽" },
];

export default function WireframeStorySlider() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open === null) return undefined;
    setProgress(0);
    const interval = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(interval);
          setOpen((cur) => (cur === null ? null : cur + 1 < STORIES.length ? cur + 1 : null));
          return 0;
        }
        return p + 2;
      });
    }, 80);
    return () => window.clearInterval(interval);
  }, [open]);

  const close = useCallback(() => setOpen(null), []);

  const current = open !== null ? STORIES[open] : null;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: 2,
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 1.5 }}>
        Stories de ta communauté
      </Typography>
      <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto", pb: 1 }}>
        {STORIES.map((s, i) => {
          const isAdd = s.id === "s1";
          return (
            <Stack
              key={s.id}
              alignItems="center"
              spacing={0.5}
              sx={{ flexShrink: 0, cursor: "pointer", width: 64 }}
              onClick={() => !isAdd && setOpen(i)}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  p: "2px",
                  background: s.unread
                    ? `conic-gradient(${dk.tertiary}, ${dk.surfaceStrong}, ${dk.tertiary})`
                    : isAdd
                      ? "transparent"
                      : alpha(dk.border, 0.3),
                  transition: "transform 0.15s ease",
                  "&:hover": { transform: "scale(1.06)" },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    bgcolor: dk.white,
                    border: `2px solid ${dk.white}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      bgcolor: isAdd ? alpha(dk.surfaceMuted, 0.5) : dk.surfaceAccent,
                      color: isAdd ? "primary.main" : dk.surfaceStrong,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      border: isAdd ? `2px dashed ${dk.surfaceStrong}` : "none",
                    }}
                  >
                    {isAdd ? <Add /> : s.initials}
                  </Box>
                </Box>
              </Box>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: s.unread ? "primary.main" : "text.secondary" }}
                noWrap
              >
                {s.name}
              </Typography>
            </Stack>
          );
        })}
      </Box>

      <Modal open={current !== null} onClose={close}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", sm: 360 },
            aspectRatio: "9 / 16",
            maxHeight: "80vh",
            borderRadius: 3,
            overflow: "hidden",
            outline: "none",
            background: `linear-gradient(160deg, ${dk.tertiary} 0%, ${dk.surfaceStrong} 100%)`,
            color: dk.white,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box>
            <Box
              sx={{
                width: "100%",
                height: 3,
                borderRadius: 9999,
                bgcolor: alpha(dk.white, 0.3),
                overflow: "hidden",
                mb: 1.5,
              }}
            >
              <Box sx={{ width: `${progress}%`, height: "100%", bgcolor: dk.white, transition: "width 0.08s linear" }} />
            </Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: dk.white,
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {current?.initials}
              </Box>
              <Typography sx={{ fontWeight: 800, flex: 1 }}>{current?.name}</Typography>
              <IconButton size="small" onClick={close} sx={{ color: dk.white }}>
                <Close />
              </IconButton>
            </Stack>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, textAlign: "center" }}>
            {current?.caption}
          </Typography>
          <Typography variant="caption" sx={{ textAlign: "center", opacity: 0.8 }}>
            Story démo · auto-avance dans 4s
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}
