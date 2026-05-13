"use client";

import {
  ArrowForward,
  CalendarMonth,
  CheckCircle,
  Download,
  Edit,
  FilterList,
  HourglassEmpty,
  Notifications,
  PlayArrow,
  Refresh,
  Search,
  Sort,
  Star,
  StarBorder,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Fragment, useMemo, useState } from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";

type TabKey = "postulations" | "active" | "upcoming" | "done";

type Activity = {
  id: string;
  tab: TabKey;
  title: string;
  org: string;
  orgInitials: string;
  orgColor: string;
  location: string;
  dateLabel: string;
  // Tab-specific extras
  waitingDays?: number;
  matchRate?: number;
  nextSessionLabel?: string;
  progress?: { current: number; total: number; label: string };
  countdownDays?: number;
  reminderLabel?: string;
  teammates?: number;
  rating?: number;
  feedback?: string;
  certificateReady?: boolean;
};

type Recommendation = {
  id: string;
  title: string;
  org: string;
  match: number;
  tag: string;
};

const STATUS_META = (dk: DesignKitPalette): Record<
  TabKey,
  { label: string; color: string; lightBg: string; textOnColor: string }
> => ({
  postulations: {
    label: "En attente",
    color: dk.tertiary,
    lightBg: alpha(dk.tertiary, 0.12),
    textOnColor: dk.white,
  },
  active: {
    label: "Active",
    color: dk.surfaceStrong,
    lightBg: alpha(dk.surfaceStrong, 0.1),
    textOnColor: dk.white,
  },
  upcoming: {
    label: "Planifiée",
    color: dk.mint,
    lightBg: alpha(dk.mint, 0.25),
    textOnColor: dk.text,
  },
  done: {
    label: "Terminée",
    color: alpha("#000000", 0.45),
    lightBg: alpha("#000000", 0.06),
    textOnColor: "#ffffff",
  },
});

const TABS: { key: TabKey; label: string }[] = [
  { key: "postulations", label: "Postulations" },
  { key: "active", label: "En cours" },
  { key: "upcoming", label: "À venir" },
  { key: "done", label: "Terminées" },
];

const ORG_COLORS = ["#E63946", "#2A9D8F", "#F4A261", "#5A189A", "#0077B6"];

