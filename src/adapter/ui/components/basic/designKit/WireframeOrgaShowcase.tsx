"use client";

import { ChevronLeft, ChevronRight, Pause, PlayArrow } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Orga = {
  id: string;
  name: string;
  tag: string;
  initials: string;
  hue: "primary" | "tertiary" | "mint" | "secondary";
};

const ORGAS: Orga[] = [
  { id: "1", name: "Singa France", tag: "Inclusion", initials: "SF", hue: "primary" },
  { id: "2", name: "Petits Frères", tag: "Solidarité", initials: "PF", hue: "tertiary" },
  { id: "3", name: "Surfrider", tag: "Environnement", initials: "SR", hue: "mint" },
  { id: "4", name: "Coop Culture", tag: "Culture", initials: "CC", hue: "secondary" },
  { id: "5", name: "Sport pour Tous", tag: "Sport", initials: "ST", hue: "tertiary" },
  { id: "6", name: "Croix-Rouge", tag: "Santé", initials: "CR", hue: "primary" },
];

const PER_PAGE = 3;

export default function WireframeOrgaShowcase() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const totalPages = Math.ceil(ORGAS.length / PER_PAGE);
  const visible = useMemo(
    () => ORGAS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE),
    [page],
  );

  useEffect(() => {
    if (!playing || paused) return undefined;
    intervalRef.current = window.setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 2400);
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [playing, paused, totalPages]);

  const next = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);
  const prev = useCallback(
    () => setPage((p) => (p - 1 + totalPages) % totalPages),
    [totalPages],
  );

  const tintFor = (hue: Orga["hue"]) => {
    if (hue === "primary") return dk.primaryLight;
    if (hue === "tertiary") return dk.tertiaryLight;
    if (hue === "mint") return dk.mint;
    return dk.surfaceMuted;
  };

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
          Nos partenaires
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton size="small" onClick={() => setPlaying((v) => !v)} aria-label={playing ? "Pause" : "Lecture"}>
            {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
          </IconButton>
          <IconButton size="small" onClick={prev} aria-label="Précédent">
            <ChevronLeft fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={next} aria-label="Suivant">
            <ChevronRight fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} useFlexGap>
        {visible.map((o) => {
          const tint = tintFor(o.hue);
          return (
            <Box
              key={o.id}
              sx={{
                flex: 1,
                minWidth: 0,
                p: 2,
                borderRadius: 2.5,
                bgcolor: alpha(tint, 0.6),
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                transition: "transform 0.2s ease",
                cursor: "pointer",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: dk.canvas,
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {o.initials}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: "primary.main" }} noWrap>
                  {o.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  {o.tag}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>

      <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mt: 2 }}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <Box
            key={i}
            onClick={() => setPage(i)}
            sx={{
              width: i === page ? 22 : 6,
              height: 6,
              borderRadius: 9999,
              bgcolor: i === page ? dk.surfaceStrong : alpha(dk.border, 0.3),
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
