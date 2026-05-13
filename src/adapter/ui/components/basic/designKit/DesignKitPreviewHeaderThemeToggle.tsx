"use client";

import { DarkMode, LightMode } from "@mui/icons-material";
import { Box, Switch } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

/**
 * Toggle clair/sombre du preview · rendu dans le header Giveety (fond vert),
 * imbriqué dans le `ThemeProvider` du carousel pour refléter l’état réel du preview.
 */
export default function DesignKitPreviewHeaderThemeToggle({
  darkMode,
  onDarkModeChange,
}: {
  darkMode: boolean;
  onDarkModeChange: (next: boolean) => void;
}) {
  const theme = useTheme();

  return (
    <Box
      role="group"
      aria-label="Thème du Design Kit"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.65,
        pl: 1,
        pr: 1,
        py: 0.45,
        borderRadius: 999,
        flexShrink: 0,
        bgcolor: alpha("#ffffff", darkMode ? 0.11 : 0.18),
        border: `1px solid ${alpha("#ffffff", darkMode ? 0.22 : 0.4)}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: `inset 0 1px 0 ${alpha("#ffffff", 0.35)}`,
      }}
    >
      <LightMode
        sx={{
          fontSize: 18,
          color: darkMode ? alpha("#ffffff", 0.45) : theme.palette.secondary.main,
          transition: "color 0.2s ease",
        }}
      />
      <Switch
        size="small"
        checked={darkMode}
        onChange={(_, v) => onDarkModeChange(v)}
        inputProps={{ "aria-label": "Activer le thème sombre sur la démo Design Kit" }}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: theme.palette.secondary.main,
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            bgcolor: alpha(theme.palette.secondary.main, 0.45),
          },
        }}
      />
      <DarkMode
        sx={{
          fontSize: 18,
          color: darkMode ? theme.palette.secondary.main : alpha("#ffffff", 0.45),
          transition: "color 0.2s ease",
        }}
      />
    </Box>
  );
}
