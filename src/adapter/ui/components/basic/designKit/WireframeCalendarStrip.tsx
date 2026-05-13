"use client";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const DAY_NAMES = ["L", "M", "M", "J", "V", "S", "D"];
const MONTH_NAMES = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const SLOT_COUNT = [0, 2, 1, 0, 3, 2, 1, 0, 0, 4, 1, 2, 0, 1];

function buildDays(weekOffset: number) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + weekOffset * 7);
  return Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function WireframeCalendarStrip() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const days = useMemo(() => buildDays(weekOffset), [weekOffset]);
  const today = new Date();
  const todayKey = today.toDateString();

  const keyOf = useCallback((d: Date) => d.toDateString(), []);

  const monthLabel = `${MONTH_NAMES[days[0].getMonth()]} ${days[0].getFullYear()}`;

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
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Choisir un créneau
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {monthLabel}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Semaine précédente">
            <ChevronLeft />
          </IconButton>
          <IconButton size="small" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Semaine suivante">
            <ChevronRight />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
        {days.map((d, i) => {
          const k = keyOf(d);
          const isToday = k === todayKey;
          const isSelected = selected === k;
          const slots = SLOT_COUNT[i] ?? 0;
          const dayName = DAY_NAMES[(d.getDay() + 6) % 7];
          return (
            <Box
              key={k}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(isSelected ? null : k)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(isSelected ? null : k);
                }
              }}
              sx={{
                flex: "0 0 auto",
                width: 56,
                py: 1.5,
                borderRadius: 2,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: isSelected ? dk.surfaceStrong : alpha(dk.surfaceMuted, 0.3),
                color: isSelected ? dk.white : dk.text,
                border: isToday && !isSelected ? `2px solid ${dk.tertiary}` : "2px solid transparent",
                transition: "all 0.15s ease",
                outline: "none",
                "&:hover": {
                  bgcolor: isSelected ? dk.surfaceStrong : alpha(dk.surfaceAccent, 0.4),
                },
                "&:focus-visible": { boxShadow: `0 0 0 3px ${alpha(dk.tertiary, 0.4)}` },
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.8 }}>
                {dayName}
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1 }}>
                {d.getDate()}
              </Typography>
              {slots > 0 ? (
                <Stack direction="row" spacing={0.25} justifyContent="center" sx={{ mt: 0.5 }}>
                  {Array.from({ length: Math.min(3, slots) }).map((_, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: isSelected ? dk.white : dk.tertiary,
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="caption" sx={{ fontSize: 9, opacity: 0.5 }}>
                  —
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {selected ? (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(dk.tertiaryLight, 0.5),
            color: "primary.main",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          ✓ Créneau sélectionné — on te confirmera par e-mail (démo).
        </Box>
      ) : null}
    </Box>
  );
}
