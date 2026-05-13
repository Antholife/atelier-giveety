"use client";

import {
  AccessTime,
  Inventory2,
  MoreVert,
  Search,
  Tune,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
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
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";
import WireframeManagementNav from "./WireframeManagementNav";

type StatusTab =
  | "ongoing"
  | "prep"
  | "cancelled"
  | "done"
  | "archived"
  | "draft"
  | "all";

type ActivityKind = "Activités" | "Activités à engagement partiel" | "Missions";

type ActivityRow = {
  id: string;
  title: string;
  kind: ActivityKind;
  meta: string;
  status: StatusTab;
};

const STATUS_TABS: { id: StatusTab; label: string }[] = [
  { id: "ongoing", label: "En cours" },
  { id: "prep", label: "En préparation" },
  { id: "cancelled", label: "Annulées" },
  { id: "done", label: "Terminées" },
  { id: "archived", label: "Archivée" },
  { id: "draft", label: "Brouillons" },
  { id: "all", label: "Toutes" },
];

const MOCK_ACTIVITIES: ActivityRow[] = [
  {
    id: "a1",
    title: "Act. std 18-31.03.26 RP",
    kind: "Activités",
    meta: "Mars 2026 · Genève",
    status: "ongoing",
  },
  {
    id: "a2",
    title: "AEP 18.03-30.06.26",
    kind: "Activités à engagement partiel",
    meta: "Places restantes · certif.",
    status: "ongoing",
  },
  {
    id: "a3",
    title: "AEG 02.07-31.07.25",
    kind: "Missions",
    meta: "Collecte été",
    status: "ongoing",
  },
  {
    id: "a4",
    title: "Atelier sensibilisation Q2",
    kind: "Activités",
    meta: "Brouillon non publié",
    status: "draft",
  },
  {
    id: "a5",
    title: "Maraude hiver 2025",
    kind: "Missions",
    meta: "Clôturée · bilan envoyé",
    status: "done",
  },
  {
    id: "a6",
    title: "Pop-up solidaire (reporté)",
    kind: "Activités",
    meta: "Annulée le 02.04.26",
    status: "cancelled",
  },
  {
    id: "a7",
    title: "Formation bénévoles 2024",
    kind: "Activités",
    meta: "Archivée",
    status: "archived",
  },
  {
    id: "a8",
    title: "Week-end plantation",
    kind: "Activités à engagement partiel",
    meta: "Publication prévue",
    status: "prep",
  },
];

function kindAccent(dk: DesignKitPalette, kind: ActivityKind) {
  if (kind === "Missions") return dk.tertiary;
  if (kind === "Activités à engagement partiel") return alpha(dk.surfaceStrong, 0.85);
  return dk.surfaceStrong;
}

export default function WireframeManagerActivitiesList() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  const [statusTab, setStatusTab] = useState<StatusTab>("ongoing");
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  const [moreAnchor, setMoreAnchor] = useState<{ el: HTMLElement | null; id: string | null }>({
    el: null,
    id: null,
  });
  const [snack, setSnack] = useState<string | null>(null);

  const pushSnack = useCallback((m: string) => setSnack(m), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_ACTIVITIES.filter((a) => {
      if (statusTab !== "all" && a.status !== statusTab) return false;
      if (!q) return true;
      return `${a.title} ${a.kind} ${a.meta}`.toLowerCase().includes(q);
    });
  }, [statusTab, query]);

  const tabSx = {
    minHeight: 42,
    textTransform: "none" as const,
    fontWeight: 800,
    fontSize: 13,
    minWidth: { xs: "auto", sm: 96 },
    px: { xs: 1, sm: 1.5 },
    "&.Mui-selected": { color: dk.tertiary },
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(dk.border, 0.12)}`,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(148deg, ${alpha(dk.tertiaryLight, 0.18)} 0%, ${dk.pageBg} 44%, ${alpha(dk.primaryLight, 0.13)} 100%)`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${alpha(dk.surfaceStrong, 0.05)} 1px, transparent 1px)`,
          backgroundSize: "18px 18px",
          opacity: 0.82,
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

        <Box sx={{ px: { xs: 1.5, sm: 2.5 }, pt: 2.25, pb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
            Espace Manager &gt; Giveety_TestA &gt; Activités
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "primary.main", mt: 0.75, letterSpacing: "-0.02em" }}
          >
            Vos activités
          </Typography>
        </Box>

        <Box
          sx={{
            px: { xs: 1, sm: 2 },
            borderBottom: `1px solid ${alpha(dk.border, 0.1)}`,
            bgcolor: alpha(dk.white, 0.45),
          }}
        >
          <Tabs
            value={statusTab}
            onChange={(_, v: StatusTab) => setStatusTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 44,
              "& .MuiTabs-indicator": { height: 3, bgcolor: dk.tertiary, borderRadius: "3px 3px 0 0" },
            }}
          >
            {STATUS_TABS.map((t) => (
              <Tab key={t.id} value={t.id} label={t.label} sx={tabSx} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ px: { xs: 1.5, sm: 2.5 }, py: { xs: 2, sm: 2.5 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mb: 2 }}
            alignItems={{ sm: "center" }}
          >
            <TextField
              fullWidth
              size="small"
              name="wf-activities-search"
              placeholder="Rechercher une activité, un code, un lieu…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary", fontSize: 22 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 999,
                  bgcolor: alpha(dk.white, 0.95),
                  pl: 1,
                },
              }}
            />
            <Stack direction="row" spacing={0.75} alignItems="center" flexShrink={0}>
              <Chip
                icon={<Tune sx={{ fontSize: 18 }} />}
                label={compact ? "Vue dense" : "Vue confort"}
                onClick={() => setCompact((v) => !v)}
                sx={{
                  fontWeight: 800,
                  borderRadius: 999,
                  bgcolor: alpha(dk.white, 0.9),
                  border: `1px solid ${alpha(dk.border, 0.2)}`,
                }}
              />
            </Stack>
          </Stack>

          <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", mb: 1.5 }}>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            {statusTab !== "all" ? ` · ${STATUS_TABS.find((t) => t.id === statusTab)?.label}` : null}
          </Typography>

          <Stack spacing={compact ? 0.75 : 1.25}>
            {filtered.map((a) => {
              const accent = kindAccent(dk, a.kind);
              return (
                <Box
                  key={a.id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { md: "stretch" },
                    gap: { xs: 1.5, md: 2 },
                    p: compact ? { xs: 1.25, md: 1.5 } : { xs: 1.5, md: 2 },
                    borderRadius: 2.5,
                    bgcolor: alpha(dk.white, 0.96),
                    border: `1px solid ${alpha(dk.border, 0.1)}`,
                    boxShadow: `0 4px 20px ${alpha(dk.surfaceStrong, 0.035)}`,
                    borderLeft: `4px solid ${accent}`,
                    transition: "box-shadow 0.2s ease",
                    "&:hover": {
                      boxShadow: `0 10px 32px ${alpha(dk.surfaceStrong, 0.055)}`,
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Chip
                      label={a.kind}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: 10.5,
                        height: 24,
                        mb: 1,
                        bgcolor: alpha(accent, 0.1),
                        color: accent,
                        border: "none",
                      }}
                    />
                    <Typography sx={{ fontWeight: 900, color: "primary.main", lineHeight: 1.25 }}>
                      {a.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.75 }} flexWrap="wrap" useFlexGap>
                      <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                        {a.meta}
                      </Typography>
                      <Chip
                        label={STATUS_TABS.find((t) => t.id === a.status)?.label ?? ""}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700, borderRadius: 2, height: 22, fontSize: 10 }}
                      />
                    </Stack>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent={{ xs: "flex-end", md: "flex-end" }}
                    sx={{ alignSelf: { xs: "stretch", md: "center" } }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => pushSnack(`Ouverture · ${a.title} (démo).`)}
                      sx={{
                        flex: { xs: 1, md: "none" },
                        borderRadius: 999,
                        textTransform: "none",
                        fontWeight: 800,
                        px: 2.5,
                        py: 1,
                        boxShadow: "none",
                        bgcolor: dk.surfaceStrong,
                        "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.92), boxShadow: "none" },
                      }}
                    >
                      Accéder à l’activité
                    </Button>
                    <IconButton
                      aria-label="Plus d’options"
                      size="small"
                      onClick={(e) => setMoreAnchor({ el: e.currentTarget, id: a.id })}
                      sx={{ color: "text.secondary", border: `1px solid ${alpha(dk.border, 0.25)}` }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              );
            })}
          </Stack>

          {filtered.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Inventory2 sx={{ fontSize: 40, color: alpha(dk.border, 0.8), mb: 1 }} />
              <Typography sx={{ fontWeight: 800, color: "text.secondary" }}>
                Aucune activité pour ce filtre.
              </Typography>
              <Button
                sx={{ mt: 1.5, textTransform: "none", fontWeight: 800 }}
                onClick={() => {
                  setQuery("");
                  setStatusTab("all");
                }}
              >
                Voir toutes les activités
              </Button>
            </Box>
          ) : null}
        </Box>
      </Box>

      <Menu
        anchorEl={moreAnchor.el}
        open={Boolean(moreAnchor.el)}
        onClose={() => setMoreAnchor({ el: null, id: null })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            pushSnack("Dupliquer (démo)");
            setMoreAnchor({ el: null, id: null });
          }}
        >
          Dupliquer
        </MenuItem>
        <MenuItem
          onClick={() => {
            pushSnack("Exporter les inscrits (démo)");
            setMoreAnchor({ el: null, id: null });
          }}
        >
          Exporter les inscrits
        </MenuItem>
        <MenuItem
          onClick={() => {
            pushSnack("Archiver (démo)");
            setMoreAnchor({ el: null, id: null });
          }}
        >
          Archiver
        </MenuItem>
      </Menu>

      <Snackbar
        open={snack !== null}
        message={snack ?? ""}
        onClose={() => setSnack(null)}
        autoHideDuration={3200}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
