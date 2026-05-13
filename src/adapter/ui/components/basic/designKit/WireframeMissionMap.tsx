"use client";

import { Box, ButtonBase, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

export type MissionMapPin = {
  id: string;
  x: number;
  y: number;
  title: string;
  org: string;
  /** Places restantes (affiché sur le pin + pied de carte) */
  spots: number;
  /** Places totales sur la fiche à droite (inscrits = capacity - spots) */
  capacity: number;
};

export const MISSION_MAP_PINS: readonly MissionMapPin[] = [
  { id: "m1", x: 22, y: 38, title: "Maraude", org: "Petits Frères", spots: 3, capacity: 8 },
  { id: "m2", x: 58, y: 28, title: "Atelier FLE", org: "Singa", spots: 2, capacity: 8 },
  { id: "m3", x: 72, y: 58, title: "Festival", org: "Coop Culture", spots: 8, capacity: 16 },
  { id: "m4", x: 38, y: 65, title: "Berges", org: "Surfrider", spots: 12, capacity: 20 },
  { id: "m5", x: 82, y: 78, title: "Mini-foot", org: "Sport pour Tous", spots: 4, capacity: 10 },
];

type WireframeMissionMapProps = {
  selectedMarkerId?: string | null;
  onSelectedMarkerIdChange?: (id: string | null, pin: MissionMapPin | null) => void;
  onMarkerPick?: (pin: MissionMapPin) => void;
  onVoirFiche?: () => void;
  /**
   * Remplit la hauteur du parent (ex. colonne 50 % à côté de la fiche).
   * Sans cela, la zone carte garde un ratio 16/9.
   */
  fillHeight?: boolean;
};

/** @deprecated utilisez MISSION_MAP_PINS — conservé pour ne pas casser d’anciens imports */
export type Marker = MissionMapPin;

export default function WireframeMissionMap({
  selectedMarkerId,
  onSelectedMarkerIdChange,
  onMarkerPick,
  onVoirFiche,
  fillHeight,
}: WireframeMissionMapProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  const isControlled = selectedMarkerId !== undefined;
  const [uncontrolledActive, setUncontrolledActive] = useState<string | null>(() => MISSION_MAP_PINS[1]?.id ?? null);

  const activeId = isControlled ? (selectedMarkerId ?? null) : uncontrolledActive;

  const setActivePin = (pinId: string) => {
    const pin = MISSION_MAP_PINS.find((m) => m.id === pinId) ?? null;
    if (!pin) return;
    if (!isControlled) setUncontrolledActive(pinId);
    onSelectedMarkerIdChange?.(pinId, pin);
    onMarkerPick?.(pin);
  };

  const activePin = MISSION_MAP_PINS.find((m) => m.id === activeId) ?? null;

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.08)}`,
        overflow: "hidden",
        ...(fillHeight
          ? {
              height: "100%",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }
          : {}),
      }}
    >
      <Box
        sx={{
          position: "relative",
          ...(fillHeight ? { flex: 1, minHeight: { xs: 200, md: 220 } } : { aspectRatio: "16 / 9" }),
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

        {MISSION_MAP_PINS.map((m) => {
          const isActive = activeId === m.id;
          return (
            <Box
              key={m.id}
              role="button"
              tabIndex={0}
              onClick={() => setActivePin(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActivePin(m.id);
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
              aria-current={isActive ? "true" : undefined}
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

      {activePin ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            flexShrink: 0,
            px: 2.5,
            py: 1.75,
            borderTop: `1px solid ${alpha(dk.border, 0.12)}`,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: "primary.main" }} noWrap>
              {activePin.title}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              {activePin.org} · {activePin.spots} places restantes
            </Typography>
          </Box>
          <ButtonBase
            type="button"
            onClick={onVoirFiche}
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 9999,
              bgcolor: alpha(dk.tertiary, 0.15),
              color: dk.tertiary,
              fontWeight: 800,
              fontSize: 12,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                bgcolor: alpha(dk.tertiary, 0.22),
                transform: "translateY(-1px)",
              },
              "&:focus-visible": {
                boxShadow: `0 0 0 3px ${alpha(dk.tertiary, 0.35)}`,
              },
            }}
          >
            Voir la fiche
          </ButtonBase>
        </Stack>
      ) : null}
    </Box>
  );
}
