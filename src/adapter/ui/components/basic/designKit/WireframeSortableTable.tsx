"use client";

import { ArrowDownward, ArrowUpward, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Row = {
  id: string;
  name: string;
  org: string;
  hours: number;
  status: "open" | "done" | "wait";
};

const STATUS_LABELS: Record<Row["status"], string> = {
  open: "En cours",
  done: "Validée",
  wait: "À valider",
};

const ROWS: Row[] = [
  { id: "1", name: "Maraude", org: "Petits Frères", hours: 12, status: "done" },
  { id: "2", name: "Atelier FLE", org: "Singa", hours: 8, status: "open" },
  { id: "3", name: "Festival", org: "Coop Culture", hours: 24, status: "wait" },
  { id: "4", name: "Rangement", org: "Croix-Rouge", hours: 4, status: "done" },
  { id: "5", name: "Café accueil", org: "Singa", hours: 3, status: "open" },
  { id: "6", name: "Mission longue", org: "MSF", hours: 32, status: "wait" },
  { id: "7", name: "Sport adapté", org: "Sport pour Tous", hours: 6, status: "done" },
  { id: "8", name: "Distribution", org: "Restos", hours: 5, status: "open" },
];

const COLS: { id: keyof Row; label: string; numeric?: boolean }[] = [
  { id: "name", label: "Mission" },
  { id: "org", label: "Organisation" },
  { id: "hours", label: "Heures", numeric: true },
  { id: "status", label: "Statut" },
];

const PAGE_SIZE = 4;

export default function WireframeSortableTable() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [sortBy, setSortBy] = useState<keyof Row>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const arr = [...ROWS];
    arr.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [sortBy, sortDir]);

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const visible = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const headClick = useCallback((id: keyof Row) => {
    setSortBy((prev) => {
      if (prev === id) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortDir("asc");
      }
      return id;
    });
  }, []);

  const statusColor: Record<Row["status"], { bg: string; fg: string }> = {
    open: { bg: alpha(dk.primaryLight, 0.6), fg: dk.surfaceStrong },
    done: { bg: alpha(dk.mint, 0.6), fg: dk.surfaceStrong },
    wait: { bg: alpha(dk.tertiaryLight, 0.6), fg: dk.tertiary },
  };

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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 1.5 }}>
        Mes missions — table triable
      </Typography>

      <Box sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${alpha(dk.border, 0.15)}` }}>
        <Stack
          direction="row"
          sx={{
            bgcolor: alpha(dk.surfaceMuted, 0.4),
            borderBottom: `1px solid ${alpha(dk.border, 0.15)}`,
          }}
        >
          {COLS.map((c) => {
            const active = sortBy === c.id;
            return (
              <Stack
                key={c.id}
                direction="row"
                alignItems="center"
                spacing={0.5}
                onClick={() => headClick(c.id)}
                sx={{
                  flex: 1,
                  px: 1.5,
                  py: 1,
                  cursor: "pointer",
                  justifyContent: c.numeric ? "flex-end" : "flex-start",
                  "&:hover": { bgcolor: alpha(dk.surfaceAccent, 0.5) },
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, color: active ? "primary.main" : "text.secondary", letterSpacing: "0.04em" }}>
                  {c.label.toUpperCase()}
                </Typography>
                {active ? (
                  sortDir === "asc" ? (
                    <ArrowUpward sx={{ fontSize: 12, color: "tertiary.main" }} />
                  ) : (
                    <ArrowDownward sx={{ fontSize: 12, color: "tertiary.main" }} />
                  )
                ) : null}
              </Stack>
            );
          })}
        </Stack>

        {visible.map((row, i) => (
          <Stack
            key={row.id}
            direction="row"
            sx={{
              bgcolor: i % 2 === 0 ? "transparent" : alpha(dk.surfaceMuted, 0.18),
              "&:hover": { bgcolor: alpha(dk.tertiaryLight, 0.2) },
              transition: "background 0.15s ease",
            }}
          >
            <Box sx={{ flex: 1, px: 1.5, py: 1.25 }}>
              <Typography sx={{ fontWeight: 700, color: "primary.main", fontSize: 13 }}>{row.name}</Typography>
            </Box>
            <Box sx={{ flex: 1, px: 1.5, py: 1.25 }}>
              <Typography sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13 }}>{row.org}</Typography>
            </Box>
            <Box sx={{ flex: 1, px: 1.5, py: 1.25, textAlign: "right" }}>
              <Typography sx={{ fontWeight: 800, color: "primary.main", fontSize: 13 }}>{row.hours} h</Typography>
            </Box>
            <Box sx={{ flex: 1, px: 1.5, py: 1.25 }}>
              <Chip
                size="small"
                label={STATUS_LABELS[row.status]}
                sx={{
                  bgcolor: statusColor[row.status].bg,
                  color: statusColor[row.status].fg,
                  fontWeight: 800,
                }}
              />
            </Box>
          </Stack>
        ))}
      </Box>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5, justifyContent: "flex-end" }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
          Page {page + 1} / {pageCount}
        </Typography>
        <IconButton size="small" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          <ChevronLeft fontSize="small" />
        </IconButton>
        <IconButton size="small" disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)}>
          <ChevronRight fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
