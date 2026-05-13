"use client";

import {
  Add,
  Block,
  Cancel,
  CheckCircle,
  Edit,
  MoreVert,
  RadioButtonUnchecked,
  Tune,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";
import WireframeManagementNav from "./WireframeManagementNav";

type TabKey = "overview" | "calendar" | "planning" | "docs";
type CellState = "na" | "open" | "yes" | "no";

const ACTIVITY_META = {
  title: "AEP 18.03-30.06.26",
  badges: ["Publique", "Ouvertes"] as const,
};

const PEOPLE = [
  { id: "p1", name: "Anthony Thetawaves", certified: true },
  { id: "p2", name: "Anthony Renevey", certified: false },
] as const;

const DAY_CHIPS = [
  { id: "d1", short: "Jeu 7", full: "Jeudi 7 mai" },
  { id: "d2", short: "Ven 8", full: "Vendredi 8 mai" },
  { id: "d3", short: "Sam 9", full: "Samedi 9 mai" },
  { id: "d4", short: "Dim 10", full: "Dimanche 10 mai" },
];

const SLOTS: {
  id: string;
  dayId: string;
  time: string;
  filled: number;
  cap: number;
}[] = [
  { id: "a", dayId: "d1", time: "11:00 – 16:00", filled: 0, cap: 10 },
  { id: "b", dayId: "d2", time: "9:00 – 14:00", filled: 1, cap: 10 },
  { id: "c", dayId: "d3", time: "9:00 – 14:00", filled: 1, cap: 10 },
  { id: "d", dayId: "d4", time: "14:00 – 18:00", filled: 0, cap: 8 },
];

function cellKey(slotId: string, personId: string) {
  return `${slotId}::${personId}`;
}

function parseKey(k: string): { slotId: string; personId: string } {
  const [slotId, personId] = k.split("::");
  return { slotId, personId };
}

const DAY_ORDER: Record<string, number> = {
  d1: 0,
  d2: 1,
  d3: 2,
  d4: 3,
};

function countYesInSlot(slotId: string, cells: Record<string, CellState>): number {
  return PEOPLE.reduce((acc, p) => acc + (cells[cellKey(slotId, p.id)] === "yes" ? 1 : 0), 0);
}

function isRowProcessed(cells: Record<string, CellState>, slotId: string, personId: string) {
  const s = cells[cellKey(slotId, personId)] ?? "open";
  return s === "yes" || s === "no";
}

function StatusToggle({
  value,
  onChange,
  dk,
}: {
  value: CellState;
  onChange: (v: CellState) => void;
  dk: DesignKitPalette;
}) {
  const iconSx = { fontSize: 18 };
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_, v: CellState | null) => v && onChange(v)}
      aria-label="Statut sur le créneau"
      sx={{
        flexWrap: "wrap",
        gap: 0.25,
        "& .MuiToggleButton-root": {
          px: 0.85,
          py: 0.35,
          borderColor: `${alpha(dk.border, 0.35)} !important`,
          "&.Mui-selected": {
            bgcolor: alpha(dk.tertiary, 0.14),
            borderColor: `${alpha(dk.tertiary, 0.55)} !important`,
          },
        },
      }}
    >
      <ToggleButton value="na" aria-label="Non applicable">
        <Block sx={{ ...iconSx, color: "text.disabled" }} />
      </ToggleButton>
      <ToggleButton value="open" aria-label="Disponible">
        <RadioButtonUnchecked sx={{ ...iconSx, color: "text.secondary" }} />
      </ToggleButton>
      <ToggleButton value="yes" aria-label="Validé">
        <CheckCircle sx={{ ...iconSx, color: dk.surfaceStrong }} />
      </ToggleButton>
      <ToggleButton value="no" aria-label="Refusé">
        <Cancel sx={{ ...iconSx, color: dk.tertiary }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default function WireframeActivityPlanning() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  const [tab, setTab] = useState<TabKey>("planning");
  const [dayFilter, setDayFilter] = useState<string | "all">("all");
  const [sortName, setSortName] = useState("name");
  const [sortDate, setSortDate] = useState("date");
  const [search, setSearch] = useState("");
  const [optFullSlots, setOptFullSlots] = useState(false);
  const [optProcessed, setOptProcessed] = useState(true);
  const [optPast, setOptPast] = useState(false);
  const [optEmpty, setOptEmpty] = useState(false);

  const [cells, setCells] = useState<Record<string, CellState>>(() => {
    const initial: Record<string, CellState> = {};
    SLOTS.forEach((s) => {
      PEOPLE.forEach((p) => {
        const k = cellKey(s.id, p.id);
        if (s.id === "b" && p.id === "p1") initial[k] = "yes";
        else if (s.id === "c" && p.id === "p2") initial[k] = "no";
        else if (s.id === "a" && p.id === "p1") initial[k] = "na";
        else initial[k] = "open";
      });
    });
    return initial;
  });

  /** Créneaux marqués validés côté manager (action « Valider ce créneau »). */
  const [validatedSlots, setValidatedSlots] = useState<Record<string, boolean>>({});
  const [snack, setSnack] = useState<string | null>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);

  const pushSnack = useCallback((msg: string) => {
    setSnack(msg);
  }, []);

  const setCell = useCallback((key: string, v: CellState) => {
    setCells((prev) => ({ ...prev, [key]: v }));
  }, []);

  const resetSelection = useCallback(() => {
    setCells(() => {
      const initial: Record<string, CellState> = {};
      SLOTS.forEach((s) => {
        PEOPLE.forEach((p) => {
          const k = cellKey(s.id, p.id);
          if (s.id === "b" && p.id === "p1") initial[k] = "yes";
          else if (s.id === "c" && p.id === "p2") initial[k] = "no";
          else if (s.id === "a" && p.id === "p1") initial[k] = "na";
          else initial[k] = "open";
        });
      });
      return initial;
    });
    setValidatedSlots({});
    pushSnack("Sélection réinitialisée (démo).");
  }, [pushSnack]);

  const slotsInView = useMemo(() => {
    let list = SLOTS.filter((s) => {
      if (dayFilter !== "all" && s.dayId !== dayFilter) return false;
      // « Dates passées » off → masquer le jeudi (d1) en démo
      if (!optPast && s.dayId === "d1") return false;
      const yes = countYesInSlot(s.id, cells);
      if (optFullSlots && yes < s.cap) return false;
      if (optEmpty && yes > 0) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      const oa = DAY_ORDER[a.dayId] ?? 0;
      const ob = DAY_ORDER[b.dayId] ?? 0;
      return sortDate === "date" ? oa - ob : ob - oa;
    });

    return list;
  }, [dayFilter, sortDate, optPast, optFullSlots, optEmpty, cells]);

  const sortedPeople = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = PEOPLE.filter((p) => (!q ? true : p.name.toLowerCase().includes(q)));
    list = [...list].sort((a, b) =>
      sortName === "name"
        ? a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
        : Number(b.certified) - Number(a.certified),
    );
    return list;
  }, [search, sortName]);

  const confirmSelection = useCallback(() => {
    const totalYes = SLOTS.reduce((acc, s) => acc + countYesInSlot(s.id, cells), 0);
    const pending = Object.values(validatedSlots).filter(Boolean).length;
    pushSnack(
      `Confirmation enregistrée (démo) : ${totalYes} inscription(s) « validée(s) », ${pending} créneau(x) validé(s) côté planning.`,
    );
  }, [cells, validatedSlots, pushSnack]);

  const validateSingleSlot = useCallback(
    (slotId: string, dayLabel: string, time: string) => {
      setValidatedSlots((prev) => ({ ...prev, [slotId]: true }));
      pushSnack(`Créneau validé : ${dayLabel} · ${time}`);
    },
    [pushSnack],
  );

  const tabSx = {
    minHeight: 44,
    textTransform: "none" as const,
    fontWeight: 700,
    fontSize: 14,
    "&.Mui-selected": { color: dk.tertiary },
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(dk.border, 0.12)}`,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(155deg, ${alpha(dk.tertiaryLight, 0.22)} 0%, ${dk.pageBg} 40%, ${alpha(dk.primaryLight, 0.16)} 100%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${alpha(dk.surfaceStrong, 0.055)} 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
          opacity: 0.75,
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <WireframeManagementNav
          initials="AR"
          spaceTag="Espace Manager"
          spaceOptions={["Espace Manager", "Espace Contributeur"]}
          links={["Activités", "Tableau de bord", "Contributee", "Statistiques"]}
        />

        {/* Bandeau activité */}
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1.5,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            borderBottom: `1px solid ${alpha(dk.border, 0.1)}`,
            bgcolor: alpha(dk.white, 0.72),
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography sx={{ fontWeight: 900, color: "primary.main", fontSize: { xs: 15, sm: 16 } }}>
            {ACTIVITY_META.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {ACTIVITY_META.badges.map((b) => (
              <Chip
                key={b}
                label={b}
                size="small"
                sx={{
                  fontWeight: 800,
                  bgcolor: alpha(dk.tertiary, 0.12),
                  color: dk.tertiary,
                  border: `1px solid ${alpha(dk.tertiary, 0.35)}`,
                }}
              />
            ))}
            <Button
              size="small"
              variant="contained"
              startIcon={<Edit sx={{ fontSize: 18 }} />}
              onClick={() => pushSnack("Édition activité (démo) — brouillon ouvert.")}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 999,
                bgcolor: dk.surfaceStrong,
                boxShadow: "none",
                "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.9), boxShadow: "none" },
              }}
            >
              Modifier
            </Button>
            <IconButton
              size="small"
              aria-label="Plus d'actions"
              sx={{ color: "text.secondary" }}
              onClick={(e) => setMoreMenuAnchor(e.currentTarget)}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={moreMenuAnchor}
              open={Boolean(moreMenuAnchor)}
              onClose={() => setMoreMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  setMoreMenuAnchor(null);
                  pushSnack("Export CSV (simulation).");
                }}
              >
                Exporter le planning
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMoreMenuAnchor(null);
                  pushSnack("Dupliquer la série (simulation).");
                }}
              >
                Dupliquer les créneaux
              </MenuItem>
            </Menu>
          </Stack>
        </Box>

        <Box sx={{ px: { xs: 1.25, sm: 2 }, pt: 1.5, bgcolor: alpha(dk.white, 0.55) }}>
          <Tabs
            value={tab}
            onChange={(_, v: TabKey) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 42,
              "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0", bgcolor: dk.tertiary },
            }}
          >
            <Tab label="Vue d'ensemble" value="overview" sx={tabSx} />
            <Tab label="Calendrier" value="calendar" sx={tabSx} />
            <Tab label="Planification" value="planning" sx={tabSx} />
            <Tab label="Documents" value="docs" sx={tabSx} />
          </Tabs>
        </Box>

        {tab === "planning" ? (
          <Box sx={{ px: { xs: 1.25, sm: 2 }, pb: { xs: 2, sm: 2.5 }, pt: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              spacing={1.5}
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "primary.main", lineHeight: 1.2 }}>
                  Planification
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() =>
                  pushSnack(
                    "Nouveau créneau (démo) — ouvre le flux d’ajout (horaire, capacité, invitation).",
                  )
                }
                sx={{
                  alignSelf: { xs: "stretch", sm: "center" },
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 800,
                  px: 2.5,
                  bgcolor: dk.surfaceStrong,
                  boxShadow: "none",
                  "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.92), boxShadow: "none" },
                }}
              >
                Ajouter
              </Button>
            </Stack>

            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2.5,
                bgcolor: alpha(dk.white, 0.92),
                border: `1px solid ${alpha(dk.border, 0.12)}`,
                boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.05)}`,
                mb: 2,
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                useFlexGap
                sx={{ mb: 1.5 }}
              >
                <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 160 } }}>
                  <InputLabel id="wf-plan-sort-name">Trier par nom</InputLabel>
                  <Select
                    labelId="wf-plan-sort-name"
                    name="wf-plan-sort-name"
                    label="Trier par nom"
                    value={sortName}
                    onChange={(e) => setSortName(String(e.target.value))}
                  >
                    <MenuItem value="name">Trier par nom</MenuItem>
                    <MenuItem value="role">Trier par rôle</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 160 } }}>
                  <InputLabel id="wf-plan-sort-date">Trier par date</InputLabel>
                  <Select
                    labelId="wf-plan-sort-date"
                    name="wf-plan-sort-date"
                    label="Trier par date"
                    value={sortDate}
                    onChange={(e) => setSortDate(String(e.target.value))}
                  >
                    <MenuItem value="date">Du plus proche</MenuItem>
                    <MenuItem value="date-desc">Du plus lointain</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  fullWidth
                  name="wf-plan-search"
                  placeholder="Rechercher un contributeur…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ flex: 1 }}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  flexWrap: "wrap",
                  rowGap: 1,
                  pt: 1,
                  borderTop: `1px dashed ${alpha(dk.border, 0.25)}`,
                }}
              >
                <Tune sx={{ fontSize: 20, color: "text.secondary" }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", mr: 0.5 }}>
                  Affichage
                </Typography>
                <FormControlLabel
                  control={<Switch size="small" checked={optFullSlots} onChange={(e) => setOptFullSlots(e.target.checked)} />}
                  label={<Typography variant="body2">Plages complètes</Typography>}
                />
                <FormControlLabel
                  control={<Switch size="small" checked={optProcessed} onChange={(e) => setOptProcessed(e.target.checked)} />}
                  label={<Typography variant="body2">Inscriptions traitées</Typography>}
                />
                <FormControlLabel
                  control={<Switch size="small" checked={optPast} onChange={(e) => setOptPast(e.target.checked)} />}
                  label={<Typography variant="body2">Dates passées</Typography>}
                />
                <FormControlLabel
                  control={<Switch size="small" checked={optEmpty} onChange={(e) => setOptEmpty(e.target.checked)} />}
                  label={<Typography variant="body2">Créneaux vides</Typography>}
                />
              </Stack>
            </Box>

            {/* Filtre jours — chips scrollables */}
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", mb: 1 }}>
              Jour
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: "auto",
                pb: 1,
                mb: 2,
                "&::-webkit-scrollbar": { height: 6 },
              }}
            >
              <Chip
                label="Toute la période"
                onClick={() => setDayFilter("all")}
                variant={dayFilter === "all" ? "filled" : "outlined"}
                sx={{
                  fontWeight: 800,
                  flexShrink: 0,
                  bgcolor: dayFilter === "all" ? dk.surfaceStrong : undefined,
                  color: dayFilter === "all" ? dk.white : undefined,
                }}
              />
              {DAY_CHIPS.map((d) => (
                <Chip
                  key={d.id}
                  label={d.short}
                  onClick={() => setDayFilter(d.id)}
                  variant={dayFilter === d.id ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 700,
                    flexShrink: 0,
                    bgcolor: dayFilter === d.id ? alpha(dk.tertiary, 0.92) : undefined,
                    color: dayFilter === d.id ? dk.white : undefined,
                  }}
                />
              ))}
            </Stack>

            {/* Créneau = carte ; personnes = lignes */}
            {slotsInView.length === 0 ? (
              <Box
                sx={{
                  py: 4,
                  px: 2,
                  borderRadius: 2.5,
                  textAlign: "center",
                  bgcolor: alpha(dk.white, 0.55),
                  border: `1px dashed ${alpha(dk.border, 0.35)}`,
                }}
              >
                <Typography sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Aucun créneau ne correspond aux filtres (jour, tri, options d’affichage).
                </Typography>
                <Button sx={{ mt: 1.5, textTransform: "none", fontWeight: 700 }} onClick={() => {
                  setDayFilter("all");
                  setOptFullSlots(false);
                  setOptEmpty(false);
                  setOptPast(true);
                  pushSnack("Filtres réinitialisés.");
                }}>
                  Réinitialiser les filtres
                </Button>
              </Box>
            ) : (
            <Stack spacing={1.75}>
              {slotsInView.map((slot) => {
                const day = DAY_CHIPS.find((d) => d.id === slot.dayId);
                const yesCount = countYesInSlot(slot.id, cells);
                const pct = Math.min(100, Math.round((yesCount / slot.cap) * 100));
                const rows = sortedPeople.filter((person) => {
                  if (optProcessed) return true;
                  return !isRowProcessed(cells, slot.id, person.id);
                });
                const isSlotValidated = Boolean(validatedSlots[slot.id]);
                return (
                  <Box
                    key={slot.id}
                    sx={{
                      position: "relative",
                      borderRadius: 2.5,
                      overflow: "hidden",
                      bgcolor: isSlotValidated ? alpha(dk.surfaceMuted, 0.55) : dk.canvas,
                      opacity: isSlotValidated ? 0.92 : 1,
                      filter: isSlotValidated ? "grayscale(0.25)" : "none",
                      border: `1px solid ${alpha(dk.border, isSlotValidated ? 0.22 : 0.14)}`,
                      borderLeft: isSlotValidated ? `4px solid ${dk.surfaceStrong}` : undefined,
                      boxShadow: isSlotValidated
                        ? `inset 0 0 0 1px ${alpha(dk.surfaceStrong, 0.12)}`
                        : `0 4px 20px ${alpha(dk.surfaceStrong, 0.04)}`,
                      transition: "opacity 0.2s ease, filter 0.2s ease, background-color 0.2s ease",
                      ...(isSlotValidated
                        ? {
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              inset: 0,
                              pointerEvents: "none",
                              background: `repeating-linear-gradient(
                                -12deg,
                                ${alpha(dk.border, 0)} 0px,
                                ${alpha(dk.border, 0)} 10px,
                                ${alpha(dk.surfaceStrong, 0.03)} 10px,
                                ${alpha(dk.surfaceStrong, 0.03)} 11px
                              )`,
                              zIndex: 0,
                            },
                          }
                        : {}),
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        px: { xs: 1.5, sm: 2 },
                        py: 1.25,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        background: isSlotValidated
                          ? `linear-gradient(100deg, ${alpha(dk.surfaceStrong, 0.08)} 0%, ${alpha(dk.white, 0.85)} 60%)`
                          : `linear-gradient(100deg, ${alpha(dk.primaryLight, 0.12)} 0%, ${alpha(dk.white, 1)} 55%)`,
                        borderBottom: `1px solid ${alpha(dk.border, 0.08)}`,
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>{day?.full}</Typography>
                          {isSlotValidated ? (
                            <Chip
                              icon={<CheckCircle sx={{ fontSize: 18 }} />}
                              label="Créneau validé"
                              size="small"
                              sx={{
                                fontWeight: 900,
                                fontSize: 11,
                                bgcolor: dk.surfaceStrong,
                                color: dk.white,
                                border: "none",
                                "& .MuiChip-icon": { color: `${dk.white} !important` },
                                "& .MuiChip-label": { px: 0.75 },
                              }}
                            />
                          ) : null}
                        </Stack>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                          {slot.time}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          label={`${yesCount}/${slot.cap}`}
                          sx={{
                            fontWeight: 800,
                            bgcolor: pct >= 90 ? alpha(dk.tertiary, 0.15) : alpha(dk.surfaceStrong, 0.1),
                            color: "primary.main",
                          }}
                        />
                        <Box
                          sx={{
                            width: 72,
                            height: 6,
                            borderRadius: 999,
                            bgcolor: alpha(dk.border, 0.25),
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${pct}%`,
                              height: "100%",
                              borderRadius: 999,
                              bgcolor: dk.surfaceStrong,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </Box>
                      </Stack>
                    </Box>

                    <Stack
                      divider={<Box sx={{ borderBottom: `1px solid ${alpha(dk.border, 0.08)}` }} />}
                      sx={{ position: "relative", zIndex: 1 }}
                    >
                      {rows.length === 0 ? (
                        <Typography variant="body2" sx={{ px: 2, py: 2, color: "text.secondary", fontWeight: 600 }}>
                          Aucun contributeur à afficher (recherche ou option « inscriptions traitées » masque les lignes).
                        </Typography>
                      ) : (
                        rows.map((person) => {
                        const k = cellKey(slot.id, person.id);
                        const state = cells[k] ?? "open";
                        return (
                          <Stack
                            key={person.id}
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            justifyContent="space-between"
                            spacing={1.25}
                            sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}
                          >
                            <Stack direction="row" spacing={1.25} alignItems="center">
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  bgcolor: alpha(dk.surfaceStrong, 0.1),
                                  color: "primary.main",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 900,
                                  fontSize: 13,
                                  flexShrink: 0,
                                }}
                              >
                                {person.name
                                  .split(" ")
                                  .map((x) => x[0])
                                  .join("")
                                  .slice(0, 2)}
                              </Box>
                              <Box>
                                <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
                                  <Typography sx={{ fontWeight: 800 }}>{person.name}</Typography>
                                  {person.certified ? (
                                    <Chip
                                      label="Certifié"
                                      size="small"
                                      sx={{
                                        height: 22,
                                        fontWeight: 800,
                                        fontSize: 10,
                                        bgcolor: alpha(dk.surfaceStrong, 0.12),
                                        color: dk.surfaceStrong,
                                      }}
                                    />
                                  ) : null}
                                </Stack>
                              </Box>
                            </Stack>

                            <StatusToggle value={state} onChange={(v) => setCell(k, v)} dk={dk} />
                          </Stack>
                        );
                      }))}
                    </Stack>

                    <Box
                      sx={{
                        px: 2,
                        py: 1.25,
                        display: "flex",
                        justifyContent: "flex-end",
                        position: "relative",
                        zIndex: 1,
                        bgcolor: isSlotValidated
                          ? alpha(dk.surfaceStrong, 0.12)
                          : alpha(dk.surfaceMuted, 0.25),
                        borderTop: `1px solid ${alpha(dk.border, 0.06)}`,
                      }}
                    >
                      <Button
                        size="small"
                        disabled={Boolean(validatedSlots[slot.id])}
                        onClick={() =>
                          validateSingleSlot(slot.id, day?.full ?? "", slot.time)
                        }
                        sx={{
                          textTransform: "none",
                          fontWeight: 800,
                          color: validatedSlots[slot.id] ? "text.secondary" : dk.tertiary,
                          borderRadius: 999,
                        }}
                      >
                        {validatedSlots[slot.id] ? "Créneau déjà validé · ✓" : "Valider ce créneau"}
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="flex-end"
              sx={{ mt: 3, pt: 2, borderTop: `1px solid ${alpha(dk.border, 0.12)}` }}
            >
              <Button
                variant="outlined"
                onClick={resetSelection}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: dk.surfaceStrong,
                  color: dk.surfaceStrong,
                }}
              >
                Réinitialiser la sélection
              </Button>
              <Button
                variant="contained"
                onClick={confirmSelection}
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 800,
                  px: 3,
                  bgcolor: dk.tertiary,
                  color: dk.white,
                  boxShadow: "none",
                  "&:hover": { bgcolor: alpha(dk.tertiary, 0.9), boxShadow: "none" },
                }}
              >
                Confirmer la sélection
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ minHeight: 160 }} />
        )}
      </Box>

      <Snackbar
        open={snack !== null}
        onClose={() => setSnack(null)}
        autoHideDuration={4200}
        message={snack ?? ""}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
