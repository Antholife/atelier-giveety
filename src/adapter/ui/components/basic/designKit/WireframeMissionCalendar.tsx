"use client";

import { Add, ChevronLeft, ChevronRight, FiberManualRecord } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Fragment, useCallback, useMemo, useState } from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";

type Category = "distribution" | "animation" | "maraude" | "formation";

type Mission = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: Category;
};

type WeekEvent = {
  mission: Mission;
  colStart: number;
  colEnd: number;
  continuesLeft: boolean;
  continuesRight: boolean;
};

type PlacedEvent = WeekEvent & { lane: number };

const DAY_HEADERS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];
const MONTH_NAMES = [
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
];

const CELL_HEIGHT = 96;
const LANE_HEIGHT = 22;
const LANE_GAP = 4;
const DAY_NUMBER_AREA = 30;
const MAX_VISIBLE_LANES = 3;

const TODAY_REFERENCE = new Date(2026, 4, 7); // jeu 7 mai 2026

const MISSIONS: Mission[] = [
  { id: "m0", title: "Préparation festival", start: new Date(2026, 3, 4), end: new Date(2026, 3, 8), category: "distribution" },
  { id: "m0b", title: "Réunion équipe", start: new Date(2026, 3, 18), end: new Date(2026, 3, 18), category: "animation" },
  { id: "m1", title: "Distribution Centre-Ville", start: new Date(2026, 3, 28), end: new Date(2026, 4, 1), category: "distribution" },
  { id: "m2", title: "Atelier d'écriture", start: new Date(2026, 4, 7), end: new Date(2026, 4, 7), category: "animation" },
  { id: "m3", title: "Maraude AEP", start: new Date(2026, 4, 9), end: new Date(2026, 4, 12), category: "maraude" },
  { id: "m4", title: "Anim. enfants", start: new Date(2026, 4, 13), end: new Date(2026, 4, 15), category: "animation" },
  { id: "m5", title: "Forum solidaire", start: new Date(2026, 4, 16), end: new Date(2026, 4, 16), category: "distribution" },
  { id: "m6", title: "Maraude de soir", start: new Date(2026, 4, 21), end: new Date(2026, 4, 22), category: "maraude" },
  { id: "m7", title: "Coordination équipe", start: new Date(2026, 4, 19), end: new Date(2026, 4, 19), category: "animation" },
  { id: "m8", title: "Distribution alim.", start: new Date(2026, 4, 26), end: new Date(2026, 4, 28), category: "distribution" },
  { id: "m9", title: "Formation premiers secours", start: new Date(2026, 4, 30), end: new Date(2026, 5, 1), category: "formation" },
  { id: "m10", title: "Camp d'été", start: new Date(2026, 5, 8), end: new Date(2026, 5, 12), category: "formation" },
];

const VIEW_MODES = ["Mois", "Semaine", "Journée"] as const;
type ViewMode = (typeof VIEW_MODES)[number];

function categoryStyles(dk: DesignKitPalette): Record<
  Category,
  { bg: string; fg: string; label: string }
> {
  return {
    distribution: { bg: dk.surfaceStrong, fg: dk.white, label: "Distribution alim." },
    animation: { bg: dk.surfaceAccent, fg: dk.text, label: "Animation" },
    maraude: { bg: dk.tertiary, fg: dk.white, label: "Maraude" },
    formation: { bg: dk.mint, fg: dk.text, label: "Formation" },
  };
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isoWeekday(d: Date) {
  // Monday = 0, Sunday = 6
  return (d.getDay() + 6) % 7;
}

function buildMonthGrid(anchor: Date): Date[][] {
  const first = startOfMonth(anchor);
  const offset = isoWeekday(first);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - offset);
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + w * 7 + d);
      week.push(day);
    }
    weeks.push(week);
  }
  return weeks;
}

function eventsForWeek(missions: Mission[], week: Date[]): WeekEvent[] {
  const weekStart = new Date(week[0]);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(week[6]);
  weekEnd.setHours(23, 59, 59, 999);
  return missions
    .filter((m) => m.end >= weekStart && m.start <= weekEnd)
    .map((m): WeekEvent => {
      const startInWeek = m.start < weekStart ? weekStart : m.start;
      const endInWeek = m.end > weekEnd ? weekEnd : m.end;
      return {
        mission: m,
        colStart: isoWeekday(startInWeek),
        colEnd: isoWeekday(endInWeek),
        continuesLeft: m.start < weekStart,
        continuesRight: m.end > weekEnd,
      };
    })
    .sort((a, b) => {
      const lenA = a.colEnd - a.colStart;
      const lenB = b.colEnd - b.colStart;
      if (lenB !== lenA) return lenB - lenA;
      return a.colStart - b.colStart;
    });
}

