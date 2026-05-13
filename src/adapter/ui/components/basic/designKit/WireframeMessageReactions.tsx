"use client";

import { AddReaction } from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const PICKER = ["👍", "❤️", "🔥", "🎉", "🙌", "💚", "😂", "🤝"];

type Reaction = { emoji: string; count: number; mine: boolean };

export default function WireframeMessageReactions() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: "💚", count: 4, mine: true },
    { emoji: "🙌", count: 2, mine: false },
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const toggle = useCallback((emoji: string) => {
    setReactions((prev) => {
      const exists = prev.find((r) => r.emoji === emoji);
      if (!exists) return [...prev, { emoji, count: 1, mine: true }];
      const updated = prev.map((r) =>
        r.emoji === emoji
          ? { ...r, count: r.count + (r.mine ? -1 : 1), mine: !r.mine }
          : r,
      );
      return updated.filter((r) => r.count > 0);
    });
    setPickerOpen(false);
  }, []);

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
        Réactions sur message
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Bulle de chat avec compteurs cliquables.
      </Typography>

      <Stack direction="row" alignItems="flex-end" spacing={1.5} sx={{ mb: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: dk.surfaceAccent,
            color: dk.surfaceStrong,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          CB
        </Box>
        <Box sx={{ position: "relative", maxWidth: "85%" }}>
          <Box
            sx={{
              px: 2,
              py: 1.25,
              borderRadius: 2.5,
              borderTopLeftRadius: 4,
              bgcolor: alpha(dk.surfaceMuted, 0.5),
              color: "primary.main",
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            Super boulot pendant la maraude hier soir 💪 L'équipe avait besoin d'autant d'énergie !
          </Box>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              mt: 0.75,
              flexWrap: "wrap",
              gap: 0.5,
              alignItems: "center",
              position: "relative",
            }}
          >
            {reactions.map((r) => (
              <Box
                key={r.emoji}
                role="button"
                tabIndex={0}
                onClick={() => toggle(r.emoji)}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: 9999,
                  bgcolor: r.mine ? alpha(dk.tertiaryLight, 0.6) : alpha(dk.surfaceMuted, 0.4),
                  border: `1px solid ${r.mine ? dk.tertiary : alpha(dk.border, 0.18)}`,
                  fontSize: 13,
                  fontWeight: 800,
                  color: "primary.main",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <Box component="span" sx={{ fontSize: 14 }}>{r.emoji}</Box>
                <Box component="span" sx={{ fontSize: 11 }}>{r.count}</Box>
              </Box>
            ))}
            <ClickAwayListener onClickAway={() => setPickerOpen(false)}>
              <Box sx={{ position: "relative" }}>
                <IconButton
                  size="small"
                  onClick={() => setPickerOpen((v) => !v)}
                  sx={{
                    bgcolor: alpha(dk.surfaceMuted, 0.5),
                    border: `1px dashed ${alpha(dk.border, 0.3)}`,
                    width: 28,
                    height: 28,
                  }}
                  aria-label="Ajouter une réaction"
                >
                  <AddReaction sx={{ fontSize: 14, color: "primary.main" }} />
                </IconButton>
                {pickerOpen ? (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "calc(100% + 6px)",
                      left: 0,
                      zIndex: 10,
                      p: 0.75,
                      borderRadius: 9999,
                      bgcolor: dk.canvas,
                      border: `1px solid ${alpha(dk.border, 0.2)}`,
                      boxShadow: `0 8px 22px ${alpha(dk.surfaceStrong, 0.18)}`,
                      display: "flex",
                      gap: 0.25,
                    }}
                  >
                    {PICKER.map((e) => (
                      <Box
                        key={e}
                        onClick={() => toggle(e)}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          cursor: "pointer",
                          transition: "transform 0.12s ease",
                          "&:hover": { transform: "scale(1.25)", bgcolor: alpha(dk.surfaceMuted, 0.5) },
                        }}
                      >
                        {e}
                      </Box>
                    ))}
                  </Box>
                ) : null}
              </Box>
            </ClickAwayListener>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
