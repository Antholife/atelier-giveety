"use client";

import {
  FormControl,
  Select,
  SelectChangeEvent,
  useTheme,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/**
 * Props for LanguageSwitcher component
 *
 * @property inMenu - If true, adapts colors for use in a menu (light background)
 */
type LanguageSwitcherProps = {
  inMenu?: boolean;
};

/**
 * Language switcher component
 *
 * Dropdown component for switching between supported locales (French and English).
 * Integrates with next-intl for internationalization and automatically updates the URL
 * when the language changes.
 *
 * Features:
 * - Dropdown selection for language switching
 * - Integration with next-intl for locale management
 * - Theme integration for consistent styling
 * - Automatic URL update when language changes
 * - Support for menu and non-menu contexts with different color schemes
 *
 * @param props - Component props
 * @returns The rendered language switcher dropdown component
 */
export default function LanguageSwitcher({
  inMenu = false,
}: LanguageSwitcherProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const theme = useTheme();

  const [locale, setLocale] = useState<"fr" | "en">("fr");

  // Sync locale with currentLocale after mount to avoid hydration mismatch
  useEffect(() => {
    setLocale(currentLocale as "fr" | "en");
  }, [currentLocale]);

  const handleChange = (event: SelectChangeEvent) => {
    setLocale(event.target.value as "fr" | "en");
    const segments = pathname.split("/");
    segments[1] = event.target.value;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  const colors = useMemo(
    () => ({
      text: inMenu
        ? theme.palette.primary.main
        : theme.palette.background.default,
      icon: inMenu
        ? theme.palette.primary.main
        : theme.palette.background.default,
      hover: theme.palette.secondary.main,
    }),
    [
      inMenu,
      theme.palette.primary.main,
      theme.palette.background.default,
      theme.palette.secondary.main,
    ],
  );

  const selectSx = useMemo(
    () => ({
      color: colors.text,
      fontSize: "14px",
      "& .MuiSelect-icon": {
        color: colors.icon,
      },
      "&:hover .MuiSelect-icon": {
        color: colors.hover,
      },
      "&:hover": {
        color: colors.hover,
      },
      "&:before": {
        borderBottom: "none",
      },
      "&:hover:not(.Mui-disabled):before": {
        borderBottomColor: colors.hover,
      },
    }),
    [colors],
  );

  return (
    <FormControl variant="standard" sx={{ width: "100%" }}>
      <Select
        labelId="language-switcher-label"
        id="language-switcher"
        value={locale}
        label="Language"
        onChange={handleChange}
        sx={selectSx}
      >
        <MenuItem value="fr" data-navigation>
          FR
        </MenuItem>
        <MenuItem value="en" data-navigation>
          EN
        </MenuItem>
      </Select>
    </FormControl>
  );
}
