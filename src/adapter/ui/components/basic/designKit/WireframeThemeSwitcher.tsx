"use client";

import { Brightness6, DarkMode, LightMode } from "@mui/icons-material";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ComponentType } from "react";
import type { SvgIconProps } from "@mui/material";
import { designKitPalette } from "./designKitPalette";

type Mode = "light" | "auto" | "dark";

const MODES: { id: Mode; label: string; Icon: ComponentType<SvgIconProps> }[] = [
  { id: "light", label: "Light", Icon: LightMode },
  { id: "auto", label: "Auto", Icon: Brightness6 },
  { id: "dark", label: "Dark", Icon: DarkMode },
];

export default function WireframeThemeSwitcher() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [mode, setMode] = useState<Mode>("light");

  const handleSelect = useCallback((m: Mode) => setMode(m), []);

  const previewBg =
    mode === "dark"
      ? "#1a1d2b"
      : mode === "auto"
        ? `linear-gradient(90deg, ${dk.canvas} 50%, #1a1d2b 50%)`
        : dk.canvas;
  const previewText = mode === "dark" ? "#fff" : dk.text;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Apparence
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Choisis le thème de ton interface.
      </Typography>

      <Box
        sx={{
          height: 110,
          borderRadius: 2.5,
          background: previewBg,
          color: previewText,
          border: `1px solid ${alpha(dk.border, 0.18)}`,
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          transition: "background 0.4s ease, color 0.4s ease",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Aperçu Giveety
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600, mt: 0.5 }}>
          Mode {mode}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1}>
        {MODES.map(({ id, label, Icon }) => {
          const active = mode === id;
          return (
            <Box
              key={id}
              role="button"
              aria-pressed={active}
              tabIndex={0}
              onClick={() => handleSelect(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(id);
                }
              }}
              sx={{
                flex: 1,
                p: 1.25,
                borderRadius: 2,
                cursor: "pointer",
                textAlign: "center",
                bgcolor: active ? dk.surfaceStrong : alpha(dk.surfaceMuted, 0.4),
                color: active ? dk.white : "primary.main",
                border: `1px solid ${active ? dk.surfaceStrong : alpha(dk.border, 0.18)}`,
                transition: "all 0.2s ease",
                "&:hover": { transform: "translateY(-1px)" },
                outline: "none",
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
              <Typography variant="caption" sx={{ display: "block", mt: 0.25, fontWeight: 800 }}>
                {label}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