function assignLanes(events: WeekEvent[]): PlacedEvent[] {
  const lanes: Array<Array<[number, number]>> = [];
  return events.map((evt) => {
    for (let lane = 0; ; lane++) {
      if (!lanes[lane]) lanes[lane] = [];
      const overlaps = lanes[lane].some(
        ([cs, ce]) => !(evt.colEnd < cs || evt.colStart > ce),
      );
      if (!overlaps) {
        lanes[lane].push([evt.colStart, evt.colEnd]);
        return { ...evt, lane };
      }
    }
  });
}

function formatDayLong(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatRange(m: Mission) {
  const sameDay = isSameDay(m.start, m.end);
  if (sameDay) {
    return m.start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return `${fmt(m.start)} → ${fmt(m.end)}`;
}

type WireframeMissionCalendarProps = {
  /** Titre du bloc (défaut : engagements contributeur). */
  pageTitle?: string;
};

export default function WireframeMissionCalendar({ pageTitle }: WireframeMissionCalendarProps = {}) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const styles = useMemo(() => categoryStyles(dk), [dk]);

  const [viewed, setViewed] = useState(() => startOfMonth(TODAY_REFERENCE));
  const [viewMode, setViewMode] = useState<ViewMode>("Mois");
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(["distribution", "animation", "maraude", "formation"]),
  );
  const [selectedDay, setSelectedDay] = useState<Date | null>(TODAY_REFERENCE);

  const filteredMissions = useMemo(
    () => MISSIONS.filter((m) => activeCategories.has(m.category)),
    [activeCategories],
  );

  const weeks = useMemo(() => buildMonthGrid(viewed), [viewed]);
  const placedByWeek = useMemo(
    () =>
      weeks.map((week) => assignLanes(eventsForWeek(filteredMissions, week))),
    [weeks, filteredMissions],
  );

  const monthLabel = `${MONTH_NAMES[viewed.getMonth()]} ${viewed.getFullYear()}`;

  const monthStats = useMemo(() => {
    const inMonth = filteredMissions.filter(
      (m) =>
        m.start.getMonth() === viewed.getMonth() ||
        m.end.getMonth() === viewed.getMonth(),
    );
    const days = inMonth.reduce((sum, m) => {
      const diff =
        Math.floor((m.end.getTime() - m.start.getTime()) / 86400000) + 1;
      return sum + diff;
    }, 0);
    return { count: inMonth.length, days };
  }, [filteredMissions, viewed]);

  const toggleCategory = useCallback((cat: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else next.add(cat);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => setViewed((v) => addMonths(v, -1)), []);
  const goNext = useCallback(() => setViewed((v) => addMonths(v, 1)), []);
  const goToday = useCallback(() => {
    setViewed(startOfMonth(TODAY_REFERENCE));
    setSelectedDay(TODAY_REFERENCE);
  }, []);

  const selectedDayMissions = useMemo(() => {
    if (!selectedDay) return [];
    return filteredMissions.filter(
      (m) =>
        selectedDay >= new Date(m.start.getFullYear(), m.start.getMonth(), m.start.getDate()) &&
        selectedDay <= new Date(m.end.getFullYear(), m.end.getMonth(), m.end.getDate()),
    );
  }, [filteredMissions, selectedDay]);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      distribution: 0,
      animation: 0,
      maraude: 0,
      formation: 0,
    };
    MISSIONS.forEach((m) => {
      counts[m.category] += 1;
    });
    return counts;
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 1.5, sm: 2.5 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* --- Header: title + stats + view modes ----------------------------- */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main", fontSize: 18 }}>
            {pageTitle ?? "Mes engagements"}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            {monthStats.count} mission{monthStats.count > 1 ? "s" : ""} ·{" "}
            {monthStats.days} jour{monthStats.days > 1 ? "s" : ""} engagé
            {monthStats.days > 1 ? "s" : ""} en {MONTH_NAMES[viewed.getMonth()].toLowerCase()}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              display: "inline-flex",
              p: 0.25,
              borderRadius: 2,
              bgcolor: alpha(dk.surfaceMuted, 0.35),
            }}
          >
            {VIEW_MODES.map((mode) => {
              const active = mode === viewMode;
              return (
                <Box
                  key={mode}
                  role="button"
                  tabIndex={0}
                  onClick={() => setViewMode(mode)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setViewMode(mode);
                    }
                  }}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1.5,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    color: active ? dk.surfaceStrong : "text.secondary",
                    bgcolor: active ? dk.canvas : "transparent",
                    boxShadow: active
                      ? `0 1px 3px ${alpha(dk.surfaceStrong, 0.12)}`
                      : "none",
                    transition: "all 0.15s ease",
                    userSelect: "none",
                  }}
                >
                  {mode}
                </Box>
              );
            })}
          </Box>
          <Button
            size="small"
            startIcon={<Add sx={{ fontSize: "16px !important" }} />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: 12,
              bgcolor: dk.surfaceStrong,
              color: dk.white,
              px: 1.5,
              "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.85) },
            }}
          >
            Disponibilité
          </Button>
        </Stack>
      </Stack>

      {/* --- Category filters (also serve as legend) ------------------------ */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {(Object.keys(styles) as Category[]).map((cat) => {
          const active = activeCategories.has(cat);
          const style = styles[cat];
          return (
            <Box
              key={cat}
              role="button"
              tabIndex={0}
              onClick={() => toggleCategory(cat)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleCategory(cat);
                }
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                bgcolor: active ? alpha(style.bg, 0.12) : "transparent",
                color: active ? dk.text : alpha(dk.text, 0.5),
                border: `1px solid ${active ? alpha(style.bg, 0.35) : alpha(dk.border, 0.2)}`,
                transition: "all 0.15s ease",
                userSelect: "none",
                "&:hover": {
                  bgcolor: active ? alpha(style.bg, 0.18) : alpha(dk.surfaceMuted, 0.25),
                },
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: style.bg,
                  opacity: active ? 1 : 0.4,
                }}
              />
              {style.label}
              <Box
                component="span"
                sx={{
                  ml: 0.25,
                  px: 0.6,
                  py: 0.05,
                  borderRadius: 999,
                  bgcolor: alpha(dk.text, 0.06),
                  color: alpha(dk.text, 0.6),
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {categoryCounts[cat]}
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* --- Toolbar: month nav -------------------------------------------- */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 0.5,
          borderBottom: `1px solid ${alpha(dk.border, 0.12)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton size="small" onClick={goPrev} aria-label="Mois précédent">
            <ChevronLeft fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={goNext} aria-label="Mois suivant">
            <ChevronRight fontSize="small" />
          </IconButton>
          <Button
            size="small"
            onClick={goToday}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: 12,
              color: "text.secondary",
              ml: 0.5,
              px: 1.25,
              border: `1px solid ${alpha(dk.border, 0.25)}`,
              borderRadius: 999,
              "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.3) },
            }}
          >
            Aujourd'hui
          </Button>
        </Stack>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: 14, sm: 16 },
            color: "primary.main",
            textTransform: "capitalize",
          }}
        >
          {monthLabel}
        </Typography>
        <Box sx={{ width: 90 }} />
      </Stack>

      {/* --- Day headers --------------------------------------------------- */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          pb: 0.5,
        }}
      >
        {DAY_HEADERS.map((d, i) => (
          <Typography
            key={d}
            variant="caption"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: i >= 5 ? alpha(dk.text, 0.45) : "text.secondary",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* --- Calendar weeks ----------------------------------------------- */}
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${alpha(dk.border, 0.12)}`,
        }}
      >
        {weeks.map((week, wi) => {
          const placed = placedByWeek[wi];
          const hiddenByDay: Record<number, number> = {};
          placed.forEach((p) => {
            if (p.lane >= MAX_VISIBLE_LANES) {
              for (let c = p.colStart; c <= p.colEnd; c++) {
                hiddenByDay[c] = (hiddenByDay[c] ?? 0) + 1;
              }
            }
          });
          return (
            <Box
              key={wi}
              sx={{
                position: "relative",
                height: CELL_HEIGHT,
                borderTop: wi > 0 ? `1px solid ${alpha(dk.border, 0.12)}` : "none",
              }}
            >
              {/* Day cells */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  height: "100%",
                }}
              >
                {week.map((day, di) => {
                  const inMonth = day.getMonth() === viewed.getMonth();
                  const isToday = isSameDay(day, TODAY_REFERENCE);
                  const isWeekend = di >= 5;
                  const isSelected =
                    selectedDay !== null && isSameDay(day, selectedDay);
                  const overflow = hiddenByDay[di] ?? 0;
                  return (
                    <Box
                      key={di}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedDay(day)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedDay(day);
                        }
                      }}
                      sx={{
                        position: "relative",
                        borderRight:
                          di < 6
                            ? `1px solid ${alpha(dk.border, 0.1)}`
                            : "none",
                        bgcolor: isSelected
                          ? alpha(dk.tertiary, 0.08)
                          : isWeekend
                            ? alpha(dk.surfaceMuted, 0.18)
                            : "transparent",
                        cursor: "pointer",
                        transition: "background 0.12s ease",
                        outline: "none",
                        "&:hover": {
                          bgcolor: isSelected
                            ? alpha(dk.tertiary, 0.12)
                            : alpha(dk.surfaceMuted, 0.3),
                        },
                        "&:focus-visible": {
                          boxShadow: `inset 0 0 0 2px ${alpha(dk.tertiary, 0.5)}`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          left: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          bgcolor: isToday ? dk.surfaceStrong : "transparent",
                          color: isToday
                            ? dk.white
                            : inMonth
                              ? dk.text
                              : alpha(dk.text, 0.35),
                          fontWeight: isToday ? 800 : 600,
                          fontSize: 12,
                          lineHeight: 1,
                        }}
                      >
                        {day.getDate()}
                      </Box>
                      {overflow > 0 ? (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 4,
                            left: 6,
                            right: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            color: "text.secondary",
                          }}
                        >
                          +{overflow} autre{overflow > 1 ? "s" : ""}
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}
              </Box>

              {/* Event bars */}
              {placed.map((evt) => {
                if (evt.lane >= MAX_VISIBLE_LANES) return null;
                const widthPct = ((evt.colEnd - evt.colStart + 1) / 7) * 100;
                const leftPct = (evt.colStart / 7) * 100;
                const top =
                  DAY_NUMBER_AREA + evt.lane * (LANE_HEIGHT + LANE_GAP);
                const style = styles[evt.mission.category];
                const radiusLeft = evt.continuesLeft ? 2 : 999;
                const radiusRight = evt.continuesRight ? 2 : 999;
                return (
                  <Box
                    key={`${evt.mission.id}-${wi}`}
                    title={`${evt.mission.title} · ${formatRange(evt.mission)}`}
                    sx={{
                      position: "absolute",
                      top,
                      left: `calc(${leftPct}% + 4px)`,
                      width: `calc(${widthPct}% - 8px)`,
                      height: LANE_HEIGHT,
                      borderRadius: `${radiusLeft}px ${radiusRight}px ${radiusRight}px ${radiusLeft}px`,
                      bgcolor: style.bg,
                      color: style.fg,
                      px: 1,
                      display: "flex",
                      alignItems: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                      boxShadow: `0 1px 2px ${alpha(style.bg, 0.35)}`,
                      transition: "transform 0.12s ease, box-shadow 0.12s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: `0 3px 8px ${alpha(style.bg, 0.4)}`,
                      },
                    }}
                  >
                    {evt.continuesLeft ? (
                      <Box component="span" sx={{ mr: 0.5, opacity: 0.7 }}>
                        ‹
                      </Box>
                    ) : null}
                    <Box
                      component="span"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {evt.mission.title}
                    </Box>
                    {evt.continuesRight ? (
                      <Box component="span" sx={{ ml: 0.5, opacity: 0.7 }}>
                        ›
                      </Box>
                    ) : null}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>

      {/* --- Selected day panel ------------------------------------------- */}
      {selectedDay ? (
        <Box
          sx={{
            mt: 0.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(dk.surfaceMuted, 0.2),
            border: `1px dashed ${alpha(dk.border, 0.25)}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: selectedDayMissions.length > 0 ? 1 : 0 }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                color: "primary.main",
                fontSize: 13,
                textTransform: "capitalize",
              }}
            >
              {formatDayLong(selectedDay)}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 700 }}
            >
              {selectedDayMissions.length === 0
                ? "rien de prévu"
                : `${selectedDayMissions.length} engagement${selectedDayMissions.length > 1 ? "s" : ""}`}
            </Typography>
          </Stack>
          {selectedDayMissions.length > 0 ? (
            <Stack spacing={0.75}>
              {selectedDayMissions.map((m) => {
                const style = styles[m.category];
                return (
                  <Fragment key={m.id}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        bgcolor: dk.canvas,
                        borderRadius: 1.5,
                        px: 1,
                        py: 0.75,
                        border: `1px solid ${alpha(dk.border, 0.12)}`,
                      }}
                    >
                      <FiberManualRecord
                        sx={{ color: style.bg, fontSize: 12 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            color: dk.text,
                            lineHeight: 1.2,
                          }}
                        >
                          {m.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 600,
                            fontSize: 10.5,
                          }}
                        >
                          {style.label} · {formatRange(m)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Fragment>
                );
              })}
            </Stack>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}
