"use client";

import { Box, Button, Snackbar, Stack, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type WireframeButtonsProps = {
  primaryLabel: string;
  secondaryLabel: string;
};

export default function WireframeButtons({
  primaryLabel,
  secondaryLabel,
}: WireframeButtonsProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [primaryLoading, setPrimaryLoading] = useState(false);

  const showSnackbar = useCallback((msg: string) => {
    setSnackbar(msg);
  }, []);

  const handlePrimary = useCallback(() => {
    setPrimaryLoading(true);
    window.setTimeout(() => {
      setPrimaryLoading(false);
      showSnackbar("Action principale terminée (démo).");
    }, 700);
  }, [showSnackbar]);

  const handleSecondary = useCallback(() => {
    showSnackbar("Action secondaire enregistrée (démo).");
  }, [showSnackbar]);

  return (
    <Box>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button
          disableElevation
          disabled={primaryLoading}
          onClick={handlePrimary}
          sx={{
            borderRadius: 9999,
            px: 3,
            py: 1.25,
            textTransform: "none",
            fontWeight: 700,
            fontFamily: theme.typography.fontFamily,
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            boxShadow: `0 2px 8px ${alpha(dk.surfaceStrong, 0.35)}`,
            "&:hover": {
              bgcolor: darken(dk.surfaceStrong, 0.12),
              boxShadow: `0 4px 14px ${alpha(dk.surfaceStrong, 0.45)}`,
            },
            "&.Mui-disabled": {
              color: alpha(dk.white, 0.65),
              bgcolor: alpha(dk.surfaceStrong, 0.45),
            },
          }}
        >
          {primaryLoading ? "Patience…" : primaryLabel}
        </Button>
        <Button
          disableElevation
          disabled={primaryLoading}
          onClick={handleSecondary}
          sx={{
            borderRadius: 9999,
            px: 3,
            py: 1.25,
            textTransform: "none",
            fontWeight: 700,
            fontFamily: theme.typography.fontFamily,
            bgcolor: dk.surfaceAccent,
            color: dk.surfaceStrong,
            border: `1px solid ${alpha(dk.surfaceStrong, 0.2)}`,
            "&:hover": {
              bgcolor: darken(dk.surfaceAccent, 0.06),
            },
          }}
        >
          {secondaryLabel}
        </Button>
      </Stack>
      <Snackbar
        open={snackbar !== null}
        message={snackbar}
        onClose={() => setSnackbar(null)}
        autoHideDuration={3200}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      />
    </Box>
  );
}
