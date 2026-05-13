"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const OPTIONS = ["Toutes", "Solidarité", "Culture", "Sport"] as const;

type Opt = (typeof OPTIONS)[number];

export default function WireframeSegmentedControl() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [value, setValue] = useState<Opt>("Toutes");

  const handleSelect = useCallback((v: Opt) => setValue(v), []);

  const activeIndex = OPTIONS.indexOf(value);
  const segWidth = 100 / OPTIONS.length;

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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Segmented control
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        L'indicateur glisse en CSS · style iOS.
      </Typography>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          width: "100%",
          p: 0.5,
          borderRadius: 9999,
          bgcolor: alpha(dk.surfaceMuted, 0.4),
          border: `1px solid ${alpha(dk.border, 0.15)}`,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: 4,
            width: `calc(${segWidth}% - 8px / ${OPTIONS.length})`,
            transform: `translateX(calc(${activeIndex} * (100% + 8px / ${OPTIONS.length})))`,
            borderRadius: 9999,
            bgcolor: dk.white,
            boxShadow: `0 2px 8px ${alpha(dk.surfaceStrong, 0.18)}`,
            transition: "transform 0.32s cubic-bezier(.5,1.4,.4,1)",
          }}
        />
        {OPTIONS.map((opt) => {
          const active = opt === value;
          return (
            <Box
              key={opt}
              role="button"
              aria-pressed={active}
              tabIndex={0}
              onClick={() => handleSelect(opt)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(opt);
                }
              }}
              sx={{
                position: "relative",
                flex: 1,
                py: 1,
                fontSize: 13,
                fontWeight: 800,
                textAlign: "center",
                cursor: "pointer",
                color: active ? "primary.main" : "text.secondary",
                transition: "color 0.2s ease",
                outline: "none",
              }}
            >
              {opt}
            </Box>
          );
        })}
      </Box>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: dk.tertiary,
          }}
        />
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
          Sélection : <Box component="span" sx={{ color: "primary.main", fontWeight: 800 }}>{value}</Box>
        </Typography>
      </Stack>
    </Box>
  );
}
