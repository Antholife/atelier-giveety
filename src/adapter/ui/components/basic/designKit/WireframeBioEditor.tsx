"use client";

import {
  EmojiEmotions,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  Link as LinkIcon,
} from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useRef, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const EMOJIS = ["💚", "🌍", "✨", "🤝", "🚀", "🎓", "🎉", "🌱", "❤️", "🔥", "🙌", "📚"];

const INITIAL = "Bénévole engagée depuis 2 ans · j'accompagne des publics éloignés de l'emploi.";

export default function WireframeBioEditor() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [text, setText] = useState(INITIAL);
  const [styles, setStyles] = useState<string[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const insertEmoji = useCallback((emoji: string) => {
    setText((prev) => `${prev}${prev.endsWith(" ") || prev.length === 0 ? "" : " "}${emoji}`);
    setShowEmoji(false);
  }, []);

  const charCount = text.length;
  const limit = 240;
  const overLimit = charCount > limit;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        Ma bio
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1.5 }}>
        Mise en forme rapide · {limit} caractères max.
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, position: "relative" }}>
        <ToggleButtonGroup
          size="small"
          value={styles}
          onChange={(_e, v) => setStyles(v as string[])}
          sx={{
            "& .MuiToggleButton-root": {
              border: `1px solid ${alpha(dk.border, 0.2)}`,
              color: "primary.main",
              "&.Mui-selected": {
                bgcolor: dk.surfaceStrong,
                color: dk.white,
                "&:hover": { bgcolor: dk.surfaceStrong, opacity: 0.9 },
              },
            },
          }}
        >
          <ToggleButton value="bold" aria-label="Gras">
            <FormatBold fontSize="small" />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="Italique">
            <FormatItalic fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list" aria-label="Liste">
            <FormatListBulleted fontSize="small" />
          </ToggleButton>
          <ToggleButton value="link" aria-label="Lien">
            <LinkIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ position: "relative" }}>
          <ToggleButton
            value="emoji"
            size="small"
            selected={showEmoji}
            onChange={() => setShowEmoji((v) => !v)}
            sx={{
              border: `1px solid ${alpha(dk.border, 0.2)}`,
              color: "primary.main",
              "&.Mui-selected": { bgcolor: dk.surfaceStrong, color: dk.white },
            }}
          >
            <EmojiEmotions fontSize="small" />
          </ToggleButton>
          {showEmoji ? (
            <ClickAwayListener onClickAway={() => setShowEmoji(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  zIndex: 10,
                  p: 1,
                  borderRadius: 2,
                  bgcolor: dk.canvas,
                  border: `1px solid ${alpha(dk.border, 0.2)}`,
                  boxShadow: `0 12px 28px ${alpha(dk.surfaceStrong, 0.18)}`,
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: 0.5,
                  width: 200,
                }}
              >
                {EMOJIS.map((e) => (
                  <Box
                    key={e}
                    onClick={() => insertEmoji(e)}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      fontSize: 22,
                      borderRadius: 1,
                      "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.6) },
                    }}
                  >
                    {e}
                  </Box>
                ))}
              </Box>
            </ClickAwayListener>
          ) : null}
        </Box>
      </Stack>

      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setText((e.target as HTMLDivElement).innerText)}
        sx={{
          minHeight: 100,
          px: 1.5,
          py: 1.25,
          borderRadius: 2,
          border: `1px solid ${alpha(dk.border, 0.25)}`,
          outline: "none",
          fontSize: 14,
          fontFamily: theme.typography.fontFamily,
          color: "primary.main",
          fontWeight: styles.includes("bold") ? 800 : 500,
          fontStyle: styles.includes("italic") ? "italic" : "normal",
          "&:focus": { borderColor: dk.tertiary, boxShadow: `0 0 0 2px ${alpha(dk.tertiary, 0.18)}` },
          transition: "all 0.15s ease",
        }}
      >
        {text}
      </Box>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
          Mise en forme : {styles.length === 0 ? "—" : styles.join(" · ")}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 800, color: overLimit ? "#E5484D" : "tertiary.main" }}>
          {charCount} / {limit}
        </Typography>
      </Stack>
    </Box>
  );
}
