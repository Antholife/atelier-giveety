"use client";

import { ExpandMore, Map, Search } from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";
import WireframeFilterBar from "./WireframeFilterBar";
import WireframeFloatingSubNav from "./WireframeFloatingSubNav";
import WireframeManagementNav from "./WireframeManagementNav";
import WireframeMissionDetailCard, { type WireframeMissionDetailPayload } from "./WireframeMissionDetailCard";
import WireframeMissionMap, { MISSION_MAP_PINS, type MissionMapPin } from "./WireframeMissionMap";
import WireframeMissionMatchCard from "./WireframeMissionMatchCard";
import WireframeSearchPanel from "./WireframeSearchPanel";

const RADIUS_OPTIONS = [10, 15, 25, 40] as const;

const RESULT_COUNT: Record<(typeof RADIUS_OPTIONS)[number], number> = {
  10: 98,
  15: 127,
  25: 156,
  40: 203,
};

const DISCOVERY_ANCHORS = ["discovery-carte", "discovery-pourtoi", "discovery-liste"] as const satisfies readonly [
  string,
  string,
  string,
];

const SCROLL_ANCHOR_GAP = 88;

const MISSION_CARD_META: Record<
  string,
  Omit<WireframeMissionDetailPayload, "missionKey" | "title" | "totalSpots" | "registeredCount">
> = {
  m1: {
    orgVerification: "Les Petits Frères des Pauvres · vérifiée",
    chipA: "Solidarité",
    chipB: "Hebdo",
    when: "Sam. 18 mai · 19h",
    duration: "3 heures",
    lieu: "Plainpalais, Genève",
    prereqs: ["Être majeur·e", "Disponible 1× / semaine", "Tenue chaude"],
  },
  m2: {
    orgVerification: "Singa · vérifiée",
    chipA: "Solidarité",
    chipB: "Soir",
    when: "Mer. 21 mai · 18h30",
    duration: "2 heures",
    lieu: "Espace associatif, Plainpalais",
    prereqs: ["Français courant", "Patience et écoute", "Arriver 15 min avant"],
  },
  m3: {
    orgVerification: "Coop Culture · vérifiée",
    chipA: "Culture",
    chipB: "Week-end",
    when: "Ven. 23 — dim. 25 mai",
    duration: "Journées entières",
    lieu: "Parc La Grange",
    prereqs: ["Disponibilité week-end", "Bonne condition physique"],
  },
  m4: {
    orgVerification: "Surfrider Foundation Europe · vérifiée",
    chipA: "Environnement",
    chipB: "Matinée",
    when: "Dim. 17 mai · 9h30",
    duration: "4 heures",
    lieu: "Berges Plainpalais",
    prereqs: ["Tenue de récup + gants fournis", "À l’aise en extérieur"],
  },
  m5: {
    orgVerification: "Sport pour Tous · vérifiée",
    chipA: "Sport",
    chipB: "Samedi",
    when: "Sam. 24 mai · 14h",
    duration: "3 heures",
    lieu: "Gymnase Champel",
    prereqs: ["Savoir encadrer un groupe d’enfants", "Ponctualité"],
  },
};

function missionDetailFromPin(pin: MissionMapPin): WireframeMissionDetailPayload {
  const registeredCount = Math.max(0, pin.capacity - pin.spots);
  const meta = MISSION_CARD_META[pin.id];
  if (!meta) {
    return {
      missionKey: pin.id,
      title: pin.title,
      orgVerification: `${pin.org} · vérifiée`,
      chipA: "Mission",
      chipB: "Genève",
      when: "Dates à confirmer",
      duration: "Variable",
      lieu: "Genève et alentours",
      totalSpots: pin.capacity,
      registeredCount,
      prereqs: ["Profil complété"],
    };
  }
  return {
    missionKey: pin.id,
    title: pin.title,
    ...meta,
    totalSpots: pin.capacity,
    registeredCount,
  };
}

