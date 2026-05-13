"use client";

import { Check, PersonAdd, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Contact = {
  id: string;
  initials: string;
  name: string;
  org: string;
  alreadyManager: boolean;
};

const CONTACTS: Contact[] = [
  { id: "1", initials: "CB", name: "Camille Brun", org: "Singa France", alreadyManager: true },
  { id: "2", initials: "MR", name: "Maxime Roy", org: "Petits Frères", alreadyManager: false },
  { id: "3", initials: "AL", name: "Anaïs Lambert", org: "Coop Culture", alreadyManager: false },
  { id: "4", initials: "PD", name: "Paul Dorée", org: "Surfrider", alreadyManager: true },
  { id: "5", initials: "ZK", name: "Zoé Karadag", org: "Sport pour Tous", alreadyManager: false },
  { id: "6", initials: "LT", name: "Lou Tremblay", org: "Croix-Rouge", alreadyManager: false },
];

export default function WireframeContactPicker() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set(["1"]));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONTACTS;
    return CONTACTS.filter((c) => c.name.toLowerCase().includes(q) || c.org.toLowerCase().includes(q));
  }, [query]);

  const toggle = useCallback((id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 1.5 }}>
        Choisis un manager
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 0.75,
          borderRadius: 9999,
          bgcolor: alpha(dk.surfaceMuted, 0.4),
          border: `1px solid ${alpha(dk.border, 0.18)}`,
          mb: 2,
        }}
      >
        <Search sx={{ color: "primary.main", fontSize: 18 }} />
        <InputBase
          fullWidth
          placeholder="Tape un nom ou une asso…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ fontWeight: 500, fontFamily: theme.typography.fontFamily }}
        />
      </Box>

      {picked.size > 0 ? (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 1.5 }}>
          {Array.from(picked)
            .map((id) => CONTACTS.find((c) => c.id === id))
            .filter((c): c is Contact => Boolean(c))
            .map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                onDelete={() => toggle(c.id)}
                sx={{
                  bgcolor: dk.surfaceStrong,
                  color: dk.white,
                  fontWeight: 700,
                  "& .MuiChip-deleteIcon": { color: alpha(dk.white, 0.8) },
                }}
              />
            ))}
        </Stack>
      ) : null}

      <Stack spacing={0.5} sx={{ maxHeight: 260, overflowY: "auto", mb: 2 }}>
        {filtered.length === 0 ? (
          <Typography sx={{ p: 2, textAlign: "center", color: "text.secondary", fontWeight: 600 }}>
            Aucun contact trouvé.
          </Typography>
        ) : null}
        {filtered.map((c) => {
          const isPicked = picked.has(c.id);
          return (
            <Stack
              key={c.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              onClick={() => toggle(c.id)}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: isPicked ? alpha(dk.tertiaryLight, 0.4) : "transparent",
                border: `1px solid ${isPicked ? dk.tertiary : "transparent"}`,
                transition: "all 0.15s ease",
                "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.4) },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: dk.surfaceAccent,
                  color: dk.surfaceStrong,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {c.initials}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, color: "primary.main" }} noWrap>
                  {c.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                    {c.org}
                  </Typography>
                  {c.alreadyManager ? (
                    <Chip label="Déjà manager" size="small" sx={{ height: 16, fontSize: 9, bgcolor: alpha(dk.mint, 0.6), color: "primary.main", fontWeight: 800 }} />
                  ) : null}
                </Stack>
              </Box>
              {isPicked ? (
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: dk.tertiary,
                    color: dk.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check sx={{ fontSize: 14 }} />
                </Box>
              ) : null}
            </Stack>
          );
        })}
      </Stack>

      <Button
        startIcon={<PersonAdd />}
        fullWidth
        sx={{
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 700,
          color: "primary.main",
          border: `1px dashed ${alpha(dk.surfaceStrong, 0.4)}`,
        }}
      >
        Inviter quelqu'un d'autre par e-mail
      </Button>
    </Box>
  );
}
