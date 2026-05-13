"use client";

import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const INITIAL = [
  { id: "solidarity", label: "Solidarité", votes: 142 },
  { id: "culture", label: "Culture", votes: 89 },
  { id: "environment", label: "Environnement", votes: 167 },
  { id: "sport", label: "Sport", votes: 54 },
];

export default function WireframePollWidget() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [options, setOptions] = useState(INITIAL);
  const [voted, setVoted] = useState<string | null>(null);
  const total = options.reduce((acc, o) => acc + o.votes, 0);
  const max = Math.max(...options.map((o) => o.votes));
  const winnerId = options.find((o) => o.votes === max)?.id;

  const vote = useCallback((id: string) => {
    if (voted) return;
    setVoted(id);
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, votes: o.votes + 1 } : o)));
  }, [voted]);

  const reset = useCallback(() => {
    setOptions(INITIAL);
    setVoted(null);
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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Quel sera ton prochain engagement ?
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        {total} votes au total · {voted ? "Merci pour ton vote !" : "Choisis ta catégorie"}
      </Typography>

      <Stack spacing={1.25}>
        {options.map((o) => {
          const pct = (o.votes / total) * 100;
          const isMine = voted === o.id;
          const isWinner = voted !== null && o.id === winnerId;
          return (
            <Box
              key={o.id}
              role="button"
              tabIndex={voted ? -1 : 0}
              onClick={() => vote(o.id)}
              sx={{
                position: "relative",
                px: 2,
                py: 1.25,
                borderRadius: 2,
                cursor: voted ? "default" : "pointer",
                overflow: "hidden",
                bgcolor: alpha(dk.surfaceMuted, 0.3),
                border: `1px solid ${
                  isMine ? dk.tertiary : isWinner ? alpha(dk.surfaceStrong, 0.4) : alpha(dk.border, 0.18)
                }`,
                transition: "all 0.15s ease",
                "&:hover": voted
                  ? undefined
                  : { bgcolor: alpha(dk.surfaceAccent, 0.4), transform: "translateX(2px)" },
              }}
            >
              {voted ? (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: `${pct}%`,
                    background: isWinner
                      ? `linear-gradient(90deg, ${alpha(dk.tertiary, 0.4)}, ${alpha(dk.tertiary, 0.15)})`
                      : alpha(dk.primaryLight, 0.7),
                    transition: "width 0.5s ease",
                  }}
                />
              ) : null}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ position: "relative" }}>
                <Typography sx={{ flex: 1, fontWeight: isMine || isWinner ? 800 : 700, color: "primary.main" }}>
                  {o.label}
                  {isMine ? <Box component="span" sx={{ ml: 1, color: "tertiary.main" }}>· ton vote</Box> : null}
                </Typography>
                {voted ? (
                  <Typography sx={{ fontWeight: 800, color: isWinner ? "tertiary.main" : "primary.main" }}>
                    {Math.round(pct)}%
                  </Typography>
                ) : null}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {voted ? (
        <Button
          onClick={reset}
          size="small"
          sx={{ mt: 1, textTransform: "none", fontWeight: 700, color: "text.secondary" }}
        >
          Réinitialiser le sondage
        </Button>
      ) : null}
    </Box>
  );
}
