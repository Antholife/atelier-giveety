"use client";

import { CheckCircle, ChevronRight, Close, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import DismissRetentionDialog, { type DismissRetention } from "./DismissRetentionDialog";
import { designKitPalette } from "./designKitPalette";

type Item = {
  id: string;
  title: string;
  desc: string;
  done: boolean;
};

const INITIAL: Item[] = [
  { id: "1", title: "Compléter ton profil", desc: "Photo, bio, ville", done: true },
  { id: "2", title: "Ajouter ta première mission", desc: "Importe ou saisis", done: true },
  { id: "3", title: "Renseigner tes disponibilités", desc: "Pour qu'on te propose les bonnes missions au bon moment", done: false },
  { id: "4", title: "Choisir tes centres d'intérêt", desc: "3 causes qui te parlent : précarité, écologie, éducation…", done: false },
  { id: "5", title: "Postuler à ta première mission", desc: "Le 1er pas du bénévolat, en un clic depuis l'app", done: false },
];

export default function WireframeChecklist({
  pairedLayout = false,
  onDismissChoice,
}: {
  pairedLayout?: boolean;
  /** Modale de confirmation : masquage temporaire ou définitif (localStorage côté parent). */
  onDismissChoice?: (retention: DismissRetention) => void;
}) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);

  const toggle = useCallback((id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }, []);

  const completed = items.filter((i) => i.done).length;
  const pct = Math.round((completed / items.length) * 100);
  const allDone = completed === items.length;

  const completedItems = useMemo(() => items.filter((i) => i.done), [items]);
  const nextItem = useMemo(() => items.find((i) => !i.done), [items]);

  const itemPad = pairedLayout ? { px: 1, py: 0.55 } : { px: 1.5, py: 1.25 };

  const listBody =
    pairedLayout ? (
      <Stack
        spacing={1.35}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          mr: -0.5,
          pr: 0.5,
          pt: 0.25,
        }}
      >
        {completedItems.length > 0 ? (
          <Box sx={{ flexShrink: 0 }}>
            <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
              {completedItems.map((item) => (
                <Box
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 0.75,
                    py: 0.3,
                    borderRadius: 9999,
                    cursor: "pointer",
                    bgcolor: alpha(dk.mint, 0.22),
                    border: `1px solid ${alpha(dk.surfaceStrong, 0.14)}`,
                    maxWidth: "100%",
                  }}
                >
                  <CheckCircle sx={{ fontSize: 14, color: "primary.main", flexShrink: 0 }} />
                  <Typography
                    variant="caption"
                    component="span"
                    title={item.title}
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      lineHeight: 1.25,
                      fontSize: 11,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        ) : null}

        {!allDone && nextItem ? (
          <Stack spacing={0.95} sx={{ flexShrink: 0 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "primary.main",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: 10,
              }}
            >
              Prochaine étape
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              onClick={() => toggle(nextItem.id)}
              sx={{
                flexShrink: 0,
                ...itemPad,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: alpha(dk.tertiaryLight, 0.32),
                border: `1px solid ${alpha(dk.tertiary, 0.35)}`,
                transition: "all 0.15s ease",
                "&:hover": { transform: "translateX(2px)" },
              }}
            >
              <RadioButtonUnchecked sx={{ color: alpha(dk.textMuted, 0.65), fontSize: 17, flexShrink: 0 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.2, fontSize: 12.5 }}>
                  {nextItem.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    display: "block",
                    mt: 0.3,
                    lineHeight: 1.42,
                    fontSize: "0.72rem",
                  }}
                >
                  {nextItem.desc}
                </Typography>
              </Box>
              <ChevronRight sx={{ color: "text.secondary", flexShrink: 0, fontSize: 17 }} />
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    ) : (
      <Box>
        <Stack spacing={0.75}>
          {items.map((item) => (
            <Stack
              key={item.id}
              direction="row"
              alignItems="center"
              spacing={1.5}
              onClick={() => toggle(item.id)}
              sx={{
                ...itemPad,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: item.done ? alpha(dk.mint, 0.25) : alpha(dk.surfaceMuted, 0.2),
                border: `1px solid ${item.done ? alpha(dk.surfaceStrong, 0.2) : alpha(dk.border, 0.15)}`,
                transition: "all 0.15s ease",
                "&:hover": { transform: "translateX(2px)" },
              }}
            >
              {item.done ? (
                <CheckCircle sx={{ color: "primary.main", fontSize: 22 }} />
              ) : (
                <RadioButtonUnchecked sx={{ color: alpha(dk.textMuted, 0.6), fontSize: 22 }} />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    textDecoration: item.done ? "line-through" : "none",
                    opacity: item.done ? 0.7 : 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  {item.desc}
                </Typography>
              </Box>
              {!item.done ? <ChevronRight sx={{ color: "text.secondary" }} /> : null}
            </Stack>
          ))}
        </Stack>
      </Box>
    );

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: pairedLayout ? 1.25 : 2, sm: pairedLayout ? 1.5 : 2.5 },
        ...(pairedLayout
          ? {
              flex: { xs: "none", md: 1 },
              minHeight: { md: 0 },
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: onDismissChoice ? "relative" : undefined,
            }
          : {}),
      }}
    >
      {pairedLayout && onDismissChoice ? (
        <IconButton
          size="small"
          onClick={() => setDismissDialogOpen(true)}
          aria-label="Masquer uniquement Premiers pas Giveety"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: alpha(dk.surfaceStrong, 0.1),
            color: dk.surfaceStrong,
            "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.18) },
          }}
        >
          <Close sx={{ fontSize: 17 }} />
        </IconButton>
      ) : null}

      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{
          mb: pairedLayout ? 0.75 : 1,
          flexShrink: 0,
          gap: pairedLayout ? 1 : 1,
          pr: pairedLayout && onDismissChoice ? 4 : undefined,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              color: "primary.main",
              fontSize: pairedLayout ? 14 : undefined,
              lineHeight: pairedLayout ? 1.22 : undefined,
            }}
          >
            Premiers pas Giveety
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: pairedLayout ? "0.72rem" : undefined,
              lineHeight: 1.35,
              display: "block",
              mt: pairedLayout ? 0.25 : undefined,
            }}
          >
            {completed} / {items.length} étapes terminées
          </Typography>
        </Box>
        <Typography
          variant={pairedLayout ? "body2" : "h5"}
          sx={{
            fontWeight: 800,
            color: allDone ? "tertiary.main" : "primary.main",
            ...(pairedLayout ? { fontSize: "1.05rem", lineHeight: 1.08 } : {}),
          }}
        >
          {pct}%
        </Typography>
      </Stack>

      <Box
        sx={{
          height: pairedLayout ? 5 : 8,
          borderRadius: 9999,
          bgcolor: alpha(dk.border, 0.14),
          overflow: "hidden",
          mb: pairedLayout ? 1 : 2,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${dk.surfaceStrong}, ${dk.tertiary})`,
            transition: "width 0.4s ease",
          }}
        />
      </Box>

      {listBody}

      {allDone ? (
        <Box
          sx={{
            mt: pairedLayout ? 1.25 : 2,
            p: pairedLayout ? 0.85 : 1.5,
            borderRadius: 2,
            bgcolor: alpha(dk.tertiaryLight, 0.38),
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              color: "primary.main",
              fontSize: pairedLayout ? "0.82rem" : undefined,
              lineHeight: pairedLayout ? 1.32 : undefined,
            }}
          >
            🎉 Bravo, tu es prête à briller sur Giveety !
          </Typography>
        </Box>
      ) : null}

      {pairedLayout && onDismissChoice ? (
        <DismissRetentionDialog
          open={dismissDialogOpen}
          onClose={() => setDismissDialogOpen(false)}
          scopeLabel="Premiers pas Giveety"
          blockTitle="Liste"
          onChooseTemporary={() => {
            setDismissDialogOpen(false);
            onDismissChoice("temporary");
          }}
          onChoosePermanent={() => {
            setDismissDialogOpen(false);
            onDismissChoice("permanent");
          }}
        />
      ) : null}
    </Box>
  );
}
