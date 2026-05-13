"use client";

import {
  AccessTime,
  CalendarMonth,
  Check,
  ExpandLess,
  ExpandMore,
  Schedule,
  type SvgIconComponent,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";

type Status = "past" | "current" | "upcoming";

type Commitment = {
  id: string;
  title: string;
  org: string;
  dates: string;
  hours: string;
  status: Status;
  skills: string[];
  description: string;
};

const ITEMS: Commitment[] = [
  {
    id: "c1",
    title: "Atelier conversation FLE",
    org: "Singa France",
    dates: "à partir du 22 mai",
    hours: "2h / semaine",
    status: "upcoming",
    skills: ["Médiation", "Langues"],
    description:
      "Animer un atelier de conversation en français avec des personnes nouvellement arrivées.",
  },
  {
    id: "c2",
    title: "Maraude hebdomadaire",
    org: "Les Petits Frères",
    dates: "depuis février",
    hours: "+86h cumulées",
    status: "current",
    skills: ["Écoute active", "Logistique"],
    description:
      "Tournée de distribution alimentaire chaque samedi soir, équipe de 4 bénévoles.",
  },
  {
    id: "c3",
    title: "Régie festival local",
    org: "Coop Culture",
    dates: "9 → 12 mars",
    hours: "32h",
    status: "past",
    skills: ["Organisation", "Communication"],
    description:
      "Coordination logistique des bénévoles et accueil du public pendant 4 jours.",
  },
  {
    id: "c4",
    title: "Ramassage berges",
    org: "Surfrider FR",
    dates: "5 février",
    hours: "4h",
    status: "past",
    skills: ["Sensibilisation"],
    description:
      "Action ponctuelle de nettoyage avec une cinquantaine de bénévoles.",
  },
];

const STATUS_META: Record<
  Status,
  { label: string; tint: keyof Pick<DesignKitPalette, "primaryLight" | "tertiaryLight" | "mint" | "surfaceMuted">; icon: SvgIconComponent }
> = {
  past: { label: "Terminé", tint: "primaryLight", icon: Check },
  current: { label: "En cours", tint: "tertiaryLight", icon: Schedule },
  upcoming: { label: "À venir", tint: "mint", icon: CalendarMonth },
};

const FILTERS: { id: "all" | Status; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "current", label: "En cours" },
  { id: "upcoming", label: "À venir" },
  { id: "past", label: "Terminés" },
];

export default function WireframeCommitmentTimeline() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [expanded, setExpanded] = useState<string | null>("c2");

  const filtered = useMemo(
    () => (filter === "all" ? ITEMS : ITEMS.filter((i) => i.status === filter)),
    [filter],
  );

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  }, []);

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <Chip
              key={f.id}
              label={f.label}
              onClick={() => setFilter(f.id)}
              sx={{
                fontWeight: 700,
                bgcolor: active ? dk.surfaceStrong : alpha(dk.border, 0.08),
                color: active ? dk.white : dk.textMuted,
                "&:hover": {
                  bgcolor: active ? dk.surfaceStrong : alpha(dk.surfaceAccent, 0.5),
                },
              }}
            />
          );
        })}
      </Stack>

      <Box
        sx={{
          position: "relative",
          pl: { xs: 5, sm: 6 },
          "&::before": {
            content: '""',
            position: "absolute",
            left: { xs: 19, sm: 23 },
            top: 8,
            bottom: 8,
            width: 2,
            bgcolor: alpha(dk.border, 0.18),
          },
        }}
      >
        <Stack spacing={2}>
          {filtered.map((item) => {
            const meta = STATUS_META[item.status];
            const Icon = meta.icon;
            const tint = dk[meta.tint];
            const isOpen = expanded === item.id;
            const isCurrent = item.status === "current";
            return (
              <Box key={item.id} sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: -29, sm: -33 },
                    top: 14,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: tint,
                    color: dk.surfaceStrong,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `3px solid ${dk.white}`,
                    boxShadow: isCurrent
                      ? `0 0 0 6px ${alpha(dk.tertiary, 0.18)}`
                      : "none",
                    "&::after": isCurrent
                      ? {
                          content: '""',
                          position: "absolute",
                          inset: -10,
                          borderRadius: "50%",
                          border: `2px solid ${alpha(dk.tertiary, 0.4)}`,
                          animation: "wf-pulse 1.6s infinite",
                          "@keyframes wf-pulse": {
                            "0%": { opacity: 1, transform: "scale(0.8)" },
                            "100%": { opacity: 0, transform: "scale(1.2)" },
                          },
                        }
                      : undefined,
                  }}
                >
                  <Icon sx={{ fontSize: 14 }} />
                </Box>

                <Box
                  sx={{
                    bgcolor: dk.white,
                    border: `1px solid ${alpha(dk.border, 0.18)}`,
                    borderRadius: 2.5,
                    boxShadow: isOpen
                      ? `0 8px 28px ${alpha(dk.surfaceStrong, 0.12)}`
                      : `0 2px 12px ${alpha(dk.surfaceStrong, 0.05)}`,
                    transition: "box-shadow 0.2s ease",
                    overflow: "hidden",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                      p: 1.75,
                      cursor: "pointer",
                      "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.2) },
                    }}
                    onClick={() => toggle(item.id)}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "wrap" }}>
                        <Typography sx={{ fontWeight: 800, color: "primary.main" }} noWrap>
                          {item.title}
                        </Typography>
                        <Chip
                          label={meta.label}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 10,
                            fontWeight: 800,
                            bgcolor: tint,
                            color: dk.surfaceStrong,
                            textTransform: "uppercase",
                          }}
                        />
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mt: 0.5, color: "text.secondary", flexWrap: "wrap" }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {item.org}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <CalendarMonth sx={{ fontSize: 13 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {item.dates}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <AccessTime sx={{ fontSize: 13 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {item.hours}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                    <IconButton size="small" aria-label={isOpen ? "Replier" : "Déplier"}>
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Stack>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        px: 1.75,
                        pb: 1.75,
                        pt: 0,
                        borderTop: `1px dashed ${alpha(dk.border, 0.2)}`,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontWeight: 500, mt: 1.25 }}
                      >
                        {item.description}
                      </Typography>
                      <Stack direction="row" spacing={0.75} sx={{ mt: 1.25, flexWrap: "wrap", gap: 0.75 }}>
                        {item.skills.map((s) => (
                          <Chip
                            key={s}
                            label={s}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: 11,
                              fontWeight: 700,
                              bgcolor: alpha(dk.primaryLight, 0.65),
                              color: "primary.main",
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Collapse>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