const ACTIVITIES: Activity[] = [
  {
    id: "p1",
    tab: "postulations",
    title: "Distribution Centre-Ville",
    org: "Restos du Cœur",
    orgInitials: "RC",
    orgColor: ORG_COLORS[0],
    location: "Paris 11e",
    dateLabel: "28 – 29 avril",
    waitingDays: 3,
    matchRate: 0.4,
  },
  {
    id: "p2",
    tab: "postulations",
    title: "Maraude hivernale",
    org: "Emmaüs Solidarité",
    orgInitials: "ES",
    orgColor: ORG_COLORS[1],
    location: "Paris 19e",
    dateLabel: "Tous les ven. de 18h à 23h",
    waitingDays: 1,
    matchRate: 0.7,
  },
  {
    id: "a1",
    tab: "active",
    title: "Atelier d'écriture",
    org: "Biblio St-Denis",
    orgInitials: "BS",
    orgColor: ORG_COLORS[2],
    location: "Saint-Denis",
    dateLabel: "Hebdo · mer. 18h–20h",
    nextSessionLabel: "Prochaine séance · mer. 14 mai",
    progress: { current: 7, total: 12, label: "séances faites" },
  },
  {
    id: "a2",
    tab: "active",
    title: "Soutien scolaire CM2",
    org: "Apprentis d'Auteuil",
    orgInitials: "AA",
    orgColor: ORG_COLORS[3],
    location: "Paris 16e",
    dateLabel: "Hebdo · mar. 17h–19h",
    nextSessionLabel: "Prochaine séance · mar. 13 mai",
    progress: { current: 4, total: 10, label: "séances faites" },
  },
  {
    id: "a3",
    tab: "active",
    title: "Permanence accueil",
    org: "Secours Populaire",
    orgInitials: "SP",
    orgColor: ORG_COLORS[4],
    location: "Lyon 7e",
    dateLabel: "Bi-mensuel · sam. matin",
    nextSessionLabel: "Prochaine permanence · sam. 17 mai",
    progress: { current: 2, total: 6, label: "permanences faites" },
  },
  {
    id: "u1",
    tab: "upcoming",
    title: "Forum solidaire",
    org: "Mairie de Lyon",
    orgInitials: "ML",
    orgColor: ORG_COLORS[4],
    location: "Lyon 3e",
    dateLabel: "16 mai · 9h – 17h",
    countdownDays: 3,
    reminderLabel: "Rappel le 15 mai à 18h",
    teammates: 5,
  },
  {
    id: "u2",
    tab: "upcoming",
    title: "Camp d'été · animation",
    org: "Scouts de France",
    orgInitials: "SF",
    orgColor: ORG_COLORS[1],
    location: "Annecy",
    dateLabel: "8 – 12 juin",
    countdownDays: 26,
    reminderLabel: "Briefing visio · 5 juin 19h",
    teammates: 12,
  },
  {
    id: "u3",
    tab: "upcoming",
    title: "Distribution alim. mensuelle",
    org: "Restos du Cœur",
    orgInitials: "RC",
    orgColor: ORG_COLORS[0],
    location: "Paris 11e",
    dateLabel: "26 – 28 mai",
    countdownDays: 13,
    reminderLabel: "Rappel le 25 mai",
    teammates: 8,
  },
  {
    id: "u4",
    tab: "upcoming",
    title: "Formation premiers secours",
    org: "Croix-Rouge",
    orgInitials: "CR",
    orgColor: ORG_COLORS[0],
    location: "Paris 14e",
    dateLabel: "30 mai – 1 juin",
    countdownDays: 17,
    reminderLabel: "Matériel à apporter",
    teammates: 14,
  },
  {
    id: "d1",
    tab: "done",
    title: "Maraude de soir",
    org: "Emmaüs Solidarité",
    orgInitials: "ES",
    orgColor: ORG_COLORS[1],
    location: "Paris 19e",
    dateLabel: "22 mars",
    rating: 5,
    feedback: "Excellente présence et beaucoup d'écoute.",
    certificateReady: true,
  },
  {
    id: "d2",
    tab: "done",
    title: "Anim. enfants vacances",
    org: "Mairie de Lyon",
    orgInitials: "ML",
    orgColor: ORG_COLORS[4],
    location: "Lyon 3e",
    dateLabel: "10 – 14 février",
    rating: 4,
    feedback: "Très bonne énergie, à reprendre l'an prochain.",
    certificateReady: true,
  },
  {
    id: "d3",
    tab: "done",
    title: "Préparation festival",
    org: "Mairie de Lyon",
    orgInitials: "ML",
    orgColor: ORG_COLORS[4],
    location: "Lyon 3e",
    dateLabel: "4 – 8 avril",
    rating: 5,
    feedback: "Sens de l'organisation remarquable.",
    certificateReady: true,
  },
  {
    id: "d4",
    tab: "done",
    title: "Distribution alim. d'urgence",
    org: "Restos du Cœur",
    orgInitials: "RC",
    orgColor: ORG_COLORS[0],
    location: "Paris 11e",
    dateLabel: "12 janvier",
    feedback: "Évaluation en attente",
    certificateReady: false,
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  { id: "r1", title: "Maraude solidarité", org: "Cœur Resto", match: 92, tag: "Hebdo · soir" },
  { id: "r2", title: "Atelier numérique seniors", org: "Emmaüs Connect", match: 87, tag: "Mensuel · matin" },
  { id: "r3", title: "Coup de main événement", org: "Secours Pop.", match: 81, tag: "Ponctuel · samedi" },
];

const SORT_OPTIONS = ["Plus récent", "Plus proche", "Plus engageant"] as const;

function ProgressBar({
  ratio,
  color,
  bg,
}: {
  ratio: number;
  color: string;
  bg: string;
}) {
  return (
    <Box
      sx={{
        height: 6,
        borderRadius: 999,
        bgcolor: bg,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: `${Math.max(0, Math.min(1, ratio)) * 100}%`,
          bgcolor: color,
          transition: "width 0.4s ease",
        }}
      />
    </Box>
  );
}

function ActivityCardShell({
  children,
  accent,
  dk,
}: {
  children: React.ReactNode;
  accent: string;
  dk: DesignKitPalette;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 2.5,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.15)}`,
        boxShadow: `0 1px 2px ${alpha(dk.surfaceStrong, 0.04)}`,
        overflow: "hidden",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: `0 8px 22px ${alpha(dk.surfaceStrong, 0.08)}`,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 4,
          bgcolor: accent,
        }}
      />
      <Box sx={{ p: { xs: 1.5, sm: 2 }, pl: { xs: 2, sm: 2.5 } }}>{children}</Box>
    </Box>
  );
}

function OrgAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        bgcolor: alpha(color, 0.15),
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 13,
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  );
}

function StatusPill({
  label,
  color,
  textColor,
  icon,
}: {
  label: string;
  color: string;
  textColor: string;
  icon?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.25,
        borderRadius: 999,
        bgcolor: color,
        color: textColor,
        fontSize: 10.5,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        flexShrink: 0,
      }}
    >
      {icon ? (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            "& svg": { fontSize: 12 },
          }}
        >
          {icon}
        </Box>
      ) : null}
      {label}
    </Box>
  );
}

function CardHeader({
  activity,
  trailing,
  dk,
}: {
  activity: Activity;
  trailing: React.ReactNode;
  dk: DesignKitPalette;
}) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
      <OrgAvatar initials={activity.orgInitials} color={activity.orgColor} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 14,
            color: dk.text,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {activity.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            fontSize: 11,
            display: "block",
            mt: 0.25,
          }}
        >
          {activity.org} · 📍 {activity.location} · {activity.dateLabel}
        </Typography>
      </Box>
      {trailing}
    </Stack>
  );
}

function CardActions({
  primary,
  secondary,
  dk,
}: {
  primary: { label: string; icon?: React.ReactNode };
  secondary?: { label: string; danger?: boolean };
  dk: DesignKitPalette;
}) {
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button
        size="small"
        startIcon={primary.icon}
        sx={{
          textTransform: "none",
          fontWeight: 700,
          fontSize: 11.5,
          color: dk.white,
          bgcolor: dk.surfaceStrong,
          px: 1.5,
          minHeight: 28,
          borderRadius: 1.25,
          "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.85) },
        }}
      >
        {primary.label}
      </Button>
      {secondary ? (
        <Button
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: 11.5,
            color: secondary.danger ? dk.tertiary : "text.secondary",
            border: `1px solid ${alpha(secondary.danger ? dk.tertiary : dk.border, 0.3)}`,
            px: 1.5,
            minHeight: 28,
            borderRadius: 1.25,
            "&:hover": {
              bgcolor: alpha(secondary.danger ? dk.tertiary : dk.surfaceMuted, 0.15),
            },
          }}
        >
          {secondary.label}
        </Button>
      ) : null}
    </Stack>
  );
}

function InfoBox({
  children,
  dk,
}: {
  children: React.ReactNode;
  dk: DesignKitPalette;
}) {
  return (
    <Box
      sx={{
        bgcolor: alpha(dk.surfaceMuted, 0.18),
        borderRadius: 1.5,
        p: 1.25,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      {children}
    </Box>
  );
}

function PostulationCard({ activity, dk }: { activity: Activity; dk: DesignKitPalette }) {
  const status = STATUS_META(dk).postulations;
  return (
    <ActivityCardShell accent={status.color} dk={dk}>
      <CardHeader
        activity={activity}
        dk={dk}
        trailing={
          <StatusPill
            label={`En attente · ${activity.waitingDays}j`}
            color={status.color}
            textColor={status.textOnColor}
            icon={<HourglassEmpty />}
          />
        }
      />
      <InfoBox dk={dk}>
        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11 }}>
          ⏱️ Réponse typique en 3 à 5 jours
        </Typography>
        <ProgressBar
          ratio={activity.matchRate ?? 0}
          color={status.color}
          bg={alpha(status.color, 0.15)}
        />
        <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10.5, fontWeight: 600 }}>
          {Math.round((activity.matchRate ?? 0) * 100)}% des candidats déjà notifiés
        </Typography>
      </InfoBox>
      <CardActions
        dk={dk}
        primary={{ label: "Voir détails", icon: <ArrowForward sx={{ fontSize: "14px !important" }} /> }}
        secondary={{ label: "Annuler", danger: true }}
      />
    </ActivityCardShell>
  );
}

function ActiveCard({ activity, dk }: { activity: Activity; dk: DesignKitPalette }) {
  const status = STATUS_META(dk).active;
  const ratio = activity.progress
    ? activity.progress.current / activity.progress.total
    : 0;
  return (
    <ActivityCardShell accent={status.color} dk={dk}>
      <CardHeader
        activity={activity}
        dk={dk}
        trailing={
          <StatusPill
            label="Active"
            color={status.color}
            textColor={status.textOnColor}
            icon={<PlayArrow />}
          />
        }
      />
      <InfoBox dk={dk}>
        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11, color: "primary.main" }}>
          {activity.nextSessionLabel}
        </Typography>
        <ProgressBar
          ratio={ratio}
          color={status.color}
          bg={alpha(status.color, 0.12)}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10.5, fontWeight: 700 }}>
            {activity.progress?.current}/{activity.progress?.total} {activity.progress?.label}
          </Typography>
          <Typography variant="caption" sx={{ color: "primary.main", fontSize: 10.5, fontWeight: 800 }}>
            {Math.round(ratio * 100)}%
          </Typography>
        </Stack>
      </InfoBox>
      <CardActions
        dk={dk}
        primary={{ label: "Pointer ma présence", icon: <CheckCircle sx={{ fontSize: "14px !important" }} /> }}
        secondary={{ label: "Voir détails" }}
      />
    </ActivityCardShell>
  );
}

function UpcomingCard({ activity, dk }: { activity: Activity; dk: DesignKitPalette }) {
  const status = STATUS_META(dk).upcoming;
  return (
    <ActivityCardShell accent={status.color} dk={dk}>
      <CardHeader
        activity={activity}
        dk={dk}
        trailing={
          <StatusPill
            label={`Dans ${activity.countdownDays}j`}
            color={status.color}
            textColor={status.textOnColor}
            icon={<CalendarMonth />}
          />
        }
      />
      <InfoBox dk={dk}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Notifications sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11 }}>
            {activity.reminderLabel}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ display: "flex" }}>
            {Array.from({ length: Math.min(3, activity.teammates ?? 0) }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  bgcolor: ORG_COLORS[(i + activity.id.length) % ORG_COLORS.length],
                  border: `2px solid ${dk.white}`,
                  ml: i === 0 ? 0 : -0.75,
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10.5, fontWeight: 600 }}>
            Équipe · {activity.teammates} bénévoles confirmés
          </Typography>
        </Stack>
      </InfoBox>
      <CardActions
        dk={dk}
        primary={{ label: "Préparer", icon: <Edit sx={{ fontSize: "14px !important" }} /> }}
        secondary={{ label: "Annuler", danger: true }}
      />
    </ActivityCardShell>
  );
}

function DoneCard({ activity, dk }: { activity: Activity; dk: DesignKitPalette }) {
  const status = STATUS_META(dk).done;
  return (
    <ActivityCardShell accent={status.color} dk={dk}>
      <CardHeader
        activity={activity}
        dk={dk}
        trailing={
          <StatusPill
            label="Terminée"
            color={status.color}
            textColor={status.textOnColor}
            icon={<CheckCircle />}
          />
        }
      />
      <InfoBox dk={dk}>
        {typeof activity.rating === "number" ? (
          <Stack direction="row" spacing={0.25} alignItems="center">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < (activity.rating ?? 0);
              return filled ? (
                <Star key={i} sx={{ fontSize: 14, color: "#F4B400" }} />
              ) : (
                <StarBorder key={i} sx={{ fontSize: 14, color: alpha(dk.text, 0.3) }} />
              );
            })}
            <Typography
              variant="caption"
              sx={{ ml: 0.5, fontWeight: 700, fontSize: 11, color: "text.secondary" }}
            >
              Évaluation de l'asso
            </Typography>
          </Stack>
        ) : null}
        <Typography
          variant="caption"
          sx={{ fontStyle: "italic", color: dk.text, fontSize: 11, fontWeight: 600 }}
        >
          « {activity.feedback} »
        </Typography>
      </InfoBox>
      <CardActions
        dk={dk}
        primary={
          activity.certificateReady
            ? { label: "Télécharger l'attestation", icon: <Download sx={{ fontSize: "14px !important" }} /> }
            : { label: "Évaluer l'expérience", icon: <Star sx={{ fontSize: "14px !important" }} /> }
        }
        secondary={activity.certificateReady ? { label: "Évaluer" } : undefined}
      />
    </ActivityCardShell>
  );
}

function SmartEmptyState({ dk }: { dk: DesignKitPalette }) {
  return (
    <Box
      sx={{
        borderRadius: 2.5,
        bgcolor: alpha(dk.surfaceMuted, 0.18),
        border: `1px dashed ${alpha(dk.border, 0.25)}`,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            bgcolor: alpha(dk.tertiary, 0.18),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          👀
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, color: "primary.main", fontSize: 15 }}>
            Personne ne t'attend… pour l'instant !
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 600, fontSize: 12 }}
          >
            On dirait que t'es dispo. Voici 3 missions qui collent à ton profil :
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1}>
        {RECOMMENDATIONS.map((rec) => (
          <Stack
            key={rec.id}
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{
              bgcolor: dk.canvas,
              border: `1px solid ${alpha(dk.border, 0.12)}`,
              borderRadius: 1.75,
              px: 1.5,
              py: 1,
              cursor: "pointer",
              transition: "all 0.15s ease",
              "&:hover": {
                borderColor: alpha(dk.tertiary, 0.5),
                bgcolor: alpha(dk.tertiary, 0.04),
                transform: "translateX(2px)",
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: alpha(dk.surfaceStrong, 0.08),
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontWeight: 900,
                fontSize: 13,
              }}
            >
              {rec.match}
              <Typography component="span" sx={{ fontSize: 9, ml: 0.1, fontWeight: 800 }}>
                %
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: dk.text, lineHeight: 1.2 }}>
                {rec.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontWeight: 600, fontSize: 11 }}
              >
                {rec.org} · {rec.tag}
              </Typography>
            </Box>
            <ArrowForward sx={{ fontSize: 16, color: "text.secondary" }} />
          </Stack>
        ))}
      </Stack>

      <Button
        size="small"
        endIcon={<ArrowForward sx={{ fontSize: "14px !important" }} />}
        sx={{
          mt: 2,
          textTransform: "none",
          fontWeight: 800,
          color: dk.white,
          bgcolor: dk.surfaceStrong,
          px: 2,
          py: 0.75,
          borderRadius: 1.5,
          fontSize: 12,
          "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.85) },
        }}
      >
        Découvrir toutes les missions
      </Button>
    </Box>
  );
}

function StatsStrip({ dk, counts }: { dk: DesignKitPalette; counts: Record<TabKey, number> }) {
  const totalDays = 78;
  const totalAssos = 4;
  const totalMissions =
    counts.postulations + counts.active + counts.upcoming + counts.done;
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      sx={{
        bgcolor: alpha(dk.surfaceMuted, 0.18),
        borderRadius: 2,
        p: { xs: 1, sm: 1.25 },
      }}
    >
      <Box>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: 10 }}>
          ENGAGEMENTS
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: 18, color: "primary.main", lineHeight: 1 }}>
          {totalMissions}
        </Typography>
      </Box>
      <Box sx={{ width: 1, height: 28, bgcolor: alpha(dk.border, 0.25) }} />
      <Box>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: 10 }}>
          HEURES
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: 18, color: dk.text, lineHeight: 1 }}>
          {totalDays}h
        </Typography>
      </Box>
      <Box sx={{ width: 1, height: 28, bgcolor: alpha(dk.border, 0.25) }} />
      <Box>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: 10 }}>
          ASSOS
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: 18, color: dk.text, lineHeight: 1 }}>
          {totalAssos}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }} />
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: 999,
          bgcolor: alpha(dk.surfaceStrong, 0.1),
          color: "primary.main",
        }}
      >
        <TrendingUp sx={{ fontSize: 14 }} />
        <Typography variant="caption" sx={{ fontWeight: 800, fontSize: 11 }}>
          +15% vs mois dernier
        </Typography>
      </Box>
    </Stack>
  );
}

export default function WireframeActivitiesHub() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const meta = useMemo(() => STATUS_META(dk), [dk]);

  const [active, setActive] = useState<TabKey>("upcoming");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>("Plus proche");

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = {
      postulations: 0,
      active: 0,
      upcoming: 0,
      done: 0,
    };
    ACTIVITIES.forEach((a) => {
      c[a.tab] += 1;
    });
    return c;
  }, []);

  const items = useMemo(
    () => ACTIVITIES.filter((a) => a.tab === active),
    [active],
  );

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 1.5, sm: 2.5 },
        display: "flex",
        flexDirection: "column",
        gap: 1.75,
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: "primary.main" }}>
            Mes activités
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Tout ton parcours bénévole, en un coup d'œil
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{
            color: "text.secondary",
            border: `1px solid ${alpha(dk.border, 0.25)}`,
            borderRadius: 999,
            "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.3) },
          }}
          aria-label="Synchroniser"
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Stack>

      <StatsStrip dk={dk} counts={counts} />

      {/* Tabs */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          borderBottom: `1px solid ${alpha(dk.border, 0.15)}`,
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {TABS.map((t) => {
          const isActive = active === t.key;
          const status = meta[t.key];
          return (
            <Box
              key={t.key}
              role="tab"
              tabIndex={0}
              onClick={() => setActive(t.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(t.key);
                }
              }}
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: { xs: 1, sm: 1.5 },
                py: 1,
                cursor: "pointer",
                userSelect: "none",
                color: isActive ? "primary.main" : "text.secondary",
                fontWeight: isActive ? 800 : 700,
                fontSize: 13,
                whiteSpace: "nowrap",
                outline: "none",
                "&:focus-visible": {
                  boxShadow: `inset 0 0 0 2px ${alpha(dk.tertiary, 0.5)}`,
                  borderRadius: 1,
                },
                "&::after": isActive
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 8,
                      right: 8,
                      bottom: -1,
                      height: 3,
                      borderRadius: 999,
                      bgcolor: dk.surfaceStrong,
                    }
                  : undefined,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: counts[t.key] > 0 ? status.color : alpha(dk.text, 0.18),
                }}
              />
              {t.label}
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 22,
                  height: 20,
                  px: 0.75,
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  bgcolor: isActive
                    ? alpha(dk.surfaceStrong, 0.12)
                    : alpha(dk.surfaceMuted, 0.35),
                  color: isActive ? "primary.main" : "text.secondary",
                }}
              >
                {counts[t.key]}
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* Toolbar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.25,
            py: 0.5,
            borderRadius: 999,
            bgcolor: alpha(dk.surfaceMuted, 0.25),
            color: "text.secondary",
            flex: 1,
            maxWidth: { xs: "100%", sm: 280 },
          }}
        >
          <Search sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12 }}>
            Chercher une mission, une asso…
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              border: `1px solid ${alpha(dk.border, 0.25)}`,
              fontSize: 11.5,
              fontWeight: 700,
              color: "text.secondary",
              cursor: "pointer",
              "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.25) },
            }}
            role="button"
            tabIndex={0}
            onClick={() => {
              const idx = SORT_OPTIONS.indexOf(sort);
              setSort(SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length]);
            }}
          >
            <Sort sx={{ fontSize: 14 }} />
            {sort}
          </Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              border: `1px solid ${alpha(dk.border, 0.25)}`,
              fontSize: 11.5,
              fontWeight: 700,
              color: "text.secondary",
              cursor: "pointer",
              "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.25) },
            }}
          >
            <FilterList sx={{ fontSize: 14 }} />
            Filtres
          </Box>
        </Stack>
      </Stack>

      {/* Content */}
      <Box>
        {items.length === 0 ? (
          <SmartEmptyState dk={dk} />
        ) : (
          <Stack spacing={1.25}>
            {items.map((a) => (
              <Fragment key={a.id}>
                {a.tab === "postulations" ? (
                  <PostulationCard activity={a} dk={dk} />
                ) : a.tab === "active" ? (
                  <ActiveCard activity={a} dk={dk} />
                ) : a.tab === "upcoming" ? (
                  <UpcomingCard activity={a} dk={dk} />
                ) : (
                  <DoneCard activity={a} dk={dk} />
                )}
              </Fragment>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
