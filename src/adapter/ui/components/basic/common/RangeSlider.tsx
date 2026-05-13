"use client";

import { Box, Slider, TextField, useTheme } from "@mui/material";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useState } from "react";

/**
 * Props for RangeSlider component
 *
 * @property min - Minimum value of the range
 * @property max - Maximum value of the range
 * @property value - Current range value as [min, max] tuple
 * @property onChange - Callback function called when the range value changes
 */
type RangeSliderProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

/**
 * Range slider component
 *
 * Displays a range slider with two input fields for min and max values.
 * Allows users to adjust a numeric range by dragging the slider or typing in the inputs.
 * Validates input to ensure min < max and values stay within the allowed range.
 *
 * Features:
 * - Dual input fields for min and max values
 * - Slider for visual range selection
 * - Input validation and auto-correction
 * - Keyboard support (Enter key to validate)
 *
 * @param props - Component props
 * @returns The rendered range slider component
 */
function RangeSlider({ min, max, value, onChange }: RangeSliderProps) {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [minInput, setMinInput] = useState<string>(value[0].toString());
  const [maxInput, setMaxInput] = useState<string>(value[1].toString());

  useEffect(() => {
    setLocalValue(value);
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  const handleRangeChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setLocalValue([newValue[0], newValue[1]]);
      setMinInput(newValue[0].toString());
      setMaxInput(newValue[1].toString());
      onChange([newValue[0], newValue[1]]);
    }
  };

  const validateMin = (inputValue: string) => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || inputValue === "") {
      setMinInput(localValue[0].toString());
      return;
    }
    const validatedMin = Math.max(min, Math.min(numValue, localValue[1] - 1));
    const newValue: [number, number] = [validatedMin, localValue[1]];
    setLocalValue(newValue);
    setMinInput(validatedMin.toString());
    onChange(newValue);
  };

  const validateMax = (inputValue: string) => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || inputValue === "") {
      setMaxInput(localValue[1].toString());
      return;
    }
    const validatedMax = Math.min(max, Math.max(numValue, localValue[0] + 1));
    const newValue: [number, number] = [localValue[0], validatedMax];
    setLocalValue(newValue);
    setMaxInput(validatedMax.toString());
    onChange(newValue);
  };

  const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMinInput(event.target.value);
  };

  const handleMinBlur = () => {
    validateMin(minInput);
  };

  const handleMinKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      validateMin(minInput);
    }
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMaxInput(event.target.value);
  };

  const handleMaxBlur = () => {
    validateMax(maxInput);
  };

  const handleMaxKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      validateMax(maxInput);
    }
  };

  const inputSx = useMemo(
    () => ({
      width: "auto",
      "& .MuiFilledInput-root": {
        height: "40px",
        fontSize: "14px",
        backgroundColor: theme.palette.background.default,
        "& input": {
          color: theme.palette.primary.main,
          textAlign: "center",
        },
        "&::after": {
          borderBottomColor: theme.palette.primary.main,
        },
      },
    }),
    [theme.palette.primary.main, theme.palette.background.default],
  );

  const sliderSx = useMemo(
    () => ({
      color: theme.palette.primary.main,
      "& .MuiSlider-thumb": {
        width: 12,
        height: 12,
        border: `2px solid ${theme.palette.primary.main}`,
      },
      "& .MuiSlider-track": {
        backgroundColor: theme.palette.primary.main,
      },
    }),
    [theme.palette.primary.main],
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TextField
        value={minInput}
        onChange={handleMinChange}
        onBlur={handleMinBlur}
        variant="filled"
        onKeyDown={handleMinKeyDown}
        type="number"
        slotProps={{
          input: {
            inputProps: {
              min,
              max: localValue[1] - 1,
              style: { textAlign: "center", padding: "8px" },
            },
          },
        }}
        sx={inputSx}
      />
      <Box
        sx={{
          width: "200px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Slider
          value={localValue}
          onChange={handleRangeChange}
          min={min}
          max={max}
          size="small"
          valueLabelDisplay="off"
          sx={sliderSx}
        />
      </Box>
      <TextField
        value={maxInput}
        onChange={handleMaxChange}
        onBlur={handleMaxBlur}
        onKeyDown={handleMaxKeyDown}
        type="number"
        variant="filled"
        slotProps={{
          input: {
            inputProps: {
              min: localValue[0] + 1,
              max,
              style: { textAlign: "center", padding: "8px" },
            },
          },
        }}
        sx={inputSx}
      />
    </Box>
  );
}

export default RangeSlider;
