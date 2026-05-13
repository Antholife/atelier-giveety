"use client";

import { Check, ExpandMore, Translate } from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useRef, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const LANGS = [
  { code: "fr", flag: "🇫🇷", native: "Français", label: "French" },
  { code: "en", flag: "🇬🇧", native: "English", label: "Anglais" },
  { code: "es", flag: "🇪🇸", native: "Español", label: "Espagnol" },
  { code: "de", flag: "🇩🇪", native: "Deutsch", label: "Allemand" },
  { code: "it", flag: "🇮🇹", native: "Italiano", label: "Italien" },
];

export default function WireframeLanguageSwitcher() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("fr");
  const ref = useRef<HTMLDivElement | null>(null);

  const current = LANGS.find((l) => l.code === code) ?? LANGS[0];

  const handlePick = useCallback((c: string) => {
    setCode(c);
    setOpen(false);
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
        position: "relative",
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Langue de l'interface
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Tes certificats gardent leur langue d'origine.
      </Typography>

      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box ref={ref} sx={{ position: "relative" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => setOpen((v) => !v)}
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              border: `1px solid ${open ? dk.tertiary : alpha(dk.border, 0.25)}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
              bgcolor: open ? alpha(dk.tertiaryLight, 0.2) : dk.canvas,
            }}
          >
            <Box sx={{ fontSize: 22 }}>{current.flag}</Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}>
                {current.native}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {current.label}
              </Typography>
            </Box>
            <Translate sx={{ color: "text.secondary", fontSize: 18 }} />
            <ExpandMore
              sx={{
                color: "text.secondary",
                transition: "transform 0.2s ease",
                transform: open ? "rotate(180deg)" : "rotate(0)",
              }}
            />
          </Stack>

          {open ? (
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                zIndex: 10,
                bgcolor: dk.canvas,
                borderRadius: 2,
                border: `1px solid ${alpha(dk.border, 0.18)}`,
                boxShadow: `0 12px 32px ${alpha(dk.surfaceStrong, 0.16)}`,
                py: 0.5,
              }}
            >
              {LANGS.map((l) => {
                const active = l.code === code;
                return (
                  <Stack
                    key={l.code}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    onClick={() => handlePick(l.code)}
                    sx={{
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      bgcolor: active ? alpha(dk.tertiaryLight, 0.4) : "transparent",
                      "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.4) },
                    }}
                  >
                    <Box sx={{ fontSize: 18 }}>{l.flag}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}>
                        {l.native}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        {l.label}
                      </Typography>
                    </Box>
                    {active ? <Check sx={{ color: "tertiary.main", fontSize: 18 }} /> : null}
                  </Stack>
                );
              })}
            </Box>
          ) : null}
        </Box>
      </ClickAwayListener>
    </Box>
  );
}
