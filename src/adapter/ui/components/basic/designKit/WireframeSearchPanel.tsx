"use client";

import {
  Bookmark,
  BookmarkBorder,
  Close,
  Place,
  Search,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  InputBase,
  Snackbar,
  Stack,
  Typography,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { designKitPalette } from "./designKitPalette";

type Activity = {
  id: string;
  title: string;
  org: string;
  city: string;
  category: "Solidarité" | "Culture" | "Sport" | "Environnement";
};

const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    title: "Maraude hebdomadaire",
    org: "Les Petits Frères",
    city: "Paris 19e",
    category: "Solidarité",
  },
  {
    id: "a2",
    title: "Cours de soutien collège",
    org: "Asso Étincelle",
    city: "Lyon 7e",
    category: "Culture",
  },
  {
    id: "a3",
    title: "Ramassage berges",
    org: "Surfrider FR",
    city: "Bordeaux",
    category: "Environnement",
  },
  {
    id: "a4",
    title: "Encadrement tournoi mini-foot",
    org: "Sport pour Tous",
    city: "Marseille",
    category: "Sport",
  },
  {
    id: "a5",
    title: "Atelier conversation FLE",
    org: "Singa France",
    city: "Lille",
    category: "Solidarité",
  },
  {
    id: "a6",
    title: "Régie d'un festival local",
    org: "Coop Culture",
    city: "Toulouse",
    category: "Culture",
  },
];

const CATEGORY_TINTS: Record<Activity["category"], "primaryLight" | "tertiaryLight" | "mint" | "surfaceMuted"> = {
  Solidarité: "tertiaryLight",
  Culture: "primaryLight",
  Sport: "mint",
  Environnement: "surfaceMuted",
};

type WireframeSearchPanelProps = {
  /** Rendu entre la barre de recherche et les résultats (ex. filtres + carte). */
  belowSearch?: ReactNode;
  /** Bloc inséré entre `belowSearch` et la liste (ex. section « Pour toi »). */
  betweenSearchAndResults?: ReactNode;
  /** Ancre de scroll pour la liste (`#id`). */
  resultsSectionId?: string;
  /** Titre ou intro au-dessus de la liste (ex. « Toutes les activités »). */
  resultsHeader?: ReactNode;
  /** Styles du conteneur de la liste / message vide. */
  resultsSectionSx?: SxProps<Theme>;
};

export default function WireframeSearchPanel({
  belowSearch,
  betweenSearchAndResults,
  resultsSectionId,
  resultsHeader,
  resultsSectionSx,
}: WireframeSearchPanelProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [query, setQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(["a3"]));
  const [snack, setSnack] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return ACTIVITIES;
    return ACTIVITIES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.org.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    );
  }, [query]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 9999,
          bgcolor: dk.canvas,
          border: `1px solid ${alpha(dk.border, 0.25)}`,
          boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
          mb: 2,
        }}
      >
        <Search sx={{ color: "primary.main" }} />
        <InputBase
          fullWidth
          placeholder="Cherche une mission, une asso, une ville…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            fontFamily: theme.typography.fontFamily,
            fontWeight: 500,
            "& input::placeholder": {
              color: alpha(dk.textMuted, 0.7),
              opacity: 1,
            },
          }}
        />
        {query.length > 0 ? (
          <IconButton size="small" onClick={() => setQuery("")} aria-label="Effacer">
            <Close fontSize="small" />
          </IconButton>
        ) : null}
      </Box>

      {belowSearch ? <Box sx={{ mb: 2 }}>{belowSearch}</Box> : null}

      {betweenSearchAndResults ? <Box sx={{ mb: 2 }}>{betweenSearchAndResults}</Box> : null}

      <Box
        id={resultsSectionId}
        sx={
          [
            resultsSectionId ? { scrollMarginTop: 88 } : {},
            ...(resultsSectionSx ? [resultsSectionSx] : []),
          ] as SxProps<Theme>
        }
      >
        {resultsHeader ? <Box sx={{ mb: 1.5 }}>{resultsHeader}</Box> : null}

        {results.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: alpha(dk.surfaceAccent, 0.4),
              border: `1px dashed ${alpha(dk.border, 0.4)}`,
            }}
          >
            <Typography sx={{ fontWeight: 700, color: "primary.main" }}>
              Aucune mission trouvée pour « {query} »
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Essaie un autre mot-clé ou élargis ta zone.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.25}>
            {results.map((a) => {
            const tint = dk[CATEGORY_TINTS[a.category]];
            const isBookmarked = bookmarks.has(a.id);
            return (
              <Box
                key={a.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" && e.key !== " ") return;
                  e.preventDefault();
                  setSnack(`Aperçu « ${a.title} » · ${a.city} (démo)`);
                }}
                onClick={() => setSnack(`Aperçu « ${a.title} » · ${a.city} (démo)`)}
                sx={{
                  display: "flex",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  alignItems: "center",
                  gap: 2,
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: dk.canvas,
                  border: `1px solid ${alpha(dk.border, 0.15)}`,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    transform: "translateX(2px)",
                    borderColor: alpha(dk.surfaceStrong, 0.3),
                    boxShadow: `0 4px 14px ${alpha(dk.surfaceStrong, 0.08)}`,
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${dk.tertiary}`,
                    outlineOffset: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: tint,
                    color: dk.surfaceStrong,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Place />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, color: "primary.main" }} noWrap>
                    {a.title}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                      {a.org} · {a.city}
                    </Typography>
                    <Chip
                      label={a.category}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: alpha(tint, 0.7),
                        color: dk.surfaceStrong,
                      }}
                    />
                  </Stack>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    const removing = bookmarks.has(a.id);
                    toggleBookmark(a.id);
                    setSnack(
                      removing
                        ? `"${a.title}" retirée des favoris (démo)`
                        : `"${a.title}" en favori ⭐ (démo)`,
                    );
                  }}
                  aria-label="Sauvegarder"
                  sx={{
                    color: isBookmarked ? dk.tertiary : alpha(dk.textMuted, 0.6),
                    "&:hover": { color: dk.tertiary },
                  }}
                >
                  {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Box>
            );
          })}
        </Stack>
        )}
      </Box>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2600}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
