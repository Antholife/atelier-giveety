"use client";

import { Check, Close, Inbox } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Demand = {
  id: string;
  initials: string;
  name: string;
  mission: string;
  skills: string[];
  age: string;
};

const INITIAL: Demand[] = [
  {
    id: "d1",
    initials: "EM",
    name: "Élise Marchand",
    mission: "Atelier FLE — Singa",
    skills: ["Médiation", "Écoute active", "Animation"],
    age: "il y a 2h",
  },
  {
    id: "d2",
    initials: "TL",
    name: "Théo Lefèvre",
    mission: "Maraude — Petits Frères",
    skills: ["Logistique", "Écoute active"],
    age: "hier",
  },
  {
    id: "d3",
    initials: "NA",
    name: "Nora Aït",
    mission: "Festival — Coop Culture",
    skills: ["Communication", "Organisation"],
    age: "il y a 3 jours",
  },
];

export default function WireframeManagerInbox() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [pending, setPending] = useState<Demand[]>(INITIAL);
  const [counts, setCounts] = useState({ approved: 0, refused: 0 });

  const decide = useCallback((id: string, action: "approve" | "refuse") => {
    setPending((prev) => prev.filter((d) => d.id !== id));
    setCounts((c) => ({
      ...c,
      [action === "approve" ? "approved" : "refused"]:
        c[action === "approve" ? "approved" : "refused"] + 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setPending(INITIAL);
    setCounts({ approved: 0, refused: 0 });
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${alpha(dk.border, 0.12)}`,
          background: `linear-gradient(90deg, ${alpha(dk.tertiaryLight, 0.5)} 0%, ${dk.white} 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Badge badgeContent={pending.length} color="error">
            <Inbox sx={{ color: "primary.main" }} />
          </Badge>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Demandes d'certificat
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Chip
            size="small"
            label={`✓ ${counts.approved}`}
            sx={{ bgcolor: alpha(dk.mint, 0.6), color: dk.surfaceStrong, fontWeight: 800 }}
          />
          <Chip
            size="small"
            label={`✕ ${counts.refused}`}
            sx={{ bgcolor: alpha(dk.tertiaryLight, 0.7), color: dk.surfaceStrong, fontWeight: 800 }}
          />
        </Stack>
      </Stack>

      {pending.length === 0 ? (
        <Stack alignItems="center" spacing={1.5} sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ fontWeight: 700, color: "text.secondary" }}>
            Inbox vide — bravo, plus rien à valider 🎉
          </Typography>
          <Button
            onClick={reset}
            size="small"
            sx={{ textTransform: "none", fontWeight: 700, color: "primary.main" }}
          >
            Recharger les demandes (démo)
          </Button>
        </Stack>
      ) : (
        <Stack divider={<Box sx={{ borderTop: `1px solid ${alpha(dk.border, 0.1)}` }} />}>
          {pending.map((d) => (
            <Stack
              key={d.id}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ px: 2.5, py: 2 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  bgcolor: dk.surfaceAccent,
                  color: dk.surfaceStrong,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {d.initials}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontWeight: 800, color: "primary.main" }} noWrap>
                    {d.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    · {d.age}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
                  {d.mission}
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                  {d.skills.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      sx={{ height: 20, fontSize: 10, fontWeight: 700, bgcolor: alpha(dk.primaryLight, 0.6), color: "primary.main" }}
                    />
                  ))}
                </Stack>
              </Box>
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  onClick={() => decide(d.id, "refuse")}
                  size="small"
                  aria-label="Refuser"
                  sx={{
                    bgcolor: alpha(dk.tertiaryLight, 0.7),
                    color: dk.tertiary,
                    "&:hover": { bgcolor: dk.tertiaryLight },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => decide(d.id, "approve")}
                  size="small"
                  aria-label="Approuver"
                  sx={{
                    bgcolor: dk.surfaceStrong,
                    color: dk.white,
                    "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.85) },
                  }}
                >
                  <Check fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
