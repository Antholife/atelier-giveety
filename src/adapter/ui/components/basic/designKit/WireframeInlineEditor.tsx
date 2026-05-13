"use client";

import { Check, Close, Edit } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Field = {
  id: string;
  label: string;
  value: string;
};

const INITIAL: Field[] = [
  { id: "name", label: "Nom affiché", value: "Élise Marchand" },
  { id: "tagline", label: "Bio", value: "Bénévole confirmée · Médiation et accueil" },
  { id: "city", label: "Ville", value: "Nantes" },
  { id: "email", label: "E-mail public", value: "elise@example.org" },
];

export default function WireframeInlineEditor() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [fields, setFields] = useState<Field[]>(INITIAL);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const start = useCallback((f: Field) => {
    setEditingId(f.id);
    setDraft(f.value);
  }, []);

  const save = useCallback(() => {
    if (!editingId) return;
    setFields((prev) => prev.map((f) => (f.id === editingId ? { ...f, value: draft } : f)));
    setSavedId(editingId);
    setEditingId(null);
    window.setTimeout(() => setSavedId(null), 1200);
  }, [editingId, draft]);

  const cancel = useCallback(() => setEditingId(null), []);

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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 2 }}>
        Mes infos · édition inline
      </Typography>
      <Stack spacing={1.25}>
        {fields.map((f) => {
          const isEditing = editingId === f.id;
          const wasSaved = savedId === f.id;
          return (
            <Stack
              key={f.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: isEditing ? alpha(dk.tertiaryLight, 0.4) : alpha(dk.surfaceMuted, 0.2),
                border: isEditing
                  ? `1px solid ${dk.tertiary}`
                  : `1px solid transparent`,
                transition: "all 0.15s ease",
              }}
            >
              <Typography variant="caption" sx={{ minWidth: 100, fontWeight: 700, color: "text.secondary" }}>
                {f.label}
              </Typography>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <InputBase
                    fullWidth
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") save();
                      if (e.key === "Escape") cancel();
                    }}
                    sx={{ fontWeight: 700, color: "primary.main", fontFamily: theme.typography.fontFamily }}
                  />
                ) : (
                  <Typography sx={{ fontWeight: 700, color: "primary.main" }} noWrap>
                    {f.value}
                  </Typography>
                )}
              </Box>
              {isEditing ? (
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={save} sx={{ bgcolor: dk.surfaceStrong, color: dk.white, "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.85) } }} aria-label="Valider">
                    <Check fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={cancel} aria-label="Annuler">
                    <Close fontSize="small" />
                  </IconButton>
                </Stack>
              ) : (
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  {wasSaved ? (
                    <Typography variant="caption" sx={{ color: "success.main", fontWeight: 800 }}>
                      ✓ Sauvegardé
                    </Typography>
                  ) : null}
                  <IconButton size="small" onClick={() => start(f)} aria-label="Éditer" sx={{ color: "text.secondary" }}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
