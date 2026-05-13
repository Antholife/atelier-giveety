"use client";

import { Info } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import CustomTooltip from "./CustomTooltip";

/**
 * Props for CheckboxField component
 *
 * @property id - Unique identifier for the field (used for scrolling to errors)
 * @property checked - Whether the checkbox is checked
 * @property value - Field value
 * @property label - Label text
 * @property disabled - Whether the checkbox is disabled
 * @property showInput - Whether to show the input field
 * @property inputAlwaysDisabled - Whether the input is always disabled regardless of checkbox state
 * @property inputType - Input type ("text", "number", or "email")
 * @property placeholder - Placeholder text
 * @property showInfoIcon - Whether to show info icon
 * @property infoTooltipText - Tooltip text for the info icon
 * @property error - Whether the field has an error
 * @property helperText - Error message to display
 * @property onToggle - Callback function called when checkbox is toggled
 * @property onChange - Callback function called when input value changes
 */
type CheckboxFieldProps = {
  /** Unique identifier for the field (used for scrolling to errors) */
  id?: string;
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Field value */
  value: string;
  /** Label text */
  label: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Whether to show the input field */
  showInput?: boolean;
  /** Whether the input is always disabled regardless of checkbox state */
  inputAlwaysDisabled?: boolean;
  /** Input type */
  inputType?: "text" | "number" | "email";
  /** Placeholder text */
  placeholder?: string;
  /** Whether to show info icon */
  showInfoIcon?: boolean;
  /** Tooltip text for the info icon */
  infoTooltipText?: string;
  /** Whether the field has an error */
  error?: boolean;
  /** Error message to display */
  helperText?: string;
  /** Callback when checkbox is toggled */
  onToggle: () => void;
  /** Callback when input value changes */
  onChange: (value: string) => void;
};

/**
 * Checkbox field component
 *
 * Displays a checkbox with label and optional input field.
 * The input field is disabled when the checkbox is unchecked or when explicitly disabled.
 * Supports error states, helper text, and an optional info icon with tooltip.
 *
 * @param props - Component props
 * @returns The rendered checkbox field component
 */
function CheckboxField({
  id,
  checked,
  value,
  label,
  disabled = false,
  showInput = true,
  inputAlwaysDisabled = false,
  inputType = "text",
  placeholder,
  showInfoIcon = false,
  infoTooltipText,
  error = false,
  helperText,
  onToggle,
  onChange,
}: CheckboxFieldProps) {
  const theme = useTheme();

  const isInputDisabled = useMemo(
    () => disabled || !checked || inputAlwaysDisabled,
    [disabled, checked, inputAlwaysDisabled],
  );

  const checkboxSx = useMemo(
    () => ({
      color: disabled
        ? theme.palette.action.disabled
        : error
          ? theme.palette.error.main
          : theme.palette.primary.main,
      "&.Mui-checked": {
        color: disabled
          ? theme.palette.action.disabled
          : error
            ? theme.palette.error.main
            : theme.palette.primary.main,
      },
      "&.Mui-disabled": {
        color: theme.palette.action.disabled,
      },
    }),
    [
      disabled,
      error,
      theme.palette.action.disabled,
      theme.palette.error.main,
      theme.palette.primary.main,
    ],
  );

  const labelSx = useMemo(
    () => ({
      fontSize: "14px",
      fontWeight: 500,
      color: disabled
        ? theme.palette.text.disabled
        : error
          ? theme.palette.error.main
          : theme.palette.primary.main,
      cursor: disabled ? "default" : "pointer",
    }),
    [
      disabled,
      error,
      theme.palette.text.disabled,
      theme.palette.error.main,
      theme.palette.primary.main,
    ],
  );

  const inputSx = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        borderRadius: "6px",
        height: "40px",
        backgroundColor: theme.palette.background.default,
        "&.Mui-disabled": {
          backgroundColor: theme.palette.disabled.input,
        },
      },
      "& input[type=number]": {
        MozAppearance: "textfield",
        "&::-webkit-outer-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        "&::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
      },
    }),
    [theme.palette.background.default, theme.palette.disabled.input],
  );

  return (
    <Box id={id} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={onToggle}
            sx={checkboxSx}
          />
        }
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography sx={labelSx}>{label}</Typography>
            {showInfoIcon &&
              (infoTooltipText ? (
                <CustomTooltip title={infoTooltipText} placement="top">
                  <Info
                    sx={{
                      fontSize: "16px",
                      color: theme.palette.text.secondary,
                      cursor: "help",
                    }}
                  />
                </CustomTooltip>
              ) : (
                <Info
                  sx={{
                    fontSize: "16px",
                    color: theme.palette.text.secondary,
                    pointerEvents: "none",
                  }}
                />
              ))}
          </Box>
        }
      />
      {showInput && (
        <TextField
          type={inputType}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={isInputDisabled}
          placeholder={placeholder}
          variant="outlined"
          error={error}
          sx={inputSx}
        />
      )}
      {helperText && (
        <FormHelperText
          error={error}
          sx={{ marginLeft: "14px", marginTop: "-4px" }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

export default CheckboxField;
