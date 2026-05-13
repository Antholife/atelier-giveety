"use client";

import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  Link,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useId, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type WireframeManagementNavProps = {
  initials: string;
  spaceTag: string;
  links: readonly [string, string, string];
};

const spaceOptions = ["Espace Céleste", "Espace Souterrain", "Espace Flottant"] as const;

export default function WireframeManagementNav({
  initials,
  spaceTag: initialSpaceTag,
  links,
}: WireframeManagementNavProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const menuId = useId();
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [spaceAnchor, setSpaceAnchor] = useState<HTMLElement | null>(null);
  const [activeLink, setActiveLink] = useState<string>(links[0]);
  const [currentSpace, setCurrentSpace] = useState(initialSpaceTag);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const openProfile = useCallback((el: HTMLElement | null) => {
    setProfileAnchor(el);
  }, []);

  const openSpace = useCallback((el: HTMLElement | null) => {
    setSpaceAnchor(el);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          border: `1px solid ${alpha(dk.border, 0.6)}`,
          borderRadius: 2,
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          background: `linear-gradient(90deg, ${dk.surface} 0%, ${alpha(dk.primaryLight, 0.5)} 55%, ${alpha(dk.surfaceMuted, 0.9)} 100%)`,
          boxShadow: `inset 0 1px 0 ${alpha(dk.white, 0.7)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <ButtonBase
            aria-haspopup="true"
            aria-expanded={Boolean(profileAnchor)}
            aria-controls={profileAnchor ? menuId : undefined}
            onClick={(e) => openProfile(profileAnchor ? null : e.currentTarget)}
            sx={{
              borderRadius: 2,
              px: 0.5,
              py: 0.5,
              "&:focus-visible": {
                boxShadow: `0 0 0 3px ${alpha(dk.surfaceAccent, 0.55)}`,
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: dk.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 13,
                  color: "primary.main",
                  border: `2px solid ${alpha(dk.surfaceStrong, 0.25)}`,
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                {initials}
              </Box>
              <KeyboardArrowDown
                sx={{
                  fontSize: 22,
                  color: "primary.main",
                  transform: profileAnchor ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s ease",
                }}
              />
            </Stack>
          </ButtonBase>
          <ButtonBase
            onClick={(e) => openSpace(spaceAnchor ? null : e.currentTarget)}
            sx={{
              borderRadius: 9999,
              border: `1px solid ${alpha(dk.surfaceStrong, 0.35)}`,
              px: 2,
              py: 0.6,
              fontSize: 13,
              fontWeight: 700,
              color: dk.surfaceStrong,
              bgcolor: dk.surfaceAccent,
              fontFamily: theme.typography.fontFamily,
              "&:hover": { bgcolor: alpha(dk.surfaceAccent, 0.92) },
              "&:focus-visible": {
                boxShadow: `0 0 0 3px ${alpha(dk.tertiary, 0.45)}`,
              },
            }}
          >
            {currentSpace}
          </ButtonBase>
        </Stack>
        <Stack
          direction="row"
          spacing={4}
          flexWrap="wrap"
          sx={{ ml: { xs: 0, md: "auto" } }}
        >
          {links.map((label) => {
            const active = activeLink === label;
            return (
              <Link
                key={label}
                component="button"
                type="button"
                underline="always"
                onClick={() => {
                  setActiveLink(label);
                  setSnackbar(`Section « ${label} » (démo)`);
                }}
                sx={{
                  color: active ? dk.tertiary : dk.text,
                  fontWeight: active ? 800 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  border: "none",
                  background: "none",
                  p: 0,
                  fontFamily: theme.typography.fontFamily,
                  textDecorationColor: active ? dk.tertiary : alpha(dk.border, 0.4),
                  textUnderlineOffset: 5,
                }}
              >
                {label}
              </Link>
            );
          })}
        </Stack>
      </Box>

      <Menu
        id={menuId}
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => openProfile(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              border: `1px solid ${alpha(dk.border, 0.35)}`,
              boxShadow: `0 12px 40px ${alpha(dk.surfaceStrong, 0.18)}`,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            openProfile(null);
            setSnackbar("Profil (démo)");
          }}
        >
          Profil
        </MenuItem>
        <MenuItem
          onClick={() => {
            openProfile(null);
            setSnackbar("Préférences (démo)");
          }}
        >
          Préférences
        </MenuItem>
        <MenuItem
          onClick={() => {
            openProfile(null);
            setSnackbar("Déconnexion simulée");
          }}
        >
          Déconnexion
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={spaceAnchor}
        open={Boolean(spaceAnchor)}
        onClose={() => openSpace(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              border: `1px solid ${alpha(dk.border, 0.35)}`,
            },
          },
        }}
      >
        {spaceOptions.map((opt) => (
          <MenuItem
            key={opt}
            selected={opt === currentSpace}
            onClick={() => {
              setCurrentSpace(opt);
              openSpace(null);
              setSnackbar(`Espace : ${opt}`);
            }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>

      <Snackbar
        open={snackbar !== null}
        onClose={() => setSnackbar(null)}
        autoHideDuration={2800}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={
          <Typography component="span" variant="body2" sx={{ fontFamily: theme.typography.fontFamily }}>
            {snackbar}
          </Typography>
        }
        ContentProps={{
          sx: {
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
}
