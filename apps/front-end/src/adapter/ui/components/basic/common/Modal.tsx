"use client";

import { Close } from "@mui/icons-material";
import { Box, Dialog, IconButton, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import { useMemo } from "react";

/**
 * Props for Modal component
 *
 * @property open - Whether the modal is open
 * @property onClose - Callback function called when modal is closed
 * @property children - Modal content
 * @property maxWidth - Maximum width of the modal (default: "sm")
 * @property fullWidth - Whether the modal should take full width
 * @property fullScreen - Whether the modal should be full screen
 */
type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  fullWidth?: boolean;
  fullScreen?: boolean;
};

/**
 * Modal component
 *
 * A reusable modal dialog component with consistent styling.
 * Supports different sizes (maxWidth), full width, and full screen modes.
 * Includes a close button positioned in the top-right corner.
 *
 * @param props - Component props
 * @returns The rendered modal component
 */
function Modal({
  open,
  onClose,
  children,
  maxWidth = "sm",
  fullWidth = false,
  fullScreen = false,
}: ModalProps) {
  const theme = useTheme();

  const paperSx = useMemo(
    () => ({
      borderRadius: fullScreen ? 0 : "8px",
      padding: 0,
      margin: fullScreen ? 0 : undefined,
      ...(maxWidth && !fullScreen && { maxWidth }),
    }),
    [fullScreen, maxWidth],
  );

  const closeButtonSx = useMemo(
    () => ({
      position: "absolute" as const,
      top: { xs: 8, sm: 16 },
      right: { xs: 8, sm: fullScreen ? 40 : 16 },
      zIndex: 10000,
      color: fullScreen
        ? theme.palette.background.default
        : theme.palette.text.secondary,
      backgroundColor: fullScreen ? theme.palette.tertiary.main : "transparent",
      "&:hover": {
        backgroundColor: fullScreen
          ? theme.palette.tertiary.dark
          : theme.palette.background.page,
      },
      pointerEvents: "auto" as const,
    }),
    [
      fullScreen,
      theme.palette.background.default,
      theme.palette.text.secondary,
      theme.palette.tertiary.main,
      theme.palette.tertiary.dark,
      theme.palette.background.page,
    ],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      slotProps={{
        paper: {
          sx: paperSx,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          padding: fullScreen ? 0 : 3,
          width: fullScreen ? "100%" : "auto",
          height: fullScreen ? "100%" : "auto",
        }}
      >
        <IconButton onClick={onClose} sx={closeButtonSx} aria-label="Close">
          <Close />
        </IconButton>
        <Box
          sx={{
            pointerEvents: "auto",
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Dialog>
  );
}

export default Modal;
