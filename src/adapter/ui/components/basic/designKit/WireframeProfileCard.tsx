"use client";

import {
  EmojiEvents,
  Favorite,
  FavoriteBorder,
  PersonAdd,
  PersonRemove,
  Verified,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const PROFILE = {
  name: "Élise Marchand",
  initials: "EM",
  role: "Bénévole confirmée · Médiation",
  city: "Nantes",
  badges: ["Top engagement 2025", "+100h", "Mentor"],
  stats: [
    { label: "Heures", value: "184h" },
    { label: "Compétences", value: "12" },
    { label: "Projets", value: "6" },
  ],
};

export default function WireframeProfileCard() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(true);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const toggleFollow = useCallback(() => {
    setFollowing((prev) => {
      const next = !prev;
      setSnackbar(next ? "Tu suis Élise (démo)" : "Tu ne suis plus Élise");
      return next;
    });
  }, []);

  const toggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setSnackbar(next ? "Profil ajouté aux favoris" : "Retiré des favoris");
      return next;
    });
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.2)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
      }}
    >
      <Box
        sx={{
          height: 90,
          background: `linear-gradient(120deg, ${dk.surfaceStrong} 0%, ${dk.tertiary} 100%)`,
          position: "relative",
        }}
      >
        <IconButton
          onClick={toggleLike}
          aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: dk.white,
            bgcolor: alpha("#000", 0.15),
            "&:hover": { bgcolor: alpha("#000", 0.3) },
          }}
        >
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Box>

      <Box sx={{ px: 3, pb: 3, position: "relative" }}>
        <Box
          sx={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            bgcolor: dk.surfaceAccent,
            border: `4px solid ${dk.white}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 28,
            color: dk.surfaceStrong,
            mt: -6,
            mb: 1.5,
            position: "relative",
          }}
        >
          {PROFILE.initials}
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 22,
              height: 22,
              borderRadius: "50%",
              bgcolor: dk.canvas,
              border: `2px solid ${dk.white}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: dk.tertiary,
            }}
          >
            <Verified sx={{ fontSize: 18 }} />
          </Box>
        </Box>

        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}>
              {PROFILE.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              {PROFILE.role} · {PROFILE.city}
            </Typography>
          </Box>
          <Button
            disableElevation
            onClick={toggleFollow}
            startIcon={following ? <PersonRemove /> : <PersonAdd />}
            sx={{
              borderRadius: 9999,
              textTransform: "none",
              fontWeight: 800,
              px: 2.5,
              flexShrink: 0,
              bgcolor: following ? dk.surfaceAccent : dk.surfaceStrong,
              color: following ? dk.surfaceStrong : dk.white,
              border: following ? `1px solid ${alpha(dk.surfaceStrong, 0.3)}` : "none",
              "&:hover": {
                bgcolor: following ? darken(dk.surfaceAccent, 0.05) : darken(dk.surfaceStrong, 0.1),
              },
            }}
          >
            {following ? "Suivi" : "Suivre"}
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
          {PROFILE.badges.map((b) => (
            <Box
              key={b}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.25,
                py: 0.5,
                borderRadius: 9999,
                bgcolor: alpha(dk.tertiaryLight, 0.7),
                color: dk.surfaceStrong,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <EmojiEvents sx={{ fontSize: 14 }} />
              {b}
            </Box>
          ))}
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 2.5,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(dk.primaryLight, 0.5),
          }}
        >
          {PROFILE.stats.map((s) => (
            <Stack key={s.label} alignItems="center" sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
                {s.value}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {s.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Snackbar
        open={snackbar !== null}
        message={snackbar}
        onClose={() => setSnackbar(null)}
        autoHideDuration={2400}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { bgcolor: dk.surfaceStrong, color: dk.white, borderRadius: 2 },
        }}
      />
    </Box>
  );
}
