"use client";

import { Star, StarBorder } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const TAGS = ["Bien organisée", "Équipe au top", "Manque d'infos", "Très utile", "Trop courte", "À refaire"];
const LABELS = ["", "Décevante", "Mitigée", "Sympa", "Très bien", "Excellente"];

export default function WireframeReviewForm() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState(false);

  const togglePick = useCallback((t: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }, []);

  const submit = useCallback(() => {
    if (rating === 0) return;
    setSent(true);
  }, [rating]);

  const reset = useCallback(() => {
    setRating(0);
    setComment("");
    setPicked(new Set());
    setSent(false);
  }, []);

  if (sent) {
    return (
      <Box
        sx={{
          borderRadius: 3,
          bgcolor: dk.white,
          border: `1px solid ${alpha(dk.border, 0.18)}`,
          boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
          Merci pour ton avis 💚
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Note : {rating}/5{picked.size > 0 ? ` · ${picked.size} tag${picked.size > 1 ? "s" : ""}` : ""}
        </Typography>
        <Button onClick={reset} sx={{ textTransform: "none", fontWeight: 700, color: "tertiary.main" }}>
          Refaire un avis
        </Button>
      </Box>
    );
  }

  const display = hover || rating;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
        Comment s'est passée ta mission ?
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Maraude · samedi 11 mai
      </Typography>

      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= display;
          return (
            <Box
              key={n}
              role="button"
              tabIndex={0}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              sx={{
                cursor: "pointer",
                color: filled ? dk.tertiary : alpha(dk.textMuted, 0.4),
                transition: "transform 0.15s ease, color 0.15s ease",
                "&:hover": { transform: "scale(1.15)" },
                outline: "none",
                p: 0.25,
              }}
            >
              {filled ? <Star sx={{ fontSize: 36 }} /> : <StarBorder sx={{ fontSize: 36 }} />}
            </Box>
          );
        })}
        <Typography variant="caption" sx={{ ml: 1.5, fontWeight: 800, color: "tertiary.main" }}>
          {LABELS[display] || "Note la mission"}
        </Typography>
      </Stack>

      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, mt: 1, display: "block", mb: 1 }}>
        En quelques mots ?
      </Typography>
      <Stack direction="row" spacing={0.75} sx={{ mb: 2, flexWrap: "wrap", gap: 0.75 }}>
        {TAGS.map((t) => {
          const isPicked = picked.has(t);
          return (
            <Chip
              key={t}
              label={t}
              clickable
              onClick={() => togglePick(t)}
              sx={{
                fontWeight: 700,
                bgcolor: isPicked ? dk.surfaceStrong : alpha(dk.border, 0.08),
                color: isPicked ? dk.white : dk.text,
                "&:hover": {
                  bgcolor: isPicked ? dk.surfaceStrong : alpha(dk.surfaceAccent, 0.5),
                },
              }}
            />
          );
        })}
      </Stack>

      <TextField
        fullWidth
        multiline
        minRows={3}
        placeholder="Un commentaire à laisser à l'asso ? (optionnel)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        disableElevation
        onClick={submit}
        disabled={rating === 0}
        sx={{
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 800,
          bgcolor: dk.surfaceStrong,
          color: dk.white,
          "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
        }}
      >
        Envoyer mon avis
      </Button>
    </Box>
  );
}
