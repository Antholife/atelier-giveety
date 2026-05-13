"use client";

import { AutoAwesome, Close, Send } from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Msg = { id: string; from: "bot" | "me"; text: string };

const SUGGESTIONS = [
  "Comment créer mon certificat ?",
  "Trouve-moi une mission près de Lyon",
  "Comment ajouter mon manager ?",
];

const REPLIES: Record<string, string> = {
  "Comment créer mon certificat ?":
    "Va dans « Mes certificats » → bouton « Nouvelle ». Je peux te guider pas à pas si tu veux.",
  "Trouve-moi une mission près de Lyon":
    "J'en vois 12 à moins de 15 km. Je t'envoie la sélection dans ta messagerie.",
  "Comment ajouter mon manager ?":
    "Dans « Mes contacts » → « + Manager », saisis son email. Il recevra une invitation à valider.",
};

export default function WireframeChatbot() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", from: "bot", text: "Salut Élise 👋 Je suis Givi, ton assistant Giveety. Une question ?" },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const ask = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: `me-${Date.now()}`, from: "me", text }]);
    window.setTimeout(() => {
      const reply = REPLIES[text] ?? "Bonne question ! Je note et je te réponds dès qu'un humain peut.";
      setMessages((prev) => [...prev, { id: `bot-${Date.now()}`, from: "bot", text: reply }]);
    }, 700);
  }, []);

  const send = useCallback(() => {
    const t = draft.trim();
    if (!t) return;
    setDraft("");
    ask(t);
  }, [draft, ask]);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: 3,
        textAlign: "center",
        minHeight: open ? 480 : 200,
        transition: "min-height 0.25s ease",
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Assistant Givi · démo
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
        Bulle flottante d'aide IA — ouvre pour discuter.
      </Typography>

      {!open ? (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            width: 64,
            height: 64,
            background: `linear-gradient(135deg, ${dk.tertiary} 0%, ${dk.surfaceStrong} 100%)`,
            color: dk.white,
            boxShadow: `0 8px 24px ${alpha(dk.surfaceStrong, 0.4)}`,
            "&:hover": { transform: "scale(1.05)" },
            transition: "transform 0.2s ease",
          }}
          aria-label="Ouvrir l'assistant"
        >
          <AutoAwesome sx={{ fontSize: 30 }} />
        </IconButton>
      ) : null}

      {open ? (
        <Box
          sx={{
            position: "absolute",
            inset: 16,
            top: 70,
            borderRadius: 2.5,
            bgcolor: dk.canvas,
            border: `1px solid ${alpha(dk.border, 0.2)}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              px: 2,
              py: 1.25,
              background: `linear-gradient(90deg, ${dk.tertiary} 0%, ${dk.surfaceStrong} 100%)`,
              color: dk.white,
            }}
          >
            <AutoAwesome sx={{ fontSize: 18 }} />
            <Typography sx={{ flex: 1, fontWeight: 800, textAlign: "left" }}>
              Givi
            </Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: dk.white }} aria-label="Fermer">
              <Close fontSize="small" />
            </IconButton>
          </Stack>

          <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: 1.5, bgcolor: alpha(dk.surfaceMuted, 0.2) }}>
            <Stack spacing={1}>
              {messages.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    alignSelf: m.from === "me" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: m.from === "me" ? dk.surfaceStrong : dk.canvas,
                    color: m.from === "me" ? dk.white : dk.text,
                    border: m.from === "me" ? "none" : `1px solid ${alpha(dk.border, 0.15)}`,
                    fontSize: 13,
                    fontWeight: 500,
                    textAlign: "left",
                    boxShadow: `0 1px 4px ${alpha(dk.surfaceStrong, 0.05)}`,
                  }}
                >
                  {m.text}
                </Box>
              ))}
            </Stack>
            {messages.length <= 1 ? (
              <Stack spacing={0.75} sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textAlign: "left" }}>
                  Suggestions
                </Typography>
                {SUGGESTIONS.map((s) => (
                  <Box
                    key={s}
                    onClick={() => ask(s)}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 9999,
                      bgcolor: dk.canvas,
                      border: `1px solid ${alpha(dk.border, 0.2)}`,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "primary.main",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      "&:hover": { bgcolor: alpha(dk.surfaceAccent, 0.5), borderColor: dk.tertiary },
                    }}
                  >
                    💡 {s}
                  </Box>
                ))}
              </Stack>
            ) : null}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            sx={{ p: 1, borderTop: `1px solid ${alpha(dk.border, 0.12)}` }}
          >
            <InputBase
              fullWidth
              placeholder="Demande à Givi…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 9999,
                bgcolor: alpha(dk.surfaceMuted, 0.4),
                fontSize: 13,
                fontWeight: 500,
              }}
            />
            <IconButton
              size="small"
              onClick={send}
              disabled={!draft.trim()}
              sx={{
                bgcolor: dk.surfaceStrong,
                color: dk.white,
                "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
                "&.Mui-disabled": { bgcolor: alpha(dk.border, 0.25), color: dk.white },
              }}
              aria-label="Envoyer"
            >
              <Send fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
