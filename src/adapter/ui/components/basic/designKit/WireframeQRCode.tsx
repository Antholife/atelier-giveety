"use client";

import { Download, Refresh } from "@mui/icons-material";
import { Box, Button, Stack, TextField, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";

const SIZE = 25;

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildMatrix(input: string): boolean[][] {
  const rng = (seed: number) => {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };
  const next = rng(hashString(input || "_"));
  const m: boolean[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => false));
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) m[y][x] = next() > 0.55;
  }
  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const onBorder = x === 0 || y === 0 || x === 6 || y === 6;
        const onInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        m[oy + y][ox + x] = onBorder || onInner;
      }
    }
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        const ax = ox + x;
        const ay = oy + y;
        if (ax < 0 || ay < 0 || ax >= SIZE || ay >= SIZE) continue;
        if (x === -1 || y === -1 || x === 7 || y === 7) m[ay][ax] = false;
      }
    }
  };
  finder(0, 0);
  finder(SIZE - 7, 0);
  finder(0, SIZE - 7);
  return m;
}

const DEFAULT_ENCODE_URL = "https://giveety.app/u/elise-marchand";

/** Petit rendu QR (même générateur que la carte démo complète). */
export function WireframeProfileQRThumb({
  encodedUrl,
  displaySizePx = 144,
  logoLetter = "G",
}: {
  encodedUrl: string;
  /** Taille SVG affichée (px). */
  displaySizePx?: number;
  logoLetter?: string;
}) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const matrix = useMemo(() => buildMatrix(encodedUrl), [encodedUrl]);
  const logoSz = Math.max(26, Math.round(displaySizePx * 0.22));
  const fontPx = Math.max(11, Math.round(logoSz * 0.45));

  return (
    <Box
      sx={{
        position: "relative",
        p: 1.25,
        borderRadius: 2.5,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.2)}`,
        boxShadow: `0 8px 20px ${alpha(dk.surfaceStrong, 0.1)}`,
        display: "inline-flex",
      }}
      role="img"
      aria-label="QR code profil public (démo)"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={displaySizePx}
        height={displaySizePx}
        shapeRendering="crispEdges"
      >
        <rect width={SIZE} height={SIZE} fill={dk.white} />
        {matrix.flatMap((row, y) =>
          row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={dk.text} /> : null)),
        )}
      </svg>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: logoSz,
          height: logoSz,
          borderRadius: 1.5,
          bgcolor: dk.surfaceStrong,
          color: dk.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 900,
          fontSize: fontPx,
          border: `3px solid ${dk.white}`,
        }}
      >
        {logoLetter}
      </Box>
    </Box>
  );
}

function FullQRCodeCard({
  dk,
  url,
  setUrl,
  reset,
}: {
  dk: DesignKitPalette;
  url: string;
  setUrl: (v: string) => void;
  reset: () => void;
}) {
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
      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
        QR code de profil
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
        SVG fait main · scan-friendly (démo).
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems="center">
        <WireframeProfileQRThumb encodedUrl={url} displaySizePx={150} />

        <Box sx={{ flex: 1, width: "100%" }}>
          <TextField
            fullWidth
            label="URL encodée"
            size="small"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ mb: 1.5 }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              startIcon={<Download />}
              disableElevation
              sx={{
                textTransform: "none",
                fontWeight: 800,
                bgcolor: dk.surfaceStrong,
                color: dk.white,
                borderRadius: 9999,
                "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
              }}
            >
              Télécharger
            </Button>
            <Button
              startIcon={<Refresh />}
              onClick={reset}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                color: "primary.main",
                borderRadius: 9999,
                border: `1px solid ${alpha(dk.border, 0.3)}`,
              }}
            >
              Reset
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

export default function WireframeQRCode() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [url, setUrl] = useState(DEFAULT_ENCODE_URL);

  const reset = useCallback(() => setUrl(DEFAULT_ENCODE_URL), []);

  return <FullQRCodeCard dk={dk} url={url} setUrl={setUrl} reset={reset} />;
}
