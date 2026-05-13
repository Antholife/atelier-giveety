"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Marker = {
  id: string;
  x: number;
  y: number;
  title: string;
  org: string;
  spots: number;
};

const MARKERS: Marker[] = [
  { id: "m1", x: 22, y: 38, title: "Maraude", org: "Petits Frères", spots: 3 },
  { id: "m2", x: 58, y: 28, title: "Atelier FLE", org: "Singa", spots: 2 },
  { id: "m3", x: 72, y: 58, title: "Festival", org: "Coop Culture", spots: 8 },
  { id: "m4", x: 38, y: 65, title: "Berges", org: "Surfrider", spots: 12 },
  { id: "m5", x: 82, y: 78, title: "Mini-foot", org: "Sport pour Tous", spots: 4 },
];

export default function WireframeMissionMap() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [active, setActive] = useState<string | null>("m2");
  const activeMarker = MARKERS.find((m) => m.id === active) ?? null;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: `linear-gradient(135deg, ${alpha(dk.primaryLight, 0.7)} 0%, ${alpha(dk.mint, 0.5)} 100%)`,
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 100 56"
          preserveAspectRatio="none"
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              x2={100}
              y1={i * 8}
              y2={i * 8}
              stroke={alpha(dk.border, 0.1)}
              strokeWidth={0.2}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`v-${i}`}
              y1={0}
              y2={56}
              x1={i * 9}
              x2={i * 9}
              stroke={alpha(dk.border, 0.1)}
              strokeWidth={0.2}
            />
          ))}
          <path
            d="M 10 28 Q 30 12 50 22 T 95 30"
            fill="none"
            stroke={alpha(dk.surfaceStrong, 0.25)}
            strokeWidth={1.2}
            strokeDasharray="2 2"
          />
          <path
            d="M 5 45 Q 25 42 55 48 T 95 50"
            fill="none"
            stroke={alpha(dk.surfaceStrong, 0.18)}
            strokeWidth={1}
            strokeDasharray="1.5 2"
          />
        </Box>

        {MARKERS.map((m) => {
          const isActive = active === m.id;
          return (
            <Box
              key={m.id}
              role="button"
              tabIndex={0}
              onClick={() => setActive(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(m.id);
                }
              }}
              sx={{
                position: "absolute",
                left: `${m.x}%`,
                top: `${m.y}%`,
                transform: "translate(-50%, -100%)",
                cursor: "pointer",
                outline: "none",
              }}
              aria-label={m.title}
            >
              <Box
                sx={{
                  width: isActive ? 32 : 24,
                  height: isActive ? 32 : 24,
                  borderRadius: "50% 50% 50% 0",
                  transform: "rotate(-45deg)",
                  bgcolor: isActive ? dk.tertiary : dk.surfaceStrong,
                  border: `2px solid ${dk.white}`,
                  boxShadow: `0 4px 12px ${alpha("#000", 0.25)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  "&::after": isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        inset: -8,
                        borderRadius: "50%",
                        border: `2px solid ${alpha(dk.tertiary, 0.5)}`,
                        animation: "wf-map-pulse 1.6s infinite",
                        "@keyframes wf-map-pulse": {
                          "0%": { opacity: 1, transform: "scale(0.8)" },
                          "100%": { opacity: 0, transform: "scale(1.4)" },
                        },
                      }
                    : undefined,
                }}
              >
                <Typography
                  sx={{
                    transform: "rotate(45deg)",
                    color: dk.white,
                    fontSize: isActive ? 13 : 10,
                    fontWeight: 800,
                  }}
                >
                  {m.spots}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {activeMarker ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2.5,
            py: 1.75,
            borderTop: `1px solid ${alpha(dk.border, 0.12)}`,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: "primary.main" }} noWrap>
              {activeMarker.title}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              {activeMarker.org} · {activeMarker.spots} places restantes
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 9999,
              bgcolor: alpha(dk.tertiary, 0.15),
              color: dk.tertiary,
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            Voir
          </Box>
        </Stack>
      ) : null}
    </Box>
  );
}
