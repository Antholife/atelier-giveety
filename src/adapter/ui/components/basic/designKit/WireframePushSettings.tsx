"use client";

import {
  Email,
  NotificationsActive,
  PhoneIphone,
  Sms,
} from "@mui/icons-material";
import { Box, Stack, Switch, Typography, useTheme, type SvgIconProps } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState, type ComponentType } from "react";
import { designKitPalette } from "./designKitPalette";

type Channel = "email" | "push" | "sms";
type Topic = "newMission" | "messages" | "reminders" | "weekly";

const CHANNELS: { id: Channel; label: string; Icon: ComponentType<SvgIconProps> }[] = [
  { id: "email", label: "Email", Icon: Email },
  { id: "push", label: "Push", Icon: PhoneIphone },
  { id: "sms", label: "SMS", Icon: Sms },
];

const TOPICS: { id: Topic; label: string; desc: string }[] = [
  { id: "newMission", label: "Nouvelles missions", desc: "Une mission proche de chez toi" },
  { id: "messages", label: "Messages", desc: "Une réponse de ton manager" },
  { id: "reminders", label: "Rappels", desc: "Avant tes engagements" },
  { id: "weekly", label: "Récap hebdo", desc: "Tous les dimanches soir" },
];

type Matrix = Record<Topic, Record<Channel, boolean>>;

const INITIAL: Matrix = {
  newMission: { email: true, push: true, sms: false },
  messages: { email: true, push: true, sms: true },
  reminders: { email: false, push: true, sms: false },
  weekly: { email: true, push: false, sms: false },
};

export default function WireframePushSettings() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [matrix, setMatrix] = useState<Matrix>(INITIAL);

  const toggle = useCallback((topic: Topic, ch: Channel) => {
    setMatrix((prev) => ({
      ...prev,
      [topic]: { ...prev[topic], [ch]: !prev[topic][ch] },
    }));
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
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
        <NotificationsActive sx={{ color: "primary.main" }} />
        <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
          Notifications
        </Typography>
      </Stack>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Choisis sur quels canaux on te contacte.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `1.6fr repeat(${CHANNELS.length}, 1fr)`,
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Box />
        {CHANNELS.map(({ id, label, Icon }) => (
          <Stack key={id} alignItems="center" spacing={0.25} sx={{ pb: 1 }}>
            <Icon sx={{ color: "text.secondary", fontSize: 18 }} />
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 800, fontSize: 10 }}>
              {label}
            </Typography>
          </Stack>
        ))}

        {TOPICS.map((topic, idx) => (
          <Box
            key={topic.id}
            sx={{
              display: "contents",
              "& > *": {
                bgcolor: idx % 2 === 0 ? alpha(dk.surfaceMuted, 0.18) : "transparent",
              },
            }}
          >
            <Box sx={{ p: 1.25, borderRadius: "8px 0 0 8px" }}>
              <Typography sx={{ fontWeight: 800, color: "primary.main", fontSize: 13 }}>
                {topic.label}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {topic.desc}
              </Typography>
            </Box>
            {CHANNELS.map(({ id }, chIdx) => (
              <Box
                key={id}
                sx={{
                  p: 1.25,
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: chIdx === CHANNELS.length - 1 ? "0 8px 8px 0" : 0,
                }}
              >
                <Switch
                  size="small"
                  checked={matrix[topic.id][id]}
                  onChange={() => toggle(topic.id, id)}
                  color="primary"
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
