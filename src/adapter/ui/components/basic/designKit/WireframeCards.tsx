"use client";

import { Box, Collapse, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type WireframeCardsProps = {
  heroLabel: string;
  tiles: readonly [string, string, string];
};

export default function WireframeCards({ heroLabel, tiles }: WireframeCardsProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);

  const toggleHero = useCallback(() => {
    setHeroExpanded((v) => !v);
  }, []);

  const selectTile = useCallback((index: number) => {
    setSelectedTile((prev) => (prev === index ? null : index));
  }, []);

  const baseCard = useMemo(
    () => ({
      bgcolor: dk.surface,
      borderRadius: 3,
      display: "flex" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      color: dk.text,
      fontWeight: 600,
      boxShadow: `0 2px 12px ${alpha(dk.surfaceStrong, 0.08)}`,
      border: `1px solid ${alpha(dk.border, 0.35)}`,
    }),
    [dk],
  );

  const tileTint = useCallback(
    (index: number) => {
      const tints = [
        dk.surface,
        alpha(dk.primaryLight, 0.65),
        alpha(dk.tertiaryLight, 0.85),
      ];
      return tints[index % tints.length];
    },
    [dk],
  );

  return (
    <Stack spacing={2}>
      <Box
        role="button"
        tabIndex={0}
        onClick={toggleHero}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleHero();
          }
        }}
        sx={{
          ...baseCard,
          minHeight: 120,
          px: 3,
          flexDirection: "column",
          cursor: "pointer",
          outline: "none",
          background: `linear-gradient(135deg, ${dk.white} 0%, ${dk.primaryLight} 100%)`,
          border: heroExpanded
            ? `2px solid ${dk.surfaceStrong}`
            : `1px solid ${alpha(dk.border, 0.35)}`,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          "&:focus-visible": {
            boxShadow: `0 0 0 3px ${alpha(dk.surfaceAccent, 0.55)}`,
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 800, color: "primary.main", fontFamily: theme.typography.fontFamily }}
        >
          {heroLabel}
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, color: "text.secondary", fontWeight: 600 }}>
          {heroExpanded ? "Clique pour replier" : "Clique pour voir le détail fictif"}
        </Typography>
        <Collapse in={heroExpanded} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: "center",
              color: "text.primary",
              maxWidth: 420,
              mx: "auto",
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Démo : ce panneau simule une carte expandable. Les données seraient chargées ici
            (graphiques, KPI, etc.).
          </Typography>
        </Collapse>
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {tiles.map((label, index) => {
          const selected = selectedTile === index;
          return (
            <Box
              key={label}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              onClick={() => selectTile(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectTile(index);
                }
              }}
              sx={{
                ...baseCard,
                flex: 1,
                minHeight: 160,
                px: 2,
                textAlign: "center",
                cursor: "pointer",
                outline: "none",
                bgcolor: tileTint(index),
                border: selected ? `2px solid ${dk.tertiary}` : `1px solid ${alpha(dk.border, 0.35)}`,
                boxShadow: selected
                  ? `0 4px 20px ${alpha(dk.tertiary, 0.35)}`
                  : `0 2px 12px ${alpha(dk.surfaceStrong, 0.08)}`,
                transition: "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                transform: selected ? "translateY(-2px)" : "none",
                "&:focus-visible": {
                  boxShadow: `0 0 0 3px ${alpha(dk.surfaceAccent, 0.65)}`,
                },
              }}
            >
              <Stack spacing={0.5}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, color: "primary.main", fontFamily: theme.typography.fontFamily }}
                >
                  {label}
                </Typography>
                {selected ? (
                  <Typography variant="caption" sx={{ color: "tertiary.main", fontWeight: 700 }}>
                    Sélectionné (démo)
                  </Typography>
                ) : null}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
