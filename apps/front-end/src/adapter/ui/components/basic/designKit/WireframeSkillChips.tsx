"use client";

import { Star, StarBorder } from "@mui/icons-material";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Skill = {
  id: string;
  label: string;
  category: "soft" | "hard";
};

const SKILLS: Skill[] = [
  { id: "ecoute", label: "Écoute active", category: "soft" },
  { id: "anim", label: "Animation de groupe", category: "soft" },
  { id: "orga", label: "Organisation d'événement", category: "hard" },
  { id: "comm", label: "Communication digitale", category: "hard" },
  { id: "lead", label: "Leadership bienveillant", category: "soft" },
  { id: "logi", label: "Logistique terrain", category: "hard" },
  { id: "media", label: "Médiation", category: "soft" },
  { id: "tech", label: "Outils numériques", category: "hard" },
  { id: "lang", label: "Langues étrangères", category: "hard" },
];

const MAX_SELECTED = 8;
const MAX_FAVORITES = 3;

export default function WireframeSkillChips() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [filter, setFilter] = useState<"all" | "soft" | "hard">("all");
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["ecoute", "orga", "anim"]),
  );
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["ecoute"]));

  const visibleSkills = useMemo(
    () => (filter === "all" ? SKILLS : SKILLS.filter((s) => s.category === filter)),
    [filter],
  );

  const toggleSelect = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          setFavorites((favs) => {
            if (!favs.has(id)) return favs;
            const nf = new Set(favs);
            nf.delete(id);
            return nf;
          });
        } else if (next.size < MAX_SELECTED) {
          next.add(id);
        }
        return next;
      });
    },
    [],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      if (!selected.has(id)) return;
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else if (next.size < MAX_FAVORITES) {
          next.add(id);
        }
        return next;
      });
    },
    [selected],
  );

  const filters: { id: typeof filter; label: string }[] = [
    { id: "all", label: "Tout" },
    { id: "soft", label: "Savoir-être" },
    { id: "hard", label: "Savoir-faire" },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5, flexWrap: "wrap", gap: 1 }}
      >
        <Stack direction="row" spacing={1}>
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <Chip
                key={f.id}
                label={f.label}
                onClick={() => setFilter(f.id)}
                sx={{
                  fontWeight: 700,
                  bgcolor: active ? dk.surfaceStrong : alpha(dk.border, 0.08),
                  color: active ? dk.white : dk.textMuted,
                  "&:hover": {
                    bgcolor: active ? dk.surfaceStrong : alpha(dk.surfaceAccent, 0.5),
                  },
                }}
              />
            );
          })}
        </Stack>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
          {selected.size}/{MAX_SELECTED} sélectionnées · {favorites.size}/{MAX_FAVORITES} favorites
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {visibleSkills.map((s) => {
          const isSelected = selected.has(s.id);
          const isFav = favorites.has(s.id);
          return (
            <Chip
              key={s.id}
              label={s.label}
              clickable
              onClick={() => toggleSelect(s.id)}
              icon={
                isSelected ? (
                  <Box
                    component="span"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(s.id);
                    }}
                    sx={{
                      display: "inline-flex",
                      cursor: "pointer",
                      ml: 0.5,
                      color: isFav ? dk.tertiary : dk.textMuted,
                      "&:hover": { color: dk.tertiary },
                    }}
                  >
                    {isFav ? <Star fontSize="small" /> : <StarBorder fontSize="small" />}
                  </Box>
                ) : undefined
              }
              sx={{
                px: 1,
                py: 2.25,
                borderRadius: 9999,
                fontWeight: 700,
                bgcolor: isSelected ? dk.surfaceAccent : dk.white,
                color: isSelected ? dk.surfaceStrong : dk.text,
                border: `1px solid ${
                  isSelected ? alpha(dk.surfaceStrong, 0.35) : alpha(dk.border, 0.3)
                }`,
                boxShadow: isFav
                  ? `0 4px 14px ${alpha(dk.tertiary, 0.35)}`
                  : "none",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: isSelected ? dk.surfaceAccent : alpha(dk.surfaceAccent, 0.35),
                  transform: "translateY(-1px)",
                },
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
