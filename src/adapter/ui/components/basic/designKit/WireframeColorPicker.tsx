"use client";

import { Check } from "@mui/icons-material";
import { Box, Slider, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const SWATCHES = [
  { id: "primary", color: "#5B5BD6" },
  { id: "tertiary", color: "#0BC5A0" },
  { id: "rose", color: "#F4709F" },
  { id: "amber", color: "#F4B400" },
  { id: "indigo", color: "#3F4ACF" },
  { id: "lavender", color: "#A78BFA" },
  { id: "lime", color: "#A1D75D" },
  { id: "ink", color: "#2A2C45" },
];

function withLightness(color: string, lightness: number): string {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const factor = lightness / 100;
  const adj = (c: number) =>
    factor < 0.5
      ? Math.round(c * (factor * 2))
      : Math.round(c + (255 - c) * (factor * 2 - 1));
  return `#${[adj(r), adj(g), adj(b)].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

export default function WireframeColorPicker() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [color, setColor] = useState(SWATCHES[0].color);
  const [lightness, setLightness] = useState(50);

  const finalColor = useMemo(() => withLightness(color, lightness), [color, lightness]);

  const handleSlider = useCallback((_e: Event, v: number | number[]) => {
    setLightness(typeof v === "number" ? v : v[0]);
  }, []);

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
        Couleur de mon profil
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Choisis la teinte qui apparaîtra sur ton certificat.
      </Typography>

      <Stack direction="row" spacing={2} alignItems="stretch">
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${finalColor} 0%, ${withLightness(color, Math.min(80, lightness + 20))} 100%)`,
            border: `2px solid ${alpha(dk.white, 0.8)}`,
            boxShadow: `0 8px 18px ${alpha(finalColor, 0.4)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 32,
          }}
        >
          E
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
            {SWATCHES.map((sw) => {
              const active = sw.color === color;
              return (
                <Box
                  key={sw.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setColor(sw.color)}
                  sx={{
                    aspectRatio: "1 / 1",
                    borderRadius: 2,
                    bgcolor: sw.color,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${active ? dk.white : "transparent"}`,
                    boxShadow: active
                      ? `0 0 0 2px ${dk.surfaceStrong}, 0 4px 10px ${alpha(sw.color, 0.5)}`
                      : `0 2px 6px ${alpha(sw.color, 0.3)}`,
                    transition: "transform 0.15s ease, box-shadow 0.2s ease",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  {active ? <Check sx={{ color: "#fff", fontSize: 16 }} /> : null}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
            Luminosité
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.main" }}>
            {lightness}%
          </Typography>
        </Stack>
        <Slider
          value={lightness}
          onChange={handleSlider}
          min={20}
          max={80}
          sx={{
            color: dk.surfaceStrong,
            "& .MuiSlider-rail": {
              opacity: 1,
              background: `linear-gradient(90deg, ${withLightness(color, 20)}, ${color}, ${withLightness(color, 80)})`,
              height: 8,
            },
            "& .MuiSlider-track": { display: "none" },
            "& .MuiSlider-thumb": {
              width: 20,
              height: 20,
              bgcolor: dk.white,
              border: `3px solid ${finalColor}`,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          mt: 2,
          p: 1.25,
          borderRadius: 2,
          bgcolor: alpha(dk.surfaceMuted, 0.3),
          fontFamily: "monospace",
          fontSize: 12,
          fontWeight: 700,
          textAlign: "center",
          color: "primary.main",
        }}
      >
        {finalColor.toUpperCase()}
      </Box>
    </Box>
  );
}
