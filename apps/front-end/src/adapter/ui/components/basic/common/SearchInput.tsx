"use client";

import { Search } from "@mui/icons-material";
import { Box, InputAdornment, TextField, useTheme } from "@mui/material";
import { useMemo } from "react";

/**
 * Props for SearchInput component
 *
 * @property value - Current search input value
 * @property onChange - Callback function called when the input value changes
 * @property placeholder - Optional placeholder text (defaults to translation key)
 */
type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/**
 * Search input component
 *
 * Displays a search input field with a search icon.
 * Used for filtering and searching through lists of items.
 *
 * @param props - Component props
 * @returns The rendered search input component
 */
function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const theme = useTheme();

  const textFieldSx = useMemo(
    () => ({
      flex: 1,
      "& .MuiOutlinedInput-root": {
        height: "40px",
        backgroundColor: theme.palette.background.default,
        borderRadius: "6px",
        border: `1px solid ${theme.palette.border.main}`,
        gap: "6px",
        fontSize: "14px",
        "& fieldset": {
          border: "none",
        },
        "& input": {
          padding: "8px 14px",
          height: "auto",
        },
      },
    }),
    [theme.palette.border.main, theme.palette.background.default],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        position: "relative",
      }}
    >
      <TextField
        placeholder={placeholder || "Rechercher..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={textFieldSx}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Search
                  sx={{
                    color: theme.palette.text.secondary,
                  }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}

export default SearchInput;
