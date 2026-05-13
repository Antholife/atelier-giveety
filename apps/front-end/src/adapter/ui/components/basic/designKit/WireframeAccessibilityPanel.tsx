"use client";

import {
  Accessibility,
  Contrast,
  RecordVoiceOver,
  TextDecrease,
  TextIncrease,
} from "@mui/icons-material";
import { Box, Button, Stack, Switch, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

export default function WireframeAccessibilityPanel() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexia, setDyslexia] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  const adjustFont = useCallback((delta: number) => {
    setFontScale((v) => Math.max(80, Math.min(160, v + delta)));
  }, []);

  const reset = useCallback(() => {
    setFontScale(100);
    setHighContrast(false);
    setDyslexia(false);
  }, []);

  const previewBg = highContrast ? "#000" : dk.white;
  const previewFg = highContrast ? "#FFEC00" : dk.text;

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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
        <Accessibility sx={{ color: "primary.main" }} />
        <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
          Accessibilité
        </Typography>
      </Stack>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Adapte l'interface à tes besoins.
      </Typography>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: previewBg,
          color: previewFg,
          border: `1px solid ${alpha(dk.border, 0.18)}`,
          mb: 2,
          fontFamily: dyslexia ? '"OpenDyslexic", "Comic Sans MS", monospace' : "inherit",
          letterSpacing: dyslexia ? "0.04em" : "normal",
          transition: "all 0.3s ease",
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: `${fontScale * 0.16}px` }}>
          Aperçu d'certificat
        </Typography>
        <Typography sx={{ fontSize: `${fontScale * 0.12}px`, opacity: 0.85, mt: 0.5 }}>
          Atelier solidaire le 15 mai · 3h · Lyon
        </Typography>
      </Box>

      <Stack spacing={1.5}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(dk.surfaceMuted, 0.3) }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography sx={{ flex: 1, fontWeight: 700, color: "primary.main" }}>
              Taille du texte
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button
                onClick={() => adjustFont(-10)}
                size="small"
                sx={{ minWidth: 32, p: 0.5, color: "primary.main" }}
              >
                <TextDecrease fontSize="small" />
              </Button>
              <Typography sx={{ width: 40, textAlign: "center", fontWeight: 800, color: "tertiary.main" }}>
                {fontScale}%
              </Typography>
              <Button
                onClick={() => adjustFont(10)}
                size="small"
                sx={{ minWidth: 32, p: 0.5, color: "primary.main" }}
              >
                <TextIncrease fontSize="small" />
              </Button>
            </Stack>
          </Stack>
        </Box>

        {[
          { id: "contrast", label: "Contraste élevé", value: highContrast, set: setHighContrast, Icon: Contrast },
          { id: "dyslexia", label: "Police dyslexie", value: dyslexia, set: setDyslexia, Icon: RecordVoiceOver },
          { id: "motion", label: "Réduire les animations", value: reducedMotion, set: setReducedMotion, Icon: Accessibility },
        ].map(({ id, label, value, set, Icon }) => (
          <Stack
            key={id}
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: alpha(dk.surfaceMuted, 0.3) }}
          >
            <Icon sx={{ color: "primary.main" }} />
            <Typography sx={{ flex: 1, fontWeight: 700, color: "primary.main" }}>
              {label}
            </Typography>
            <Switch checked={value} onChange={(_e, v) => set(v)} color="primary" />
          </Stack>
        ))}
      </Stack>

      <Button onClick={reset} size="small" sx={{ mt: 1.5, textTransform: "none", fontWeight: 700, color: "text.secondary" }}>
        Réinitialiser
      </Button>
    </Box>
  );
}
