"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { designKitPalette } from "./designKitPalette";

const WEEK_SHORT = ["lu", "ma", "me", "je", "ve", "sa", "di"] as const;
const MONTH_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
] as const;

function isoWeekdayMon0(d: Date) {
  return (d.getDay() + 6) % 7;
}

function buildMonthCells(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1);
  const lead = isoWeekdayMon0(first);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= lastDay; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export type WireframeMissionReadOnlyCalendarProps = {
  year: number;
  /** 0 = janvier */
  monthIndex: number;
  /** Jours du mois à mettre en avant (purement visuel, non interactif) */
  highlightedDays?: readonly number[];
};

/**
 * Grille mensuelle illustrative : aucune interaction, pas de créneaux / places.
 */
export default function WireframeMissionReadOnlyCalendar({
  year,
  monthIndex,
  highlightedDays = [],
}: WireframeMissionReadOnlyCalendarProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const cells = useMemo(() => buildMonthCells(year, monthIndex), [year, monthIndex]);
  const highlights = useMemo(() => new Set(highlightedDays), [highlightedDays]);
  const title = `${MONTH_FR[monthIndex]} ${year}`;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.16)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.05)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", fontSize: { xs: 16, sm: 17 }, mb: 2 }}>
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 0.5,
          textAlign: "center",
        }}
      >
        {WEEK_SHORT.map((d) => (
          <Typography
            key={d}
            variant="caption"
            sx={{ fontWeight: 800, color: "text.secondary", py: 0.5, textTransform: "uppercase", fontSize: 10 }}
          >
            {d}
          </Typography>
        ))}
        {cells.map((day, i) => {
          const key = day === null ? `e-${i}` : `d-${day}`;
          const hi = day !== null && highlights.has(day);
          return (
            <Box
              key={key}
              role="presentation"
              sx={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 1.75,
                minHeight: 36,
                bgcolor: hi ? alpha(dk.tertiaryLight, 0.85) : day === null ? "transparent" : alpha(dk.surfaceMuted, 0.25),
                border: hi ? `2px solid ${alpha(dk.tertiary, 0.55)}` : "2px solid transparent",
              }}
            >
              {day !== null ? (
                <Typography
                  sx={{
                    fontWeight: hi ? 800 : 700,
                    fontSize: { xs: 13, sm: 14 },
                    color: hi ? "primary.main" : "text.secondary",
                  }}
                >
                  {day}
                </Typography>
              ) : null}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
