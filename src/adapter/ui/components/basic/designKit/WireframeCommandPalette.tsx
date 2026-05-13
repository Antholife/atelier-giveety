"use client";

import {
  Bolt,
  Inbox,
  KeyboardCommandKey,
  Person,
  Search,
  Settings,
  type SvgIconComponent,
} from "@mui/icons-material";
import {
  Box,
  Button,
  InputBase,
  Modal,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { designKitPalette } from "./designKitPalette";

type Cmd = {
  id: string;
  label: string;
  group: string;
  icon: SvgIconComponent;
  shortcut?: string;
};

const COMMANDS: Cmd[] = [
  { id: "new-att", label: "Créer une certificat", group: "Actions", icon: Bolt, shortcut: "⌘ N" },
  { id: "search-mission", label: "Rechercher une mission", group: "Actions", icon: Search, shortcut: "⌘ K" },
  { id: "inbox", label: "Ouvrir mon inbox", group: "Navigation", icon: Inbox, shortcut: "G I" },
  { id: "profile", label: "Aller à mon profil", group: "Navigation", icon: Person, shortcut: "G P" },
  { id: "settings", label: "Préférences", group: "Navigation", icon: Settings, shortcut: "⌘ ," },
  { id: "logout", label: "Se déconnecter", group: "Compte", icon: Person },
];

export default function WireframeCommandPalette() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Cmd[]>();
    filtered.forEach((c) => {
      const list = map.get(c.group) ?? [];
      list.push(c);
      map.set(c.group, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (cursor >= filtered.length) setCursor(Math.max(0, filtered.length - 1));
  }, [filtered.length, cursor]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(filtered.length - 1, c + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(0, c - 1));
      } else if (e.key === "Enter" && filtered[cursor]) {
        setLast(filtered[cursor].label);
        setOpen(false);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [filtered, cursor],
  );

  const flatIndex = (groupIdx: number, itemIdx: number) => {
    let acc = 0;
    for (let i = 0; i < groupIdx; i += 1) acc += grouped[i][1].length;
    return acc + itemIdx;
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Command Palette
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 2 }}>
        Raccourci moderne pour naviguer dans l'app.
      </Typography>
      <Button
        startIcon={<KeyboardCommandKey />}
        endIcon={
          <Box
            component="kbd"
            sx={{
              fontFamily: "monospace",
              fontSize: 11,
              px: 0.75,
              py: 0.25,
              borderRadius: 0.75,
              bgcolor: alpha(dk.white, 0.2),
              border: `1px solid ${alpha(dk.white, 0.4)}`,
            }}
          >
            ⌘ K
          </Box>
        }
        onClick={() => setOpen(true)}
        disableElevation
        sx={{
          borderRadius: 9999,
          textTransform: "none",
          fontWeight: 800,
          px: 3,
          bgcolor: dk.surfaceStrong,
          color: dk.white,
          "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
        }}
      >
        Ouvrir la palette
      </Button>
      {last ? (
        <Typography variant="caption" sx={{ display: "block", mt: 2, color: "tertiary.main", fontWeight: 700 }}>
          Action exécutée : « {last} »
        </Typography>
      ) : null}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: { xs: "10%", sm: "15%" },
            left: "50%",
            transform: "translateX(-50%)",
            width: { xs: "92%", sm: 540 },
            bgcolor: dk.canvas,
            borderRadius: 3,
            outline: "none",
            boxShadow: `0 24px 64px ${alpha("#000", 0.3)}`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${alpha(dk.border, 0.12)}`,
            }}
          >
            <Search sx={{ color: "primary.main" }} />
            <InputBase
              inputRef={inputRef}
              fullWidth
              placeholder="Tape une commande, une page…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              sx={{ fontWeight: 500, fontFamily: theme.typography.fontFamily }}
            />
            <Box
              component="kbd"
              sx={{
                fontFamily: "monospace",
                fontSize: 11,
                px: 0.75,
                py: 0.25,
                borderRadius: 0.75,
                bgcolor: alpha(dk.border, 0.1),
                color: "text.secondary",
              }}
            >
              ESC
            </Box>
          </Box>
          <Box sx={{ maxHeight: 320, overflowY: "auto", py: 1 }}>
            {grouped.length === 0 ? (
              <Typography sx={{ p: 3, textAlign: "center", color: "text.secondary", fontWeight: 600 }}>
                Aucune commande trouvée.
              </Typography>
            ) : (
              grouped.map(([group, items], gi) => (
                <Box key={group}>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 2,
                      pt: 1,
                      pb: 0.5,
                      display: "block",
                      fontWeight: 800,
                      color: "text.secondary",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {group.toUpperCase()}
                  </Typography>
                  {items.map((c, ci) => {
                    const idx = flatIndex(gi, ci);
                    const Icon = c.icon;
                    const isActive = cursor === idx;
                    return (
                      <Stack
                        key={c.id}
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        onMouseEnter={() => setCursor(idx)}
                        onClick={() => {
                          setLast(c.label);
                          setOpen(false);
                        }}
                        sx={{
                          px: 2,
                          py: 1,
                          cursor: "pointer",
                          bgcolor: isActive ? alpha(dk.surfaceAccent, 0.5) : "transparent",
                        }}
                      >
                        <Icon sx={{ fontSize: 18, color: isActive ? "primary.main" : "text.secondary" }} />
                        <Typography sx={{ flex: 1, fontWeight: isActive ? 800 : 600, color: "primary.main" }}>
                          {c.label}
                        </Typography>
                        {c.shortcut ? (
                          <Box
                            component="kbd"
                            sx={{
                              fontFamily: "monospace",
                              fontSize: 11,
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 0.75,
                              bgcolor: alpha(dk.border, 0.12),
                              color: "text.secondary",
                              fontWeight: 700,
                            }}
                          >
                            {c.shortcut}
                          </Box>
                        ) : null}
                      </Stack>
                    );
                  })}
                </Box>
              ))
            )}
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              px: 2,
              py: 1,
              borderTop: `1px solid ${alpha(dk.border, 0.12)}`,
              fontSize: 11,
              color: "text.secondary",
              fontWeight: 700,
            }}
          >
            <span>↑ ↓ naviguer · ↵ exécuter</span>
            <span>Démo</span>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
