"use client";

import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
  IosShare,
  MoreHoriz,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

export default function WireframeFeedCard() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(42);
  const [shareCount, setShareCount] = useState(7);

  const toggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikes((c) => c + (next ? 1 : -1));
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
        overflow: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: dk.surfaceAccent,
            color: dk.surfaceStrong,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          NA
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}>
            Nora · Singa France
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            il y a 3 h · Lille
          </Typography>
        </Box>
        <IconButton size="small" aria-label="Plus">
          <MoreHoriz />
        </IconButton>
      </Stack>

      <Box
        sx={{
          aspectRatio: "16 / 9",
          background: `linear-gradient(135deg, ${dk.tertiary} 0%, ${dk.surfaceStrong} 100%)`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: dk.white,
        }}
      >
        <Stack alignItems="center" spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            32 bénévoles
          </Typography>
          <Typography sx={{ fontWeight: 700, opacity: 0.9 }}>
            ont bouclé l'atelier FLE de samedi 🎉
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500, mb: 1 }}>
          Merci à toutes les personnes qui ont contribué ! On remet ça la semaine prochaine.
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton size="small" onClick={toggleLike} sx={{ color: liked ? "tertiary.main" : "text.secondary" }}>
            {liked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mr: 1 }}>
            {likes}
          </Typography>
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <ChatBubbleOutline fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mr: 1 }}>
            12
          </Typography>
          <IconButton
            size="small"
            sx={{ color: "text.secondary" }}
            onClick={() => setShareCount((c) => c + 1)}
          >
            <IosShare fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
            {shareCount}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
