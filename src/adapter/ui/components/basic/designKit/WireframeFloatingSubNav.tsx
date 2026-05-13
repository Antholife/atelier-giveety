"use client";

import { ButtonBase, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type WireframeFloatingSubNavProps = {
  /** Les trois vues ; la première est active au montage. */
  options: readonly [string, string, string];
};

export default function WireframeFloatingSubNav({ options }: WireframeFloatingSubNavProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [activeIndex, setActiveIndex] = useState(0);

  const select = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <Typography
      component="div"
      sx={{
        border: `1px solid ${alpha(dk.border, 0.45)}`,
        background: `linear-gradient(95deg, ${alpha(dk.surfaceStrong, 0.95)} 0%, ${dk.surfaceStrong} 42%, ${alpha(dk.surfaceStrong, 0.88)} 100%)`,
        borderRadius: 9999,
        px: 1,
        py: 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        maxWidth: "100%",
        flexWrap: "wrap",
        boxShadow: `0 6px 24px ${alpha(dk.surfaceStrong, 0.25)}`,
      }}
    >
      {options.map((label, index) => {
        const active = index === activeIndex;
        return (
          <ButtonBase
            key={label}
            disableRipple
            onClick={() => select(index)}
            sx={{
              borderRadius: 9999,
              px: 2.5,
              py: 1,
              fontWeight: active ? 800 : 500,
              fontSize: 14,
              fontFamily: theme.typography.fontFamily,
              color: active ? dk.surfaceStrong : alpha(dk.white, 0.88),
              bgcolor: active ? dk.surfaceAccent : "transparent",
              transition: "background-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
              border: active ? `1px solid ${alpha(dk.white, 0.35)}` : "1px solid transparent",
              "&:hover": {
                bgcolor: active ? dk.surfaceAccent : alpha(dk.white, 0.12),
                transform: active ? "none" : "translateY(-1px)",
              },
              "&:focus-visible": {
                boxShadow: `0 0 0 3px ${alpha(dk.surfaceAccent, 0.65)}`,
              },
            }}
          >
            {label}
          </ButtonBase>
        );
      })}
    </Typography>
  );
}
