"use client";

import { CheckCircle, CloudUpload, Delete, InsertDriveFile } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState, type DragEvent } from "react";
import { designKitPalette } from "./designKitPalette";

type FileItem = {
  id: string;
  name: string;
  size: string;
  progress: number;
};

const SAMPLE: FileItem[] = [
  { id: "f1", name: "certificat-mai.pdf", size: "412 Ko", progress: 100 },
  { id: "f2", name: "photo-equipe.jpg", size: "1.2 Mo", progress: 100 },
];

function randomFile(): FileItem {
  const names = ["bilan.pdf", "compte-rendu.docx", "photo-mission.jpg", "logo-orga.png", "feuille-presence.xlsx"];
  return {
    id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: names[Math.floor(Math.random() * names.length)],
    size: `${Math.floor(100 + Math.random() * 900)} Ko`,
    progress: 0,
  };
}

export default function WireframeFilePicker() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [files, setFiles] = useState<FileItem[]>(SAMPLE);
  const [dragOver, setDragOver] = useState(false);

  const addFile = useCallback(() => {
    const f = randomFile();
    setFiles((prev) => [...prev, f]);
    const interval = window.setInterval(() => {
      setFiles((prev) => {
        const found = prev.find((x) => x.id === f.id);
        if (!found || found.progress >= 100) {
          window.clearInterval(interval);
          return prev;
        }
        return prev.map((x) =>
          x.id === f.id ? { ...x, progress: Math.min(100, x.progress + 18) } : x,
        );
      });
    }, 180);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      addFile();
    },
    [addFile],
  );

  const remove = useCallback(
    (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id)),
    [],
  );

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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 2 }}>
        Justificatifs
      </Typography>

      <Box
        role="button"
        tabIndex={0}
        onClick={addFile}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        sx={{
          p: 3,
          borderRadius: 2.5,
          border: `2px dashed ${dragOver ? dk.tertiary : alpha(dk.border, 0.4)}`,
          bgcolor: dragOver ? alpha(dk.tertiaryLight, 0.4) : alpha(dk.surfaceMuted, 0.2),
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          mb: 2,
        }}
      >
        <CloudUpload sx={{ fontSize: 40, color: dragOver ? dk.tertiary : "primary.main", mb: 0.5 }} />
        <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
          {dragOver ? "Lâche ici !" : "Dépose un fichier ou clique pour ajouter"}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
          PDF, JPG, PNG · 10 Mo max (démo)
        </Typography>
      </Box>

      <Stack spacing={1}>
        {files.map((f) => (
          <Stack
            key={f.id}
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: `1px solid ${alpha(dk.border, 0.15)}`,
              bgcolor: dk.white,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: alpha(dk.primaryLight, 0.6),
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InsertDriveFile fontSize="small" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, color: "primary.main" }} noWrap>
                {f.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    flex: 1,
                    height: 4,
                    borderRadius: 9999,
                    bgcolor: alpha(dk.border, 0.15),
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${f.progress}%`,
                      height: "100%",
                      bgcolor: f.progress === 100 ? dk.surfaceStrong : dk.tertiary,
                      transition: "width 0.2s linear",
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, minWidth: 60, textAlign: "right" }}>
                  {f.progress < 100 ? `${f.progress}%` : f.size}
                </Typography>
              </Stack>
            </Box>
            {f.progress === 100 ? (
              <CheckCircle sx={{ color: "success.main", fontSize: 20 }} />
            ) : null}
            <IconButton size="small" onClick={() => remove(f.id)} aria-label="Supprimer">
              <Delete fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
