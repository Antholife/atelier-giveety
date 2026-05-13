"use client";

import {
  Add,
  CalendarMonth,
  CheckCircleOutline,
  Group,
  Notifications,
  Person,
  Search,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";
import WireframeManagementNav from "./WireframeManagementNav";

type RepoTab = "contributee" | "partners";

type Row = {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  firstEngagement: string;
};

const MOCK_ROWS: Row[] = [
  {
    id: "1",
    lastName: "C78",
    firstName: "Nico",
    email: "c78@example.org",
    phone: "+41 78 000 00 01",
    firstEngagement: "12.04.2024",
  },
  {
    id: "2",
    lastName: "Ripley",
    firstName: "Ellen",
    email: "ripley@nostromo.io",
    phone: "+33 6 12 34 56 78",
    firstEngagement: "03.11.2025",
  },
  {
    id: "3",
    lastName: "Contrib 2",
    firstName: "Yoann",
    email: "yoann.contrib@giveety.app",
    phone: "—",
    firstEngagement: "—",
  },
  {
    id: "4",
    lastName: "Martin",
    firstName: "Léa",
    email: "lea.m@mail.test",
    phone: "+41 79 111 22 33",
    firstEngagement: "28.02.2025",
  },
  {
    id: "5",
    lastName: "Bernard",
    firstName: "Sam",
    email: "sam.bernard@test.org",
    phone: "+33 7 98 76 54 32",
    firstEngagement: "15.01.2026",
  },
];

const FILTER_CHIPS: { id: string; label: string; icon: typeof Person }[] = [
  { id: "account", label: "Compte Giveety", icon: Person },
  { id: "managed", label: "Profil administré", icon: Group },
  { id: "upcoming", label: "Engagé prochainement", icon: CalendarMonth },
  { id: "free", label: "Libre", icon: CheckCircleOutline },
  { id: "notif", label: "Notifications", icon: Notifications },
];

export default function WireframeContributorDirectory() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  const [tab, setTab] = useState<RepoTab>("contributee");
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [snack, setSnack] = useState<string | null>(null);

  const pushSnack = useCallback((msg: string) => setSnack(msg), []);

  const toggleFilter = useCallback((id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_ROWS.filter((r) => {
      if (!q) return true;
      const blob = `${r.lastName} ${r.firstName} ${r.email} ${r.phone} ${r.firstEngagement}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query]);

  const toggleRow = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === filteredRows.length) return new Set();
      return new Set(filteredRows.map((r) => r.id));
    });
  }, [filteredRows]);

  const tabSx = {
    minHeight: 42,
    textTransform: "none" as const,
    fontWeight: 800,
    fontSize: 15,
    "&.Mui-selected": { color: dk.tertiary },
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(dk.border, 0.12)}`,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(152deg, ${alpha(dk.tertiaryLight, 0.2)} 0%, ${dk.pageBg} 42%, ${alpha(dk.primaryLight, 0.14)} 100%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${alpha(dk.surfaceStrong, 0.052)} 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
          opacity: 0.78,
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

        <Box sx={{ px: { xs: 1.5, sm: 2, md: 2.5 }, pt: 2, pb: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: 0.3 }}
          >
            Espace Manager &gt; Répertoire
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={1.5}
            sx={{ mt: 1 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, color: "primary.main" }}>
              Contributee
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => pushSnack("Création d’un profil Contributee (démo).")}
              sx={{
                alignSelf: { xs: "stretch", sm: "auto" },
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 800,
                px: 2.5,
                bgcolor: dk.tertiary,
                color: dk.white,
                boxShadow: "none",
                "&:hover": { bgcolor: alpha(dk.tertiary, 0.9), boxShadow: "none" },
              }}
            >
              Créer un Contributee
            </Button>
          </Stack>

          <Tabs
            value={tab}
            onChange={(_, v: RepoTab) => setTab(v)}
            sx={{
              mt: 2,
              minHeight: 40,
              "& .MuiTabs-indicator": { height: 3, bgcolor: dk.tertiary, borderRadius: "3px 3px 0 0" },
              borderBottom: `1px solid ${alpha(dk.border, 0.12)}`,
            }}
          >
            <Tab label="Contributee" value="contributee" sx={tabSx} />
            <Tab label="Partenaires" value="partners" sx={tabSx} />
          </Tabs>
        </Box>

        {tab === "contributee" ? (
          <Box sx={{ px: { xs: 1.5, sm: 2, md: 2.5 }, pb: { xs: 2.5, sm: 3 }, pt: 2 }}>
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2.5,
                bgcolor: alpha(dk.white, 0.94),
                border: `1px solid ${alpha(dk.border, 0.1)}`,
                boxShadow: `0 10px 36px ${alpha(dk.surfaceStrong, 0.05)}`,
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                size="small"
                name="wf-repo-search"
                placeholder="Rechercher par nom, prénom, email ou dates…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") pushSnack(`Recherche « ${query || "…"} » (démo).`);
                }}
                InputProps={{
                  sx: { borderRadius: 999, pr: 0.5 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Search sx={{ fontSize: 18 }} />}
                        onClick={() => pushSnack(`Recherche « ${query || "tous les profils"} » (démo).`)}
                        sx={{
                          borderRadius: 999,
                          textTransform: "none",
                          fontWeight: 800,
                          px: 2,
                          minWidth: "auto",
                          bgcolor: dk.tertiary,
                          boxShadow: "none",
                          "&:hover": { bgcolor: alpha(dk.tertiary, 0.88), boxShadow: "none" },
                        }}
                      >
                        Rechercher
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap", rowGap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
                Filtres :
              </Typography>
              {FILTER_CHIPS.map((f) => {
                const on = activeFilters.has(f.id);
                const Icon = f.icon;
                return (
                  <Chip
                    key={f.id}
                    icon={<Icon sx={{ fontSize: 18, color: on ? dk.white : "inherit !important" }} />}
                    label={f.label}
                    onClick={() => {
                      toggleFilter(f.id);
                    }}
                    sx={{
                      fontWeight: 700,
                      borderRadius: 999,
                      border: `1px solid ${alpha(dk.border, on ? 0 : 0.22)}`,
                      bgcolor: on ? dk.surfaceStrong : alpha(dk.white, 0.85),
                      color: on ? dk.white : "text.primary",
                    }}
                  />
                );
              })}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Checkbox
                  size="small"
                  checked={filteredRows.length > 0 && selected.size === filteredRows.length}
                  indeterminate={selected.size > 0 && selected.size < filteredRows.length}
                  onChange={toggleAll}
                  sx={{ p: 0.5 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                  {selected.size === 0
                    ? "Aucune sélection"
                    : `${selected.size} sélectionné${selected.size > 1 ? "s" : ""}`}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                {filteredRows.length} profil{filteredRows.length > 1 ? "s" : ""}
                {query.trim() ? ` · filtrés` : ""}
              </Typography>
            </Stack>

            <Stack spacing={1.25}>
              {filteredRows.map((r) => {
                const sel = selected.has(r.id);
                return (
                  <Box
                    key={r.id}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { sm: "center" },
                      gap: { xs: 1.5, sm: 2 },
                      p: { xs: 1.5, sm: 1.75 },
                      borderRadius: 2.5,
                      bgcolor: dk.canvas,
                      border: `1px solid ${alpha(dk.border, sel ? 0.28 : 0.14)}`,
                      boxShadow: sel
                        ? `0 6px 24px ${alpha(dk.tertiary, 0.12)}`
                        : `0 4px 18px ${alpha(dk.surfaceStrong, 0.04)}`,
                      transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                      "&:hover": {
                        borderColor: alpha(dk.tertiary, 0.35),
                        boxShadow: `0 8px 26px ${alpha(dk.surfaceStrong, 0.07)}`,
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
                      <Checkbox
                        size="small"
                        checked={sel}
                        onChange={() => toggleRow(r.id)}
                        sx={{ p: 0.5 }}
                      />
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: alpha(dk.surfaceStrong, 0.1),
                          color: "primary.main",
                          fontWeight: 900,
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {r.firstName[0]}
                        {r.lastName[0]}
                      </Box>
                    </Stack>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 900, color: "primary.main" }}>
                        {r.lastName} {r.firstName}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", mt: 0.25 }}>
                        {r.email}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={r.phone === "—" ? "Tél. non renseigné" : r.phone}
                          sx={{ fontWeight: 700, borderRadius: 2, borderColor: alpha(dk.border, 0.35) }}
                        />
                        <Chip
                          size="small"
                          label={`1er engagement : ${r.firstEngagement}`}
                          sx={{
                            fontWeight: 800,
                            borderRadius: 2,
                            bgcolor: alpha(dk.primaryLight, 0.45),
                            color: "primary.main",
                          }}
                        />
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={0.5} sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}>
                      <IconButton
                        size="small"
                        aria-label={`Voir ${r.firstName}`}
                        onClick={() => pushSnack(`Fiche détail · ${r.lastName} ${r.firstName} (démo).`)}
                        sx={{
                          color: dk.tertiary,
                          border: `1px solid ${alpha(dk.tertiary, 0.35)}`,
                          bgcolor: alpha(dk.tertiary, 0.06),
                          "&:hover": { bgcolor: alpha(dk.tertiary, 0.14) },
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>

            {filteredRows.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography sx={{ fontWeight: 800, color: "text.secondary" }}>
                  Aucun résultat pour cette recherche.
                </Typography>
                <Button sx={{ mt: 1.5, textTransform: "none", fontWeight: 700 }} onClick={() => setQuery("")}>
                  Effacer la recherche
                </Button>
              </Box>
            ) : null}
          </Box>
        ) : (
          <Box sx={{ px: 2, py: 6, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 800, color: "text.secondary" }}>
              Partenaires
            </Typography>
            <Button
              sx={{ mt: 2, textTransform: "none", fontWeight: 800 }}
              onClick={() => setTab("contributee")}
            >
              Retour Contributee
            </Button>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snack !== null}
        onClose={() => setSnack(null)}
        autoHideDuration={3600}
        message={snack ?? ""}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
