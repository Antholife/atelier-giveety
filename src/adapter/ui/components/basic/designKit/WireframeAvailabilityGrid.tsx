"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { Fragment, useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const SLOTS = ["Matin", "Midi", "Aprèm", "Soir"];

type SlotKey = `${number}-${number}`;

const PRESET: SlotKey[] = ["1-2", "3-2", "5-0", "5-2", "5-3", "6-1"];

export default function WireframeAvailabilityGrid() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [selected, setSelected] = useState<Set<SlotKey>>(new Set(PRESET));

  const toggle = useCallback((key: SlotKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const reset = useCallback(() => setSelected(new Set()), []);

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Mes disponibilités
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {selected.size} créneau{selected.size > 1 ? "x" : ""} sélectionné{selected.size > 1 ? "s" : ""}
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={reset}
          disabled={selected.size === 0}
          sx={{ textTransform: "none", fontWeight: 700, color: "text.secondary" }}
        >
          Tout effacer
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `60px repeat(${DAYS.length}, 1fr)`,
          gap: 0.5,
        }}
      >
        <Box />
        {DAYS.map((d) => (
          <Typography
            key={d}
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "text.secondary",
              textAlign: "center",
              fontSize: 11,
              pb: 0.5,
            }}
          >
            {d}
          </Typography>
        ))}

        {SLOTS.map((slot, slotIdx) => (
          <Fragment key={slot}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                fontSize: 11,
                display: "flex",
                alignItems: "center",
              }}
            >
              {slot}
            </Typography>
            {DAYS.map((_, dayIdx) => {
              const key: SlotKey = `${dayIdx}-${slotIdx}`;
              const isSelected = selected.has(key);
              return (
                <Box
                  key={key}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggle(key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(key);
                    }
                  }}
                  sx={{
                    height: 32,
                    borderRadius: 1,
                    cursor: "pointer",
                    bgcolor: isSelected ? dk.surfaceStrong : alpha(dk.surfaceMuted, 0.3),
                    color: dk.white,
                    border: `1px solid ${
                      isSelected ? darken(dk.surfaceStrong, 0.1) : alpha(dk.border, 0.15)
                    }`,
                    transition: "all 0.12s ease",
                    "&:hover": {
                      bgcolor: isSelected ? darken(dk.surfaceStrong, 0.05) : alpha(dk.surfaceAccent, 0.6),
                    },
                    outline: "none",
                    "&:focus-visible": { boxShadow: `0 0 0 2px ${alpha(dk.tertiary, 0.5)}` },
                  }}
                />
              );
            })}
          </Fragment>
        ))}
      </Box>

      <Box
        sx={{
          mt: 2,
          p: 1.25,
          borderRadius: 2,
          bgcolor: alpha(dk.tertiaryLight, 0.4),
          fontSize: 12,
          fontWeight: 700,
          color: "primary.main",
        }}
      >
        💡 On te proposera des missions pile sur tes créneaux disponibles.
      </Box>
    </Box>
  );
}
