"use client";

import { Close, Favorite, Place, Replay } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Mission = {
  id: string;
  title: string;
  org: string;
  city: string;
  match: number;
  tags: string[];
};

const DECK: Mission[] = [
  { id: "1", title: "Maraude solidaire", org: "Petits Frères", city: "Paris", match: 92, tags: ["Solidarité", "Soir"] },
  { id: "2", title: "Atelier conversation FLE", org: "Singa", city: "Lyon", match: 87, tags: ["Médiation", "Hebdo"] },
  { id: "3", title: "Régie festival", org: "Coop Culture", city: "Toulouse", match: 78, tags: ["Culture", "Week-end"] },
  { id: "4", title: "Ramassage berges", org: "Surfrider", city: "Bordeaux", match: 71, tags: ["Environnement"] },
];

export default function WireframeMissionMatchCard() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [stack, setStack] = useState(DECK);
  const [lastAction, setLastAction] = useState<"like" | "skip" | null>(null);
  const [exiting, setExiting] = useState<"like" | "skip" | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const top = stack[0];

  const swipe = useCallback((dir: "like" | "skip") => {
    setExiting(dir);
    window.setTimeout(() => {
      setStack((prev) => {
        const current = prev[0];
        if (current) {
          setLastAction(dir);
          setSnack(
            dir === "like"
              ? `"${current.title}" ajoutée à tes envies ❤ (démo)`
              : `"${current.title}" passée → suivante (démo)`,
          );
        }
        return prev.slice(1);
      });
      setExiting(null);
    }, 280);
  }, []);

  const reset = useCallback(() => {
    setStack(DECK);
    setLastAction(null);
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
          Missions pour toi
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
          {stack.length} restantes
        </Typography>
      </Stack>

      <Box sx={{ position: "relative", height: 280, mb: 2 }}>
        {stack.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ height: "100%", color: "text.secondary" }}
          >
            <Typography sx={{ fontWeight: 700 }}>Plus de missions à explorer 🎉</Typography>
            <IconButton
              onClick={() => {
                reset();
                setSnack("Deck rechargé avec de nouvelles suggestions (démo)");
              }}
              sx={{ bgcolor: dk.surfaceAccent, color: dk.surfaceStrong }}
              aria-label="Recharger"
            >
              <Replay />
            </IconButton>
          </Stack>
        ) : (
          stack
            .slice(0, 3)
            .map((m, i) => {
              const isTop = i === 0;
              const offset = i * 8;
              return (
                <Box
                  key={m.id}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    transform:
                      isTop && exiting
                        ? exiting === "like"
                          ? "translateX(120%) rotate(18deg)"
                          : "translateX(-120%) rotate(-18deg)"
                        : `translateY(${offset}px) scale(${1 - i * 0.04})`,
                    opacity: isTop && exiting ? 0 : 1,
                    transition: "transform 0.28s ease, opacity 0.28s ease",
                    zIndex: 10 - i,
                    borderRadius: 3,
                    background: isTop
                      ? `linear-gradient(160deg, ${dk.surfaceStrong} 0%, ${dk.tertiary} 100%)`
                      : alpha(dk.surfaceStrong, 0.5 - i * 0.15),
                    color: dk.white,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: `0 12px 32px ${alpha(dk.surfaceStrong, 0.18)}`,
                  }}
                >
                  {isTop ? (
                    <>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {m.title}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5, opacity: 0.9 }}>
                            <Place sx={{ fontSize: 16 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {m.org} · {m.city}
                            </Typography>
                          </Stack>
                        </Box>
                        <Box
                          sx={{
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 9999,
                            bgcolor: alpha(dk.white, 0.2),
                            border: `1px solid ${alpha(dk.white, 0.4)}`,
                            fontWeight: 800,
                            fontSize: 13,
                          }}
                        >
                          {m.match}% match
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        {m.tags.map((t) => (
                          <Chip
                            key={t}
                            label={t}
                            size="small"
                            sx={{
                              bgcolor: alpha(dk.white, 0.18),
                              color: dk.white,
                              fontWeight: 700,
                              border: `1px solid ${alpha(dk.white, 0.3)}`,
                            }}
                          />
                        ))}
                      </Stack>
                    </>
                  ) : null}
                </Box>
              );
            })
        )}
      </Box>

      {stack.length > 0 ? (
        <Stack direction="row" justifyContent="center" spacing={3}>
          <IconButton
            onClick={() => swipe("skip")}
            sx={{
              bgcolor: dk.white,
              border: `2px solid ${alpha(dk.border, 0.3)}`,
              color: dk.textMuted,
              width: 56,
              height: 56,
              "&:hover": { bgcolor: alpha(dk.border, 0.08) },
            }}
            aria-label="Passer"
          >
            <Close />
          </IconButton>
          <IconButton
            onClick={() => swipe("like")}
            sx={{
              bgcolor: dk.tertiary,
              color: dk.white,
              width: 56,
              height: 56,
              "&:hover": { bgcolor: alpha(dk.tertiary, 0.85) },
            }}
            aria-label="J'aime"
          >
            <Favorite />
          </IconButton>
        </Stack>
      ) : null}
      {lastAction ? (
        <Typography
          variant="caption"
          sx={{
            mt: 1.5,
            display: "block",
            textAlign: "center",
            color: lastAction === "like" ? "tertiary.main" : "text.secondary",
            fontWeight: 700,
          }}
        >
          {lastAction === "like" ? "Mission ajoutée à tes envies ❤" : "Mission passée"}
        </Typography>
      ) : null}
      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2400}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
