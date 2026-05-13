"use client";

import { Refresh } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Axis = {
  id: string;
  label: string;
  value: number;
};

const INITIAL: Axis[] = [
  { id: "ecoute", label: "Écoute", value: 0.85 },
  { id: "anim", label: "Animation", value: 0.7 },
  { id: "logi", label: "Logistique", value: 0.6 },
  { id: "comm", label: "Communication", value: 0.78 },
  { id: "media", label: "Médiation", value: 0.92 },
  { id: "tech", label: "Outils", value: 0.55 },
];

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 50;
const RINGS = 4;

function polar(angleRad: number, r: number) {
  return {
    x: CENTER + Math.cos(angleRad) * r,
    y: CENTER + Math.sin(angleRad) * r,
  };
}

export default function WireframeSkillRadar() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [axes, setAxes] = useState<Axis[]>(INITIAL);
  const [hovered, setHovered] = useState<string | null>(null);
  const [variant, setVariant] = useState(0);

  const angles = useMemo(
    () => axes.map((_, i) => (i / axes.length) * Math.PI * 2 - Math.PI / 2),
    [axes],
  );

  const valuesPath = useMemo(() => {
    const points = axes.map((a, i) => {
      const p = polar(angles[i], RADIUS * a.value);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    });
    return `M${points.join(" L")} Z`;
  }, [axes, angles]);

  const reshuffle = useCallback(() => {
    setVariant((v) => v + 1);
    setAxes((prev) =>
      prev.map((a) => ({
        ...a,
        value: Math.min(1, Math.max(0.25, a.value + (Math.random() - 0.5) * 0.4)),
      })),
    );
  }, []);

  const reset = useCallback(() => {
    setAxes(INITIAL);
    setVariant(0);
  }, []);

  const average = useMemo(
    () => axes.reduce((acc, a) => acc + a.value, 0) / axes.length,
    [axes],
  );

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Profil de compétences
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Niveau moyen{" "}
            <Box component="span" sx={{ color: "tertiary.main", fontWeight: 800 }}>
              {Math.round(average * 100)}%
            </Box>{" "}
            · variant #{variant}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Re-piocher des valeurs (démo)">
            <IconButton
              onClick={reshuffle}
              size="small"
              sx={{
                color: "primary.main",
                border: `1px solid ${alpha(dk.border, 0.3)}`,
              }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Réinitialiser">
            <IconButton
              onClick={reset}
              size="small"
              sx={{
                color: "text.secondary",
                border: `1px solid ${alpha(dk.border, 0.2)}`,
              }}
            >
              <Box component="span" sx={{ fontWeight: 800, fontSize: 12, lineHeight: 1 }}>
                ⟲
              </Box>
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <Box sx={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
          <Box
            component="svg"
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            sx={{ width: SIZE, height: SIZE, maxWidth: "100%" }}
            role="img"
            aria-label="Radar des compétences"
          >
            <defs>
              <radialGradient id="dk-radar-fill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={dk.tertiary} stopOpacity={0.55} />
                <stop offset="100%" stopColor={dk.surfaceStrong} stopOpacity={0.25} />
              </radialGradient>
            </defs>

            {Array.from({ length: RINGS }).map((_, ring) => {
              const r = (RADIUS * (ring + 1)) / RINGS;
              const points = angles
                .map((a) => {
                  const p = polar(a, r);
                  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
                })
                .join(" ");
              return (
                <polygon
                  key={ring}
                  points={points}
                  fill="none"
                  stroke={alpha(dk.border, 0.22)}
                  strokeDasharray={ring === RINGS - 1 ? "0" : "3 3"}
                />
              );
            })}

            {angles.map((a, i) => {
              const end = polar(a, RADIUS);
              return (
                <line
                  key={`axis-${i}`}
                  x1={CENTER}
                  y1={CENTER}
                  x2={end.x}
                  y2={end.y}
                  stroke={alpha(dk.border, 0.25)}
                />
              );
            })}

            <path
              d={valuesPath}
              fill="url(#dk-radar-fill)"
              stroke={dk.tertiary}
              strokeWidth={2}
              strokeLinejoin="round"
              style={{ transition: "d 0.4s ease" }}
            />

            {axes.map((axis, i) => {
              const p = polar(angles[i], RADIUS * axis.value);
              const isHover = hovered === axis.id;
              return (
                <g key={axis.id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHover ? 7 : 5}
                    fill={dk.white}
                    stroke={dk.surfaceStrong}
                    strokeWidth={2}
                    onMouseEnter={() => setHovered(axis.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                  />
                  {isHover ? (
                    <g>
                      <rect
                        x={p.x + 8}
                        y={p.y - 22}
                        width={Math.max(48, axis.label.length * 7 + 28)}
                        height={20}
                        rx={6}
                        fill={dk.surfaceStrong}
                      />
                      <text
                        x={p.x + 14}
                        y={p.y - 8}
                        fontSize={11}
                        fontWeight={700}
                        fill={dk.white}
                        fontFamily={theme.typography.fontFamily}
                      >
                        {Math.round(axis.value * 100)}%
                      </text>
                    </g>
                  ) : null}
                </g>
              );
            })}

            {axes.map((axis, i) => {
              const labelPos = polar(angles[i], RADIUS + 22);
              const angleDeg = (angles[i] * 180) / Math.PI;
              let anchor: "start" | "middle" | "end" = "middle";
              if (angleDeg > -80 && angleDeg < 80) anchor = "start";
              else if (angleDeg > 100 || angleDeg < -100) anchor = "end";
              return (
                <text
                  key={`label-${axis.id}`}
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fontSize={12}
                  fontWeight={hovered === axis.id ? 800 : 600}
                  fill={hovered === axis.id ? dk.tertiary : dk.text}
                  fontFamily={theme.typography.fontFamily}
                  style={{ cursor: "pointer", transition: "fill 0.15s ease" }}
                  onMouseEnter={() => setHovered(axis.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {axis.label}
                </text>
              );
            })}
          </Box>
        </Box>

        <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
          {axes.map((a) => {
            const isHover = hovered === a.id;
            return (
              <Stack
                key={a.id}
                direction="row"
                alignItems="center"
                spacing={1.5}
                onMouseEnter={() => setHovered(a.id)}
                onMouseLeave={() => setHovered(null)}
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                  bgcolor: isHover ? alpha(dk.tertiaryLight, 0.7) : "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isHover ? 800 : 600,
                    color: isHover ? "primary.main" : "text.primary",
                    minWidth: 110,
                  }}
                >
                  {a.label}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    height: 6,
                    borderRadius: 9999,
                    bgcolor: alpha(dk.border, 0.18),
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${a.value * 100}%`,
                      height: "100%",
                      borderRadius: 9999,
                      background: `linear-gradient(90deg, ${dk.surfaceStrong}, ${dk.tertiary})`,
                      transition: "width 0.4s ease",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "tertiary.main", minWidth: 36, textAlign: "right" }}
                >
                  {Math.round(a.value * 100)}%
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
