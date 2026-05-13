"use client";

import { CalendarMonth, ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Popper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useRef, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const WEEK = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function fmt(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = (first.getDay() + 6) % 7;
  const cells: (Date | null)[] = Array.from({ length: startDay }, () => null);
  for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function WireframeDateRangePicker() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<Date | null>(new Date(2026, 4, 12));
  const [end, setEnd] = useState<Date | null>(new Date(2026, 4, 19));
  const [cursorMonth, setCursorMonth] = useState({ y: 2026, m: 4 });
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const cells = useMemo(() => buildGrid(cursorMonth.y, cursorMonth.m), [cursorMonth]);

  const pick = useCallback(
    (d: Date) => {
      if (!start || (start && end)) {
        setStart(d);
        setEnd(null);
        return;
      }
      if (d < start) {
        setStart(d);
        setEnd(start);
        return;
      }
      setEnd(d);
    },
    [start, end],
  );

  const isInRange = useCallback(
    (d: Date) => Boolean(start && end && d >= start && d <= end),
    [start, end],
  );

  const isEdge = useCallback(
    (d: Date) =>
      Boolean(
        (start && d.toDateString() === start.toDateString()) ||
          (end && d.toDateString() === end.toDateString()),
      ),
    [start, end],
  );

  const move = useCallback((dir: number) => {
    setCursorMonth(({ y, m }) => {
      const nm = m + dir;
      if (nm < 0) return { y: y - 1, m: 11 };
      if (nm > 11) return { y: y + 1, m: 0 };
      return { y, m: nm };
    });
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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
        Période d'engagement
      </Typography>

      <Box
        ref={anchorRef}
        onClick={() => setOpen((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.25,
          borderRadius: 2,
          border: `1px solid ${open ? dk.tertiary : alpha(dk.border, 0.25)}`,
          bgcolor: open ? alpha(dk.tertiaryLight, 0.2) : dk.white,
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        <CalendarMonth sx={{ color: "primary.main" }} />
        <Typography sx={{ flex: 1, fontWeight: 700, color: "primary.main" }}>
          Du {fmt(start)} au {fmt(end)}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
          Modifier
        </Typography>
      </Box>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        sx={{ zIndex: theme.zIndex.modal, mt: 1 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box
            sx={{
              width: 320,
              p: 2,
              borderRadius: 2.5,
              bgcolor: dk.white,
              border: `1px solid ${alpha(dk.border, 0.18)}`,
              boxShadow: `0 12px 32px ${alpha(dk.surfaceStrong, 0.16)}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <IconButton size="small" onClick={() => move(-1)}>
                <ChevronLeft fontSize="small" />
              </IconButton>
              <Typography sx={{ flex: 1, textAlign: "center", fontWeight: 800, color: "primary.main" }}>
                {MONTHS[cursorMonth.m]} {cursorMonth.y}
              </Typography>
              <IconButton size="small" onClick={() => move(1)}>
                <ChevronRight fontSize="small" />
              </IconButton>
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.25 }}>
              {WEEK.map((d, i) => (
                <Typography
                  key={`${d}-${i}`}
                  variant="caption"
                  sx={{ textAlign: "center", fontWeight: 800, color: "text.secondary", fontSize: 10 }}
                >
                  {d}
                </Typography>
              ))}
              {cells.map((c, i) => {
                if (!c) return <Box key={`e-${i}`} sx={{ height: 32 }} />;
                const inRange = isInRange(c);
                const edge = isEdge(c);
                return (
                  <Box
                    key={c.toISOString()}
                    onClick={() => pick(c)}
                    sx={{
                      height: 32,
                      borderRadius: edge ? "50%" : 0,
                      bgcolor: edge ? dk.surfaceStrong : inRange ? alpha(dk.tertiaryLight, 0.6) : "transparent",
                      color: edge ? dk.white : "primary.main",
                      fontWeight: edge ? 800 : 600,
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background 0.15s ease",
                      "&:hover": { bgcolor: edge ? dk.surfaceStrong : alpha(dk.surfaceAccent, 0.6) },
                    }}
                  >
                    {c.getDate()}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
