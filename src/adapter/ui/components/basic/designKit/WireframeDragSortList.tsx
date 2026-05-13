"use client";

import { DragIndicator, KeyboardArrowDown, KeyboardArrowUp, Star } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState, type DragEvent } from "react";
import { designKitPalette } from "./designKitPalette";

type Item = {
  id: string;
  label: string;
  category: string;
};

const INITIAL: Item[] = [
  { id: "1", label: "Médiation", category: "Savoir-être" },
  { id: "2", label: "Écoute active", category: "Savoir-être" },
  { id: "3", label: "Animation de groupe", category: "Savoir-être" },
  { id: "4", label: "Logistique", category: "Savoir-faire" },
  { id: "5", label: "Communication digitale", category: "Savoir-faire" },
];

export default function WireframeDragSortList() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const reorder = useCallback((from: number, to: number) => {
    setItems((prev) => {
      const copy = prev.slice();
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  }, []);

  const onDragStart = useCallback((id: string) => setDraggingId(id), []);
  const onDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, id: string) => {
      e.preventDefault();
      setOverId(id);
    },
    [],
  );
  const onDrop = useCallback(
    (id: string) => {
      if (!draggingId || draggingId === id) {
        setDraggingId(null);
        setOverId(null);
        return;
      }
      const from = items.findIndex((i) => i.id === draggingId);
      const to = items.findIndex((i) => i.id === id);
      reorder(from, to);
      setDraggingId(null);
      setOverId(null);
    },
    [draggingId, items, reorder],
  );

  const move = useCallback(
    (id: string, dir: -1 | 1) => {
      const idx = items.findIndex((i) => i.id === id);
      const target = idx + dir;
      if (target < 0 || target >= items.length) return;
      reorder(idx, target);
    },
    [items, reorder],
  );

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
        Ordre d'affichage des compétences
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        Glisse-dépose ou utilise les flèches ↑ ↓
      </Typography>

      <Stack spacing={1}>
        {items.map((item, i) => {
          const isDragging = draggingId === item.id;
          const isOver = overId === item.id && draggingId !== item.id;
          return (
            <Box
              key={item.id}
              draggable
              onDragStart={() => onDragStart(item.id)}
              onDragOver={(e) => onDragOver(e, item.id)}
              onDrop={() => onDrop(item.id)}
              onDragEnd={() => {
                setDraggingId(null);
                setOverId(null);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                bgcolor: isDragging ? alpha(dk.tertiaryLight, 0.5) : dk.canvas,
                border: isOver ? `2px dashed ${dk.tertiary}` : `1px solid ${alpha(dk.border, 0.18)}`,
                opacity: isDragging ? 0.6 : 1,
                cursor: "grab",
                transition: "all 0.15s ease",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <DragIndicator sx={{ color: "text.secondary", cursor: "grab" }} />
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: i === 0 ? dk.tertiary : alpha(dk.primaryLight, 0.7),
                  color: i === 0 ? dk.white : "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {i === 0 ? <Star sx={{ fontSize: 16 }} /> : i + 1}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, color: "primary.main" }} noWrap>
                  {item.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  {item.category}
                </Typography>
              </Box>
              <Stack direction="row" spacing={0}>
                <IconButton size="small" onClick={() => move(item.id, -1)} disabled={i === 0} aria-label="Monter">
                  <KeyboardArrowUp fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => move(item.id, 1)} disabled={i === items.length - 1} aria-label="Descendre">
                  <KeyboardArrowDown fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
