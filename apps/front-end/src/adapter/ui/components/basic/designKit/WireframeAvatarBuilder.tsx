"use client";

import { Box, Slider, Stack, TextField, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const PALETTE = [
  "#5B5BD6", "#0BC5A0", "#F4709F", "#F4B400",
  "#3F4ACF", "#A78BFA", "#A1D75D", "#2A2C45",
];

const SHAPES = ["circle", "rounded", "square"] as const;
type Shape = (typeof SHAPES)[number];

function radius(shape: Shape) {
  if (shape === "circle") return "50%";
  if (shape === "rounded") return "20%";
  return "8%";
}

export default function WireframeAvatarBuilder() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [name, setName] = useState("Élise Marchand");
  const [color, setColor] = useState(PALETTE[0]);
  const [shape, setShape] = useState<Shape>("circle");
  const [fontSize, setFontSize] = useState(48);

  const handleSlider = useCallback((_e: Event, v: number | number[]) => {
    setFontSize(typeof v === "number" ? v : v[0]);
  }, []);

  const initials = useMemo(() => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "·";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Avatar builder
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Initiales auto + couleur + forme.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }}>
        <Box
          sx={{
            width: 130,
            height: 130,
            mx: { xs: "auto", sm: 0 },
            borderRadius: radius(shape),
            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize,
            letterSpacing: "0.04em",
            boxShadow: `0 12px 24px ${alpha(color, 0.4)}`,
            transition: "border-radius 0.3s ease, font-size 0.2s ease",
            flexShrink: 0,
          }}
        >
          {initials}
        </Box>

        <Box sx={{ flex: 1, width: "100%" }}>
          <TextField
            fullWidth
            label="Ton nom"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 0.5 }}>
            Couleur
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mb: 2, flexWrap: "wrap", gap: 0.75 }}>
            {PALETTE.map((c) => {
              const active = c === color;
              return (
                <Box
                  key={c}
                  role="button"
                  tabIndex={0}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: c,
                    cursor: "pointer",
                    border: `3px solid ${active ? dk.white : "transparent"}`,
                    boxShadow: active ? `0 0 0 2px ${dk.surfaceStrong}` : `0 2px 4px ${alpha(c, 0.4)}`,
                    transition: "transform 0.15s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
              );
            })}
          </Stack>

          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: "block", mb: 0.5 }}>
            Forme
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {SHAPES.map((s) => {
              const active = s === shape;
              return (
                <Box
                  key={s}
                  role="button"
                  tabIndex={0}
                  onClick={() => setShape(s)}
                  sx={{
                    flex: 1,
                    py: 0.75,
                    textAlign: "center",
                    borderRadius: 2,
                    bgcolor: active ? dk.surfaceStrong : alpha(dk.surfaceMuted, 0.4),
                    color: active ? dk.white : "primary.main",
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {s === "circle" ? "● Rond" : s === "rounded" ? "▢ Arrondi" : "■ Carré"}
                </Box>
              );
            })}
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
              Taille texte
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.main" }}>
              {fontSize}px
            </Typography>
          </Stack>
          <Slider
            value={fontSize}
            onChange={handleSlider}
            min={28}
            max={64}
            sx={{ color: dk.surfaceStrong }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
