"use client";

import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

export type AvatarStackMember = { id: string; initials: string; name: string };

const MEMBERS: AvatarStackMember[] = [
  { id: "1", initials: "EM", name: "Élise" },
  { id: "2", initials: "TL", name: "Théo" },
  { id: "3", initials: "NA", name: "Nora" },
  { id: "4", initials: "JM", name: "Julien" },
  { id: "5", initials: "SP", name: "Sara" },
  { id: "6", initials: "CB", name: "Camille" },
  { id: "7", initials: "RV", name: "Raph" },
  { id: "8", initials: "LM", name: "Léa" },
  { id: "9", initials: "PD", name: "Paul" },
];

const MAX_VISIBLE = 5;

/** Ligne d’avatars chevauchés sans carte (fiche mission, lignes équipe…) */
export function WireframeAvatarStackInline({
  members,
  maxVisible = MAX_VISIBLE,
  size = 36,
}: {
  members: AvatarStackMember[];
  maxVisible?: number;
  size?: number;
}) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const visible = members.slice(0, maxVisible);
  const overflow = Math.max(0, members.length - maxVisible);
  const overlap = Math.round(size * -0.3);
  const borderW = Math.max(2, Math.round(size * 0.08));

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {visible.map((m, i) => (
        <Tooltip key={m.id} title={m.name} arrow>
          <Box
            sx={{
              width: size,
              height: size,
              borderRadius: "50%",
              bgcolor: dk.surfaceStrong,
              color: dk.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: Math.max(10, Math.round(size * 0.36)),
              border: `${borderW}px solid ${dk.white}`,
              marginLeft: i === 0 ? 0 : overlap,
              zIndex: visible.length - i,
            }}
          >
            {m.initials}
          </Box>
        </Tooltip>
      ))}
      {overflow > 0 ? (
        <Tooltip title={members.slice(maxVisible).map((m) => m.name).join(", ")} arrow>
          <Box
            sx={{
              width: size,
              height: size,
              borderRadius: "50%",
              bgcolor: alpha(dk.border, 0.2),
              color: dk.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 11,
              border: `${borderW}px solid ${dk.white}`,
              marginLeft: overlap,
            }}
          >
            +{overflow}
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
}

export default function WireframeAvatarStack() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [members, setMembers] = useState<AvatarStackMember[]>(MEMBERS);
  const [joined, setJoined] = useState(false);

  const visible = members.slice(0, MAX_VISIBLE);
  const overflow = Math.max(0, members.length - MAX_VISIBLE);

  const toggleJoin = useCallback(() => {
    setJoined((prev) => {
      const next = !prev;
      setMembers((m) =>
        next
          ? [...m, { id: "me", initials: "EM", name: "Toi" }]
          : m.filter((x) => x.id !== "me"),
      );
      return next;
    });
  }, []);

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Équipe maraude · Petits Frères
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {members.length} bénévoles engagés
          </Typography>
        </Box>
        <Button
          startIcon={joined ? null : <Add />}
          disableElevation
          onClick={toggleJoin}
          sx={{
            borderRadius: 9999,
            textTransform: "none",
            fontWeight: 800,
            px: 2.5,
            bgcolor: joined ? dk.surfaceAccent : dk.surfaceStrong,
            color: joined ? dk.surfaceStrong : dk.white,
            "&:hover": {
              bgcolor: joined ? darken(dk.surfaceAccent, 0.05) : darken(dk.surfaceStrong, 0.1),
            },
          }}
        >
          {joined ? "Inscrit·e ✓" : "Rejoindre"}
        </Button>
      </Stack>

      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        {visible.map((m, i) => (
          <Tooltip key={m.id} title={m.name} arrow>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: m.id === "me" ? dk.tertiary : dk.surfaceStrong,
                color: dk.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 13,
                border: `3px solid ${dk.white}`,
                marginLeft: i === 0 ? 0 : "-12px",
                cursor: "pointer",
                transition: "transform 0.15s ease, z-index 0s",
                zIndex: visible.length - i,
                "&:hover": {
                  transform: "translateY(-3px) scale(1.08)",
                  zIndex: 50,
                },
              }}
            >
              {m.initials}
            </Box>
          </Tooltip>
        ))}
        {overflow > 0 ? (
          <Tooltip
            title={members.slice(MAX_VISIBLE).map((m) => m.name).join(", ")}
            arrow
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: alpha(dk.border, 0.2),
                color: dk.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 12,
                border: `3px solid ${dk.white}`,
                marginLeft: "-12px",
                cursor: "pointer",
              }}
            >
              +{overflow}
            </Box>
          </Tooltip>
        ) : null}
      </Box>
    </Box>
  );
}
