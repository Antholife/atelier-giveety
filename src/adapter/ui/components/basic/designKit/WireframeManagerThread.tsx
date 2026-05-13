"use client";

import { Send, Verified } from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { designKitPalette } from "./designKitPalette";

type Author = "manager" | "me";

type Message = {
  id: string;
  author: Author;
  initials: string;
  name: string;
  time: string;
  text: string;
  skills?: string[];
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    author: "manager",
    initials: "CB",
    name: "Camille Brun",
    time: "14:02",
    text: "Salut Élise ! Bravo pour la maraude de samedi, ton accueil des nouvelles personnes était top.",
  },
  {
    id: "m2",
    author: "manager",
    initials: "CB",
    name: "Camille Brun",
    time: "14:03",
    text: "Du coup je te valide ces compétences, dis-moi si ça te va :",
    skills: ["Écoute active", "Médiation", "Animation de groupe"],
  },
  {
    id: "m3",
    author: "me",
    initials: "EM",
    name: "Élise (toi)",
    time: "14:10",
    text: "Merci Camille 🙌 ça me va parfaitement, je peux les ajouter à mon certificat ?",
  },
];

function timeNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function WireframeManagerThread() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const text = draft.trim();
      if (!text) return;
      const mine: Message = {
        id: `m-${Date.now()}`,
        author: "me",
        initials: "EM",
        name: "Élise (toi)",
        time: timeNow(),
        text,
      };
      setMessages((prev) => [...prev, mine]);
      setDraft("");
      setTyping(true);
      window.setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `r-${Date.now()}`,
            author: "manager",
            initials: "CB",
            name: "Camille Brun",
            time: timeNow(),
            text: "Bien noté ! On en reparle au prochain debrief 👍",
          },
        ]);
      }, 1400);
    },
    [draft],
  );

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: 480,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${alpha(dk.border, 0.12)}`,
          background: `linear-gradient(90deg, ${alpha(dk.primaryLight, 0.6)} 0%, ${dk.white} 100%)`,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 13,
            position: "relative",
          }}
        >
          CB
          <Verified
            sx={{
              position: "absolute",
              right: -4,
              bottom: -4,
              fontSize: 16,
              color: dk.tertiary,
              bgcolor: dk.white,
              borderRadius: "50%",
            }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}>
            Camille Brun
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Manager · Asso Singa France
          </Typography>
        </Box>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: 9999,
            bgcolor: alpha("#22c55e", 0.15),
            color: "#16a34a",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#22c55e" }} />
          En ligne
        </Box>
      </Stack>

      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          bgcolor: alpha(dk.surfaceMuted, 0.18),
        }}
      >
        {messages.map((msg) => {
          const mine = msg.author === "me";
          return (
            <Stack
              key={msg.id}
              direction={mine ? "row-reverse" : "row"}
              spacing={1}
              alignItems="flex-end"
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: mine ? dk.tertiary : dk.surfaceStrong,
                  color: dk.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 11,
                  flexShrink: 0,
                }}
              >
                {msg.initials}
              </Box>
              <Box sx={{ maxWidth: "75%" }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2.5,
                    borderTopLeftRadius: mine ? 20 : 4,
                    borderTopRightRadius: mine ? 4 : 20,
                    bgcolor: mine ? dk.surfaceStrong : dk.white,
                    color: mine ? dk.white : dk.text,
                    border: mine ? "none" : `1px solid ${alpha(dk.border, 0.15)}`,
                    boxShadow: `0 2px 8px ${alpha(dk.surfaceStrong, 0.06)}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, lineHeight: 1.45, whiteSpace: "pre-wrap" }}
                  >
                    {msg.text}
                  </Typography>
                  {msg.skills?.length ? (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 1, gap: 0.5 }}>
                      {msg.skills.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor: mine
                              ? alpha(dk.white, 0.15)
                              : alpha(dk.tertiaryLight, 0.7),
                            color: mine ? dk.white : dk.surfaceStrong,
                            border: mine
                              ? `1px solid ${alpha(dk.white, 0.3)}`
                              : "none",
                          }}
                        />
                      ))}
                    </Stack>
                  ) : null}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.25,
                    px: 0.5,
                    color: alpha(dk.textMuted, 0.85),
                    fontWeight: 600,
                    textAlign: mine ? "right" : "left",
                  }}
                >
                  {msg.name} · {msg.time}
                </Typography>
              </Box>
            </Stack>
          );
        })}

        {typing ? (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ pl: 4.5 }}>
            <Box
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2.5,
                bgcolor: dk.white,
                border: `1px solid ${alpha(dk.border, 0.15)}`,
                display: "inline-flex",
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: dk.surfaceStrong,
                    opacity: 0.4,
                    animation: "wf-bubble 1.2s infinite ease-in-out",
                    animationDelay: `${i * 0.15}s`,
                    "@keyframes wf-bubble": {
                      "0%, 80%, 100%": { opacity: 0.3, transform: "translateY(0)" },
                      "40%": { opacity: 1, transform: "translateY(-3px)" },
                    },
                  }}
                />
              ))}
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Camille écrit…
            </Typography>
          </Stack>
        ) : null}
      </Box>

      <Box
        component="form"
        onSubmit={send}
        sx={{
          p: 1.5,
          borderTop: `1px solid ${alpha(dk.border, 0.12)}`,
          display: "flex",
          gap: 1,
          alignItems: "center",
          bgcolor: dk.white,
        }}
      >
        <InputBase
          fullWidth
          placeholder="Écris un message à ton manager…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 9999,
            bgcolor: alpha(dk.surfaceMuted, 0.4),
            border: `1px solid ${alpha(dk.border, 0.15)}`,
            fontFamily: theme.typography.fontFamily,
            fontWeight: 500,
            "& input::placeholder": {
              color: alpha(dk.textMuted, 0.7),
              opacity: 1,
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={!draft.trim()}
          aria-label="Envoyer"
          sx={{
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.85) },
            "&.Mui-disabled": { bgcolor: alpha(dk.border, 0.25), color: dk.white },
          }}
        >
          <Send fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