/** Hash initial → onglet synchronisé avec les ancres `#discovery-*`. */
function tabIndexFromHash(hash: string): number | null {
  const id = hash.replace(/^#/, "");
  const i = DISCOVERY_ANCHORS.indexOf(id as (typeof DISCOVERY_ANCHORS)[number]);
  return i >= 0 ? i : null;
}

/**
 * Page wireframe « Découvrir des missions » — même ADN que le dashboard (top nav,
 * fond page, cartes) pour enchaîner la démo dans le carrousel design kit.
 */
export default function WireframeMissionDiscoveryPage() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [radiusKm, setRadiusKm] = useState<(typeof RADIUS_OPTIONS)[number]>(15);
  const [radiusMenuAnchor, setRadiusMenuAnchor] = useState<HTMLElement | null>(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>(() => MISSION_MAP_PINS[1]!.id);

  const missionDetailPayload = useMemo(() => {
    const pin =
      MISSION_MAP_PINS.find((p) => p.id === selectedMarkerId) ?? MISSION_MAP_PINS[1]!;
    return missionDetailFromPin(pin);
  }, [selectedMarkerId]);

  const resultCount = RESULT_COUNT[radiusKm];

  useEffect(() => {
    const apply = () => {
      const idx = tabIndexFromHash(typeof window !== "undefined" ? window.location.hash : "");
      if (idx !== null) setViewIndex(idx);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.pageBg,
        border: `1px solid ${alpha(dk.border, 0.15)}`,
        p: { xs: 1.25, sm: 2 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <WireframeManagementNav
        initials="AR"
        spaceTag="Espace Contributeur"
        spaceOptions={["Espace Contributeur", "Espace Manager"]}
        links={[
          "Trouver une activité",
          "Tableau de bord",
          { label: "Notifications", badge: 3 },
          { label: "Messagerie", badge: 2 },
          "Mes récompenses",
        ]}
      />

      <Menu
        anchorEl={radiusMenuAnchor}
        open={Boolean(radiusMenuAnchor)}
        onClose={() => setRadiusMenuAnchor(null)}
        slotProps={{ paper: { sx: { borderRadius: 2, mt: 0.5 } } }}
      >
        {RADIUS_OPTIONS.map((km) => (
          <MenuItem
            key={km}
            selected={km === radiusKm}
            onClick={() => {
              setRadiusKm(km);
              setRadiusMenuAnchor(null);
              setSnackbar(`Rayon à ${km} km — ${RESULT_COUNT[km]} résultats`);
            }}
          >
            Rayon {km} km
          </MenuItem>
        ))}
      </Menu>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
              <Search sx={{ fontSize: 22, color: "primary.main" }} />
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, sm: 22 }, color: "primary.main" }}>
                Trouver une mission
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              {resultCount} résultats autour de toi · tri par pertinence
            </Typography>
          </Box>
          <ButtonBase
            type="button"
            onClick={(e) => setRadiusMenuAnchor(e.currentTarget)}
            sx={{
              borderRadius: 2,
              px: 1.25,
              py: 0.75,
              border: `1px solid ${alpha(dk.border, 0.25)}`,
              bgcolor: dk.white,
              transition: "box-shadow 0.15s ease, border-color 0.15s ease",
              "&:hover": {
                borderColor: alpha(dk.tertiary, 0.45),
                boxShadow: `0 4px 14px ${alpha(dk.surfaceStrong, 0.08)}`,
              },
              "&:focus-visible": { boxShadow: `0 0 0 3px ${alpha(dk.tertiary, 0.35)}` },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: "text.secondary" }}>
              <Map sx={{ fontSize: 18, color: dk.tertiary }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Genève · rayon {radiusKm} km
              </Typography>
              <ExpandMore sx={{ fontSize: 18, color: dk.tertiary }} />
            </Stack>
          </ButtonBase>
        </Stack>

        <Box sx={{ alignSelf: "flex-start" }}>
          <WireframeFloatingSubNav
            options={["Carte", "Pour toi", "Liste"]}
            activeIndex={viewIndex}
            anchorSectionIds={DISCOVERY_ANCHORS}
            onActiveIndexChange={(i) => {
              setViewIndex(i);
            }}
          />
        </Box>

        <WireframeSearchPanel
          belowSearch={
            <Stack spacing={2}>
              <WireframeFilterBar />
              <Box
                id={DISCOVERY_ANCHORS[0]}
                sx={{
                  scrollMarginTop: SCROLL_ANCHOR_GAP,
                  outline: viewIndex === 0 ? `2px solid ${alpha(dk.tertiary, 0.5)}` : "none",
                  outlineOffset: viewIndex === 0 ? 6 : 0,
                  borderRadius: 3,
                  transition: "outline-color 0.2s ease, outline-offset 0.2s ease",
                  p: viewIndex === 0 ? 0.5 : 0,
                  m: viewIndex === 0 ? -0.5 : 0,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
                    alignItems: "stretch",
                  }}
                >
                  <Box sx={{ minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>
                    <WireframeMissionMap
                      fillHeight
                      selectedMarkerId={selectedMarkerId}
                      onSelectedMarkerIdChange={(id) => {
                        if (id) setSelectedMarkerId(id);
                      }}
                      onMarkerPick={(m) => {
                        setSnackbar(`${m.title} · ${m.org} · ${m.spots} places`);
                      }}
                      onVoirFiche={() => setSnackbar("Fiche mission ouverte")}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>
                    <WireframeMissionDetailCard stretchHeight mission={missionDetailPayload} />
                  </Box>
                </Box>
              </Box>
            </Stack>
          }
          betweenSearchAndResults={
            <Box
              id={DISCOVERY_ANCHORS[1]}
              sx={{
                scrollMarginTop: SCROLL_ANCHOR_GAP,
                outline: viewIndex === 1 ? `2px solid ${alpha(dk.tertiary, 0.5)}` : "none",
                outlineOffset: viewIndex === 1 ? 6 : 0,
                borderRadius: 3,
                transition: "outline-color 0.2s ease, outline-offset 0.2s ease",
                p: viewIndex === 1 ? 0.5 : 0,
                m: viewIndex === 1 ? -0.5 : 0,
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: "primary.main", mb: 1, px: 0.25 }}>
                Pour toi
              </Typography>
              <WireframeMissionMatchCard />
            </Box>
          }
          resultsSectionId={DISCOVERY_ANCHORS[2]}
          resultsHeader={
            <Stack spacing={0.25}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 16, sm: 18 }, color: "primary.main" }}>
                Toutes les activités
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {resultCount} résultats sur ce rayon
              </Typography>
            </Stack>
          }
          resultsSectionSx={{
            outline: viewIndex === 2 ? `2px solid ${alpha(dk.tertiary, 0.5)}` : "none",
            outlineOffset: viewIndex === 2 ? 6 : 0,
            borderRadius: 3,
            transition: "outline-color 0.2s ease, outline-offset 0.2s ease",
            p: viewIndex === 2 ? 0.5 : 0,
            m: viewIndex === 2 ? -0.5 : 0,
          }}
        />
      </Box>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={2800}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
