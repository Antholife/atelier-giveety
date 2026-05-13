"use client";

import {
  AccessTime,
  CalendarMonth,
  Cancel,
  Category,
  FilterAlt,
  Place,
} from "@mui/icons-material";
import { Box, Chip, Menu, MenuItem, Snackbar, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { designKitPalette } from "./designKitPalette";

type FilterKey = "category" | "distance" | "duration" | "date";

const OPTIONS: Record<FilterKey, { icon: ReactNode; label: string; values: string[] }> = {
  category: { icon: <Category />, label: "Catégorie", values: ["Solidarité", "Culture", "Sport", "Environnement"] },
  distance: { icon: <Place />, label: "Distance", values: ["< 5 km", "< 15 km", "< 30 km", "Toute la France"] },
  duration: { icon: <AccessTime />, label: "Durée", values: ["< 2h", "Demi-journée", "Journée", "Plusieurs jours"] },
  date: { icon: <CalendarMonth />, label: "Quand", values: ["Aujourd'hui", "Cette semaine", "Ce mois-ci", "Quand ça arrange"] },
};

type Active = Partial<Record<FilterKey, string>>;

export default function WireframeFilterBar() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [active, setActive] = useState<Active>({ category: "Solidarité", distance: "< 15 km" });
  const [anchor, setAnchor] = useState<{ key: FilterKey; el: HTMLElement } | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const open = useCallback((key: FilterKey, el: HTMLElement) => {
    setAnchor({ key, el });
  }, []);

  const close = useCallback(() => setAnchor(null), []);

  const setValue = useCallback(
    (key: FilterKey, value: string | null) => {
      setActive((prev) => {
        const next = { ...prev };
        if (value === null) delete next[key];
        else next[key] = value;
        return next;
      });
      const label = OPTIONS[key].label;
      setSnack(value === null ? `${label} : critère effacé (démo)` : `${label} · ${value} (démo)`);
      close();
    },
    [close],
  );

  const reset = useCallback(() => {
    setActive({});
    setSnack("Tous les filtres réinitialisés (démo)");
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ pr: 1, color: "primary.main" }}>
          <FilterAlt fontSize="small" />
          <Typography variant="caption" sx={{ fontWeight: 800 }}>
            Filtres
          </Typography>
        </Stack>
        {(Object.keys(OPTIONS) as FilterKey[]).map((key) => {
          const opt = OPTIONS[key];
          const value = active[key];
          const isActive = !!value;
          return (
            <Chip
              key={key}
              icon={opt.icon as React.ReactElement}
              label={value ?? opt.label}
              clickable
              onClick={(e) => open(key, e.currentTarget as HTMLElement)}
              onDelete={isActive ? () => setValue(key, null) : undefined}
              deleteIcon={<Cancel />}
              sx={{
                fontWeight: 700,
                bgcolor: isActive ? dk.surfaceStrong : alpha(dk.border, 0.08),
                color: isActive ? dk.white : dk.text,
                "& .MuiChip-icon": { color: isActive ? dk.white : dk.surfaceStrong },
                "& .MuiChip-deleteIcon": { color: alpha(dk.white, 0.8), "&:hover": { color: dk.white } },
                "&:hover": { bgcolor: isActive ? dk.surfaceStrong : alpha(dk.surfaceAccent, 0.5) },
              }}
            />
          );
        })}
        {Object.keys(active).length > 0 ? (
          <Chip
            label="Tout réinitialiser"
            onClick={reset}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700, color: "tertiary.main", borderColor: "tertiary.main" }}
          />
        ) : null}
      </Stack>

      <Menu
        anchorEl={anchor?.el ?? null}
        open={Boolean(anchor)}
        onClose={close}
        slotProps={{ paper: { sx: { mt: 1, borderRadius: 2 } } }}
      >
        {anchor
          ? OPTIONS[anchor.key].values.map((v) => (
              <MenuItem
                key={v}
                selected={active[anchor.key] === v}
                onClick={() => setValue(anchor.key, v)}
              >
                {v}
              </MenuItem>
            ))
          : null}
      </Menu>
      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2400}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
