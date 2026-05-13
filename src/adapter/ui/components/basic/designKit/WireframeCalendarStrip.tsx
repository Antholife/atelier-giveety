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

export type WireframeCalendarStripProps = {
  title?: string;
  /** Sous-titre ; omis = mois de la plage affichée ; `null` pour le masquer */
  caption?: string | null;
  /** Cellules et marges plus grandes (ex. bloc pleine largeur sur fiche mission) */
  comfortable?: boolean;
  /** Jours plus petits, paddings réduits — utile dans une colonne étroite */
  dense?: boolean;
  /** Moins de chrome (ombre) quand le strip est embarqué dans une autre carte */
  embedded?: boolean;
};

export default function WireframeCalendarStrip({
  title,
  caption,
  comfortable,
  dense,
  embedded,
}: WireframeCalendarStripProps = {}) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const days = useMemo(() => buildDays(weekOffset), [weekOffset]);
  const today = new Date();
  const todayKey = today.toDateString();

  const keyOf = useCallback((d: Date) => d.toDateString(), []);

  const monthLabel = `${MONTH_NAMES[days[0].getMonth()]} ${days[0].getFullYear()}`;
  const heading = title ?? "Choisir un créneau";
  const captionText = caption === undefined ? monthLabel : caption;

  const isComfortable = Boolean(comfortable);
  const isDense = Boolean(dense) && !isComfortable;

  const dayWidth = isComfortable ? 68 : isDense ? 42 : 56;
  const dayPy = isComfortable ? 1.85 : isDense ? 1 : 1.5;
  const dayNumFs = isComfortable ? 21 : isDense ? 14 : 18;
  const dayLetterFs = isComfortable ? 11 : isDense ? 9 : undefined;
  const dot = isComfortable ? 6 : isDense ? 4 : 5;
  const rowGap = isComfortable ? 1.25 : isDense ? 0.5 : 1;

  return (
    <Box
      sx={{
        borderRadius: embedded ? 2 : 3,
        bgcolor: embedded ? "transparent" : dk.canvas,
        border: embedded ? "none" : `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: embedded ? "none" : `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: isComfortable
          ? { xs: 2, sm: 2.75 }
          : isDense
            ? { xs: 1, sm: 1.25 }
            : { xs: 2, sm: 2.5 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: isComfortable ? 1.75 : isDense ? 1 : 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: "primary.main",
              fontSize: isComfortable ? { xs: 17, sm: 20 } : isDense ? 13 : 18,
            }}
          >
            {heading}
          </Typography>
          {captionText != null && captionText !== "" ? (
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 600, fontSize: isComfortable ? 13 : undefined }}
            >
              {captionText}
            </Typography>
          ) : null}
        </Box>
        <Stack direction="row" spacing={0.25} flexShrink={0}>
          <IconButton size="small" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Semaine précédente">
            <ChevronLeft fontSize={isComfortable ? "medium" : isDense ? "small" : "medium"} />
          </IconButton>
          <IconButton size="small" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Semaine suivante">
            <ChevronRight fontSize={isComfortable ? "medium" : isDense ? "small" : "medium"} />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ display: "flex", gap: rowGap, overflowX: "auto", pb: 0.75, mx: isDense ? -0.25 : 0 }}>
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
                width: dayWidth,
                py: dayPy,
                borderRadius: isDense ? 1.5 : isComfortable ? 2.5 : 2,
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
              <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.8, fontSize: dayLetterFs }}>
                {dayName}
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: dayNumFs, lineHeight: 1 }}>
                {d.getDate()}
              </Typography>
              {slots > 0 ? (
                <Stack direction="row" spacing={0.25} justifyContent="center" sx={{ mt: isDense ? 0.25 : isComfortable ? 0.6 : 0.5 }}>
                  {Array.from({ length: Math.min(3, slots) }).map((_, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: dot,
                        height: dot,
                        borderRadius: "50%",
                        bgcolor: isSelected ? dk.white : dk.tertiary,
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="caption" sx={{ fontSize: isDense ? 8 : isComfortable ? 10 : 9, opacity: 0.5 }}>
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
            mt: isComfortable ? 1.75 : isDense ? 1 : 2,
            p: isComfortable ? 1.75 : isDense ? 1 : 1.5,
            borderRadius: 2,
            bgcolor: alpha(dk.tertiaryLight, 0.5),
            color: "primary.main",
            fontWeight: 700,
            fontSize: isComfortable ? 14 : isDense ? 11 : 13,
          }}
        >
          ✓ Créneau sélectionné — on te confirmera par e-mail (démo).
        </Box>
      ) : null}
    </Box>
  );
}
