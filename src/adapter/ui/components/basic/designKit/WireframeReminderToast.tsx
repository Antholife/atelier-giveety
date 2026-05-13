"use client";

import { Alarm, Close, Snooze } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const SNOOZES = [
  { id: "10m", label: "10 min", minutes: 10 },
  { id: "1h", label: "1 h", minutes: 60 },
  { id: "tomorrow", label: "Demain", minutes: 1440 },
];

export default function WireframeReminderToast() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(true);
  const [snoozedUntil, setSnoozedUntil] = useState<string | null>(null);

  const snooze = useCallback((label: string) => {
    setSnoozedUntil(label);
    setOpen(false);
    window.setTimeout(() => {
      setOpen(true);
      setSnoozedUntil(null);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!open && !snoozedUntil) {
      const t = window.setTimeout(() => setOpen(true), 1500);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open, snoozedUntil]);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
        minHeight: 220,
        position: "relative",
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Rappel d'engagement
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Snooze pour repousser le rappel.
      </Typography>

      {open ? (
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            background: `linear-gradient(120deg, ${alpha(dk.tertiaryLight, 0.5)} 0%, ${alpha(dk.primaryLight, 0.5)} 100%)`,
            border: `1px solid ${alpha(dk.tertiary, 0.3)}`,
            position: "relative",
            animation: "slideDown 0.3s cubic-bezier(.4,1.4,.4,1)",
            "@keyframes slideDown": {
              from: { opacity: 0, transform: "translateY(-10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 6, right: 6 }}
            aria-label="Fermer"
          >
            <Close fontSize="small" />
          </IconButton>
          <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ pr: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: dk.surfaceStrong,
                color: dk.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Alarm sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
                Mission dans 1 h
              </Typography>
              <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 500 }}>
                Maraude · 19h00 · 12 rue Bichat
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.75} sx={{ mt: 1.5, flexWrap: "wrap", gap: 0.75 }}>
            {SNOOZES.map((s) => (
              <Button
                key={s.id}
                size="small"
                startIcon={<Snooze sx={{ fontSize: 14 }} />}
                onClick={() => snooze(s.label)}
                sx={{
                  borderRadius: 9999,
                  textTransform: "none",
                  fontWeight: 800,
                  bgcolor: alpha(dk.white, 0.7),
                  color: "primary.main",
                  px: 1.5,
                  "&:hover": { bgcolor: dk.white },
                }}
              >
                {s.label}
              </Button>
            ))}
            <Button
              size="small"
              sx={{
                ml: "auto",
                borderRadius: 9999,
                textTransform: "none",
                fontWeight: 800,
                bgcolor: dk.surfaceStrong,
                color: dk.white,
                px: 2,
                "&:hover": { bgcolor: dk.surfaceStrong, opacity: 0.9 },
              }}
            >
              J'y vais !
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            border: `1px dashed ${alpha(dk.border, 0.3)}`,
            textAlign: "center",
            color: "text.secondary",
            fontWeight: 700,
          }}
        >
          ⏰ Reporté à <Box component="span" sx={{ color: "tertiary.main" }}>{snoozedUntil ?? "—"}</Box> · réapparition dans 3 s
        </Box>
      )}
    </Box>
  );
}
