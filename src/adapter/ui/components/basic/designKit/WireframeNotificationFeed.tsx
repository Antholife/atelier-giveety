"use client";

import {
  Bolt,
  Campaign,
  Chat,
  Close,
  DoneAll,
  EmojiEvents,
  NotificationsActive,
  type SvgIconComponent,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";

type NotifKind = "skill" | "message" | "event" | "award";

type Notif = {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const ICON_MAP: Record<NotifKind, SvgIconComponent> = {
  skill: Bolt,
  message: Chat,
  event: Campaign,
  award: EmojiEvents,
};

const TINT_MAP: Record<NotifKind, keyof Pick<DesignKitPalette, "primaryLight" | "tertiaryLight" | "mint" | "surfaceMuted">> = {
  skill: "tertiaryLight",
  message: "primaryLight",
  event: "surfaceMuted",
  award: "mint",
};

const INITIAL: Notif[] = [
  {
    id: "n1",
    kind: "skill",
    title: "Nouvelle compétence certifiée",
    body: "Camille (manager) t’a attesté la compétence « Médiation ».",
    time: "il y a 2 min",
    read: false,
  },
  {
    id: "n2",
    kind: "message",
    title: "Message de l’asso Singa",
    body: "« Merci pour ton aide à l’atelier FLE de samedi ! »",
    time: "il y a 1 h",
    read: false,
  },
  {
    id: "n3",
    kind: "award",
    title: "Tu as débloqué un badge",
    body: "Badge « +100h » ajouté à ton profil.",
    time: "hier",
    read: false,
  },
  {
    id: "n4",
    kind: "event",
    title: "Mission proche de toi",
    body: "Maraude dimanche soir à 5 km. 3 places restantes.",
    time: "hier",
    read: true,
  },
];

export default function WireframeNotificationFeed() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL);

  const unread = useMemo(() => notifs.filter((n) => !n.read).length, [notifs]);

  const markAllRead = useCallback(() => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const reset = useCallback(() => setNotifs(INITIAL), []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
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
          background: `linear-gradient(90deg, ${alpha(dk.primaryLight, 0.5)} 0%, ${dk.white} 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Badge
            badgeContent={unread}
            color="error"
            sx={{ "& .MuiBadge-badge": { fontWeight: 800 } }}
          >
            <NotificationsActive sx={{ color: "primary.main" }} />
          </Badge>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Notifications
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Tout marquer comme lu">
            <span>
              <IconButton size="small" onClick={markAllRead} disabled={unread === 0}>
                <DoneAll fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            size="small"
            onClick={reset}
            sx={{ textTransform: "none", fontWeight: 700, color: "text.secondary" }}
          >
            Réinitialiser
          </Button>
        </Stack>
      </Stack>

      {notifs.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ fontWeight: 700, color: "text.secondary" }}>
            Tu es à jour 🎉
          </Typography>
          <Button
            size="small"
            onClick={reset}
            sx={{ mt: 1, textTransform: "none", fontWeight: 700, color: "primary.main" }}
          >
            Recharger des notifications de démo
          </Button>
        </Box>
      ) : (
        <Stack divider={<Box sx={{ borderTop: `1px solid ${alpha(dk.border, 0.1)}` }} />}>
          {notifs.map((n) => {
            const Icon = ICON_MAP[n.kind];
            const tint = dk[TINT_MAP[n.kind]];
            return (
              <Stack
                key={n.id}
                direction="row"
                alignItems="flex-start"
                spacing={2}
                sx={{
                  px: 2.5,
                  py: 1.75,
                  bgcolor: n.read ? "transparent" : alpha(dk.surfaceAccent, 0.18),
                  cursor: n.read ? "default" : "pointer",
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: n.read
                      ? alpha(dk.primaryLight, 0.3)
                      : alpha(dk.surfaceAccent, 0.3),
                  },
                }}
                onClick={() => !n.read && markRead(n.id)}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: tint,
                    color: dk.surfaceStrong,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      sx={{
                        fontWeight: n.read ? 600 : 800,
                        color: "primary.main",
                        flex: 1,
                        minWidth: 0,
                      }}
                      noWrap
                    >
                      {n.title}
                    </Typography>
                    {!n.read ? (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: dk.tertiary,
                          flexShrink: 0,
                        }}
                      />
                    ) : null}
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500, mt: 0.25 }}
                  >
                    {n.body}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: alpha(dk.textMuted, 0.8), fontWeight: 600 }}
                  >
                    {n.time}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismiss(n.id);
                  }}
                  aria-label="Fermer"
                  sx={{ color: alpha(dk.textMuted, 0.7) }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
