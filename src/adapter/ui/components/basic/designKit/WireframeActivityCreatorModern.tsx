"use client";

import {
  AccessTime,
  Add,
  AutoAwesome,
  CalendarMonth,
  Check,
  CheckCircle,
  ChevronRight,
  Close,
  DragIndicator,
  GpsFixed,
  InfoOutlined,
  LocationOn,
  Person,
  Preview,
  Public,
  Save,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useRef, useState } from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";
import WireframeManagementNav from "./WireframeManagementNav";

const SECTIONS = [
  { id: "offer", label: "Offre & certification", short: "Offre" },
  { id: "profile", label: "Profil recherché", short: "Profil" },
  { id: "logistics", label: "Infos pratiques", short: "Logistique" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function SectionShell({
  id,
  title,
  subtitle,
  step,
  total,
  dk,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  step: number;
  total: number;
  dk: DesignKitPalette;
  children: React.ReactNode;
}) {
  return (
    <Box
      id={id}
      sx={{
        scrollMarginTop: 96,
        borderRadius: 2.5,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.12)}`,
        overflow: "hidden",
        boxShadow: `0 2px 12px ${alpha(dk.surfaceStrong, 0.04)}`,
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 1.75,
          borderBottom: `1px solid ${alpha(dk.border, 0.08)}`,
          background: `linear-gradient(135deg, ${alpha(dk.primaryLight, 0.12)} 0%, ${alpha(dk.tertiaryLight, 0.08)} 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 0.8,
              color: dk.tertiary,
              textTransform: "uppercase",
            }}
          >
            Section {step}/{total}
          </Typography>
        </Stack>
        <Typography sx={{ fontWeight: 900, fontSize: { xs: 17, sm: 19 }, color: "primary.main" }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mt: 0.5 }}>
          {subtitle}
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>{children}</Box>
    </Box>
  );
}

function CertChoiceCard({
  selected,
  onSelect,
  title,
  desc,
  icon,
  dk,
  onInfo,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc: string;
  icon: React.ReactNode;
  dk: DesignKitPalette;
  onInfo: () => void;
}) {
  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <ButtonBase
        onClick={onSelect}
        sx={{
          width: "100%",
          textAlign: "left",
          borderRadius: 2.5,
          p: 2,
          display: "block",
          border: selected
            ? `2px solid ${dk.tertiary}`
            : `1px solid ${alpha(dk.border, 0.2)}`,
          bgcolor: selected ? alpha(dk.tertiary, 0.04) : dk.white,
          transition: "all 0.2s ease",
          position: "relative",
          "&:hover": {
            borderColor: dk.tertiary,
            boxShadow: `0 8px 24px ${alpha(dk.surfaceStrong, 0.06)}`,
          },
        }}
      >
        {selected ? (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 26,
              height: 26,
              borderRadius: "50%",
              bgcolor: dk.tertiary,
              color: dk.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check sx={{ fontSize: 16 }} />
          </Box>
        ) : null}
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              bgcolor: selected ? alpha(dk.tertiary, 0.15) : alpha(dk.surfaceMuted, 0.5),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, pr: 3 }}>
            <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>{title}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, lineHeight: 1.45 }}>
              {desc}
            </Typography>
          </Box>
        </Stack>
      </ButtonBase>
      <IconButton
        size="small"
        aria-label="Informations"
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
          color: "text.secondary",
          zIndex: 1,
          bgcolor: alpha(dk.white, 0.92),
          boxShadow: `0 1px 4px ${alpha(dk.border, 0.2)}`,
          "&:hover": { bgcolor: dk.white },
        }}
        onClick={(e) => {
          e.stopPropagation();
          onInfo();
        }}
      >
        <InfoOutlined sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}

function LivePreview({
  dk,
  activityTitle,
  teaser,
  locationLine,
  certLabel,
  placesLeft,
  onPostuler,
}: {
  dk: DesignKitPalette;
  activityTitle: string;
  teaser: string;
  locationLine: string;
  certLabel: string;
  placesLeft: number;
  onPostuler: () => void;
}) {
  return (
    <Box
      sx={{
        position: { xs: "relative", lg: "sticky" },
        top: { lg: 88 },
        borderRadius: 2.5,
        border: `1px solid ${alpha(dk.border, 0.15)}`,
        bgcolor: dk.white,
        overflow: "hidden",
        boxShadow: `0 12px 40px ${alpha(dk.surfaceStrong, 0.08)}`,
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          bgcolor: alpha(dk.surfaceStrong, 0.06),
          borderBottom: `1px solid ${alpha(dk.border, 0.1)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Visibility sx={{ fontSize: 16, color: dk.tertiary }} />
          <Typography sx={{ fontWeight: 800, fontSize: 12.5, color: "primary.main" }}>
            Aperçu contributeur
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
          <Chip label="Solidarité" size="small" sx={{ fontWeight: 800, bgcolor: dk.surfaceStrong, color: dk.white }} />
          <Chip label="Hebdo" size="small" sx={{ fontWeight: 700, bgcolor: alpha(dk.primaryLight, 0.35) }} />
        </Stack>
        <Typography sx={{ fontWeight: 900, fontSize: 18, color: "primary.main", lineHeight: 1.2, mb: 1 }}>
          {activityTitle.trim() ? activityTitle : "Titre de l’activité"}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5, lineHeight: 1.5 }}>
          {teaser.trim()
            ? teaser
            : "L’accroche apparaît ici sur les listes et la fiche publique."}{" "}
          <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: dk.tertiary }}>
            {certLabel}
          </Typography>
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <LocationOn sx={{ fontSize: 16, color: dk.tertiary }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {locationLine}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <AccessTime sx={{ fontSize: 16, color: dk.tertiary }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Jeu. 14h–17h · Sam. 9h–12h
            </Typography>
          </Stack>
        </Stack>
        <Button
          fullWidth
          type="button"
          onClick={onPostuler}
          sx={{
            mt: 2,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 800,
            py: 1.1,
            bgcolor: dk.tertiary,
            color: dk.white,
            "&:hover": { bgcolor: darken(dk.tertiary, 0.06) },
          }}
        >
          Postuler · {placesLeft} {placesLeft > 1 ? "places" : "place"}
        </Button>
      </Box>
    </Box>
  );
}

/** Wireframe page création d’activité (manager). */
export default function WireframeActivityCreatorModern() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [cert, setCert] = useState<"full" | "simple">("full");
  const [activeSection, setActiveSection] = useState<SectionId>("offer");
  const [activityTitle, setActivityTitle] = useState("");
  const [teaser, setTeaser] = useState("");
  const [skills, setSkills] = useState(["Écoute active", "Premiers secours", "Médiation"]);
  const skillKey = useCallback((prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`, []);
  const [lang, setLang] = useState("fr");
  const [motivationReq, setMotivationReq] = useState(true);
  const SOFT_OPTIONS = ["Travail d'équipe", "Diplomatie", "Créativité"] as const;
  const [pickedSoft, setPickedSoft] = useState<Set<string>>(() => new Set(["Travail d'équipe"]));
  const [country, setCountry] = useState("CH");
  const [cityPostal, setCityPostal] = useState("Genève 1201");
  const [distOk, setDistOk] = useState(true);
  const [vehicle, setVehicle] = useState(false);
  type Slot = { id: string; label: string };
  const [slots, setSlots] = useState<Slot[]>([
    { id: "s1", label: "Jeu. 13/05 · 14h–17h" },
    { id: "s2", label: "Sam. 16/05 · 09h–12h" },
  ]);
  const [places, setPlaces] = useState(5);
  const [deadline, setDeadline] = useState("2026-05-20");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  type Mgr = { id: string; name: string; referent: boolean };
  const [managers, setManagers] = useState<Mgr[]>([
    { id: "m1", name: "Anthony Ferrevey", referent: true },
  ]);
  const [lastDraft, setLastDraft] = useState(() => new Date());
  const [snack, setSnack] = useState<string | null>(null);
  const toast = useCallback((msg: string) => {
    setSnack(msg);
  }, []);

  const offerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const logisticsRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: SectionId) => {
    const map = { offer: offerRef, profile: profileRef, logistics: logisticsRef };
    map[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }, []);

  const certLabel = cert === "full" ? "· Certificat complet" : "· Relevé simple";

  const completion = useMemo(() => {
    let p = 28;
    if (activityTitle.trim().length > 2) p += 18;
    if (teaser.trim().length > 4) p += 10;
    if (skills.length) p += Math.min(14, skills.length * 4);
    if (pickedSoft.size) p += 8;
    if (cityPostal.trim()) p += 6;
    if (slots.length) p += Math.min(12, slots.length * 4);
    if (places > 0) p += 6;
    if (managers.length) p += 8;
    return Math.min(97, p);
  }, [activityTitle, teaser, skills.length, pickedSoft.size, cityPostal, slots.length, places, managers.length]);

  const draftLabel = useMemo(() => {
    const t = lastDraft.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" });
    return `Sauvegardé à ${t}`;
  }, [lastDraft]);

  const locationPreview = cityPostal.trim()
    ? `${cityPostal.split(/\s+/)[0] ?? "Genève"} · ${places} ${places > 1 ? "places restantes" : "place restante"}`
    : "Lieu · à compléter";

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.pageBg,
        border: `1px solid ${alpha(dk.border, 0.15)}`,
        display: "flex",
        flexDirection: "column",
        minHeight: { xs: "auto", md: 720 },
        overflow: "hidden",
      }}
    >
      <WireframeManagementNav
        initials="AR"
        spaceTag="Espace Manager"
        spaceOptions={["Espace Manager", "Espace Contributeur"]}
        links={["Activités", "Tableau de bord", "Contributee", "Statistiques"]}
      />

      <Box sx={{ px: { xs: 1.5, sm: 2 }, pt: 2, pb: 1.5, flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, mb: 0.75 }}>
          Espace Manager · Giveety_TestA · Activités · Nouvelle activité
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 1.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography sx={{ fontWeight: 900, fontSize: { xs: 22, sm: 26 }, color: "primary.main" }}>
              Nouvelle activité
            </Typography>
            <Chip
              label="Brouillon"
              size="small"
              sx={{ fontWeight: 800, bgcolor: alpha(dk.surfaceMuted, 0.5), color: "primary.main" }}
            />
            <Chip
              icon={<AutoAwesome sx={{ fontSize: 14 }} />}
              label={draftLabel}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 700, borderColor: alpha(dk.border, 0.35) }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary" }}>
              {completion}% complété
            </Typography>
            <Box sx={{ width: 100, flexShrink: 0 }}>
              <LinearProgress
                variant="determinate"
                value={completion}
                sx={{
                  height: 6,
                  borderRadius: 999,
                  bgcolor: alpha(dk.border, 0.2),
                  "& .MuiLinearProgress-bar": { borderRadius: 999, bgcolor: dk.tertiary },
                }}
              />
            </Box>
          </Stack>
        </Stack>

        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 6,
            py: 1,
            mb: 1.5,
            mx: { xs: -1.5, sm: -2 },
            px: { xs: 1.5, sm: 2 },
            bgcolor: alpha(dk.pageBg, 0.92),
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${alpha(dk.border, 0.08)}`,
          }}
        >
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {SECTIONS.map((s) => {
              const active = activeSection === s.id;
              return (
                <Button
                  key={s.id}
                  size="small"
                  onClick={() => scrollTo(s.id)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    borderRadius: 999,
                    px: 1.75,
                    fontSize: 12,
                    ...(active
                      ? { bgcolor: dk.surfaceStrong, color: dk.white, "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.06) } }
                      : { bgcolor: dk.white, color: "primary.main", border: `1px solid ${alpha(dk.border, 0.2)}` }),
                  }}
                >
                  {s.short}
                </Button>
              );
            })}
            <Button
              size="small"
              startIcon={<Preview sx={{ fontSize: 16 }} />}
              sx={{ textTransform: "none", fontWeight: 700, ml: "auto !important", color: dk.tertiary }}
              onClick={() => {
                logisticsRef.current?.scrollIntoView({ behavior: "smooth" });
                setActiveSection("logistics");
              }}
            >
              Aperçu final
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr minmax(280px, 320px)" },
            gap: 2,
            alignItems: "start",
            flex: 1,
            overflow: "auto",
            pb: 10,
          }}
        >
          <Stack spacing={2}>
            <Box ref={offerRef}>
              <SectionShell
                id="section-offer"
                step={1}
                total={3}
                title="Qu’offrez-vous aux contributeurs ?"
                subtitle="Type de certification, titre, description et compétences liées à l’activité."
                dk={dk}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5, color: "primary.main" }}>
                  Type de certification
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2.5 }}>
                  <CertChoiceCard
                    selected={cert === "full"}
                    onSelect={() => {
                      setCert("full");
                      toast("Certificat de contribution sélectionné");
                    }}
                    onInfo={() =>
                      toast(
                        "Le certificat de contribution valorise les heures et compétences, avec un message du manager.",
                      )
                    }
                    title="Certificat de contribution"
                    desc="Heures, compétences, mot du manager — le plus attractif pour les Contributee."
                    icon={<GpsFixed sx={{ fontSize: 28 }} />}
                    dk={dk}
                  />
                  <CertChoiceCard
                    selected={cert === "simple"}
                    onSelect={() => {
                      setCert("simple");
                      toast("Relevé de participation sélectionné");
                    }}
                    onInfo={() =>
                      toast("Le relevé de participation atteste la présence. Génération groupée possible.")
                    }
                    title="Relevé de participation"
                    desc="Simple attestation de présence · génération groupée possible."
                    icon={<CheckCircle sx={{ fontSize: 28 }} />}
                    dk={dk}
                  />
                </Stack>

                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1, color: "primary.main" }}>
                  Activité
                </Typography>
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    label="Titre de l’activité"
                    placeholder="ex. Maraude Plainpalais"
                    size="small"
                    value={activityTitle}
                    onChange={(e) => setActivityTitle(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Accroche courte"
                    placeholder="Une ligne pour les listes de missions"
                    size="small"
                    value={teaser}
                    onChange={(e) => setTeaser(e.target.value)}
                  />
                  <TextField fullWidth label="Description" multiline rows={3} placeholder="Synthèse : contexte, missions, valeur pour le bénévole…" size="small" />
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                      Savoir-faire (max 5)
                    </Typography>
                    {skills.map((sk) => (
                      <Chip
                        key={sk}
                        label={sk}
                        onDelete={
                          skills.length > 1
                            ? () => {
                                setSkills((prev) => prev.filter((x) => x !== sk));
                                toast(`Compétence « ${sk} » retirée`);
                              }
                            : undefined
                        }
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    ))}
                    <Button
                      size="small"
                      startIcon={<Add />}
                      disabled={skills.length >= 5}
                      sx={{ textTransform: "none", fontWeight: 700 }}
                      onClick={() => {
                        const n = skills.length + 1;
                        setSkills((prev) => [...prev, `Compétence ${n}`]);
                        toast(`Compétence ${n} ajoutée`);
                      }}
                    >
                      Ajouter
                    </Button>
                  </Stack>
                </Stack>
              </SectionShell>
            </Box>

            <Box ref={profileRef}>
              <SectionShell
                id="section-profile"
                step={2}
                total={3}
                title="Qui est le Contributee idéal ?"
                subtitle="Portrait du contributeur attendu : expériences, langues et savoir-être."
                dk={dk}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Portrait du bon profil"
                  placeholder="Décris les qualités attendues…"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <TextField
                    select
                    label="Langue(s)"
                    value={lang}
                    onChange={(e) => {
                      const v = e.target.value;
                      setLang(v);
                      toast(`Langue : ${v === "fr" ? "Français" : "Anglais"}`);
                    }}
                    SelectProps={{ native: true }}
                    size="small"
                    sx={{ minWidth: 200 }}
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </TextField>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mb: 0.75, display: "block" }}>
                      Savoir-être (sélection rapide)
                    </Typography>
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                      {SOFT_OPTIONS.map((x) => {
                        const active = pickedSoft.has(x);
                        return (
                          <Chip
                            key={x}
                            label={x}
                            size="small"
                            color={active ? "primary" : "default"}
                            variant={active ? "filled" : "outlined"}
                            sx={{ fontWeight: 700 }}
                            onClick={() => {
                              setPickedSoft((prev) => {
                                const next = new Set(prev);
                                if (next.has(x)) next.delete(x);
                                else next.add(x);
                                return next;
                              });
                              toast(active ? `"${x}" retiré` : `"${x}" ajouté`);
                            }}
                          />
                        );
                      })}
                      <Chip
                        label="+ Rechercher…"
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                        onClick={() => toast("Recherche par mot-clé…")}
                      />
                    </Stack>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                  <Switch
                    checked={motivationReq}
                    size="small"
                    onChange={(_, v) => {
                      setMotivationReq(v);
                      toast(v ? "Motivation requise avant postulation" : "Motivation optionnelle");
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Message de motivation {motivationReq ? "requis" : "optionnel"} avant postulation
                  </Typography>
                </Stack>
              </SectionShell>
            </Box>

            <Box ref={logisticsRef}>
              <SectionShell
                id="section-logistics"
                step={3}
                total={3}
                title="Où, quand, combien ?"
                subtitle="Lieu, créneaux, disponibilité, nombre de places et publication."
                dk={dk}
              >
                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                    <TextField
                      select
                      label="Pays"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        toast(`Pays : ${e.target.value === "CH" ? "Suisse" : "France"}`);
                      }}
                      SelectProps={{ native: true }}
                      size="small"
                      fullWidth
                      sx={{ maxWidth: { md: 200 } }}
                    >
                      <option value="FR">France</option>
                      <option value="CH">Suisse</option>
                    </TextField>
                    <TextField
                      fullWidth
                      label="Ville · code postal"
                      placeholder="Genève 1201"
                      size="small"
                      value={cityPostal}
                      onChange={(e) => setCityPostal(e.target.value)}
                    />
                  </Stack>
                  <Stack direction="row" flexWrap="wrap" gap={2}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Switch
                        checked={distOk}
                        size="small"
                        onChange={(_, v) => {
                          setDistOk(v);
                          toast(v ? "Distanciel autorisé" : "Sur site uniquement");
                        }}
                      />
                      <Typography variant="body2">Distanciel possible</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Switch
                        checked={vehicle}
                        size="small"
                        onChange={(_, v) => {
                          setVehicle(v);
                          toast(v ? "Véhicule requis activé" : "Pas de véhicule requis");
                        }}
                      />
                      <Typography variant="body2">Véhicule requis</Typography>
                    </Stack>
                  </Stack>

                  <Typography sx={{ fontWeight: 700, fontSize: 13, color: "primary.main" }}>Créneaux horaires</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {slots.map((c) => (
                      <Chip
                        key={c.id}
                        label={c.label}
                        onDelete={() => {
                          setSlots((prev) => prev.filter((s) => s.id !== c.id));
                          toast(`Créneau supprimé : ${c.label}`);
                        }}
                        sx={{ fontWeight: 700, py: 2.5 }}
                      />
                    ))}
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CalendarMonth />}
                      sx={{ textTransform: "none", borderRadius: 999, fontWeight: 700 }}
                      onClick={() => {
                        const id = skillKey("slot");
                        setSlots((prev) => [
                          ...prev,
                          { id, label: `Créneau ${prev.length + 1} · à définir` },
                        ]);
                        toast("Nouveau créneau ajouté");
                      }}
                    >
                      + Ajouter
                    </Button>
                  </Stack>

                  <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
                    <TextField
                      type="number"
                      label="Nombre de places"
                      size="small"
                      sx={{ maxWidth: 160 }}
                      value={places}
                      onChange={(e) => setPlaces(Math.max(0, Number(e.target.value) || 0))}
                      inputProps={{ min: 0, max: 999 }}
                    />
                    <TextField
                      label="Deadline postulations"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ maxWidth: 180 }}
                      value={deadline}
                      onChange={(e) => {
                        setDeadline(e.target.value);
                        toast("Date limite enregistrée");
                      }}
                    />
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        Visibilité
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <Chip
                          icon={<Public sx={{ fontSize: 14 }} />}
                          label="Publique"
                          size="small"
                          color={visibility === "public" ? "primary" : "default"}
                          variant={visibility === "public" ? "filled" : "outlined"}
                          sx={{ fontWeight: 800 }}
                          onClick={() => {
                            setVisibility("public");
                            toast("Visibilité : publique");
                          }}
                        />
                        <Chip
                          label="Privée"
                          size="small"
                          variant={visibility === "private" ? "filled" : "outlined"}
                          sx={{ fontWeight: 700 }}
                          onClick={() => {
                            setVisibility("private");
                            toast("Visibilité : privée (invitation)");
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>

                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1, color: "primary.main" }}>Managers</Typography>
                    <Stack spacing={1}>
                      {managers.map((mg) => (
                        <Stack
                          key={mg.id}
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{
                            p: 1.25,
                            borderRadius: 2,
                            border: `1px solid ${alpha(dk.border, 0.15)}`,
                            bgcolor: alpha(dk.surfaceMuted, 0.08),
                          }}
                        >
                          <DragIndicator sx={{ color: "text.secondary", cursor: "grab" }} />
                          <Person sx={{ fontSize: 18, color: dk.tertiary }} />
                          <Typography sx={{ flex: 1, fontWeight: 700 }}>{mg.name}</Typography>
                          {mg.referent ? (
                            <Chip label="Référent" size="small" sx={{ fontWeight: 800, bgcolor: dk.tertiary, color: dk.white }} />
                          ) : null}
                          <IconButton
                            size="small"
                            aria-label="Retirer"
                            onClick={() => {
                              setManagers((prev) => prev.filter((m) => m.id !== mg.id));
                              toast(`${mg.name} retiré`);
                            }}
                          >
                            <Close sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        startIcon={<Add />}
                        sx={{ textTransform: "none", fontWeight: 700, alignSelf: "flex-start" }}
                        onClick={() => {
                          const id = skillKey("mgr");
                          setManagers((prev) => [
                            ...prev,
                            { id, name: `Manager ${prev.length + 1}`, referent: false },
                          ]);
                          toast("Manager ajouté");
                        }}
                      >
                        Ajouter un manager
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </SectionShell>

              <Box
                sx={{
                  mt: 2,
                  borderRadius: 2.5,
                  p: 2,
                  border: `2px dashed ${alpha(dk.tertiary, 0.45)}`,
                  bgcolor: alpha(dk.tertiary, 0.04),
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <CheckCircle sx={{ color: dk.tertiary }} />
                  <Typography sx={{ fontWeight: 900, color: "primary.main" }}>
                    Récap express
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                  Contrôle une dernière fois les informations, puis utilise les actions ci-dessous pour enregistrer ou publier.
                </Typography>
              </Box>
            </Box>
          </Stack>

          <LivePreview
            dk={dk}
            activityTitle={activityTitle}
            teaser={teaser}
            locationLine={locationPreview}
            certLabel={certLabel}
            placesLeft={places}
            onPostuler={() => toast("Postulation envoyée")}
          />
        </Box>
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 8,
          px: { xs: 1.5, sm: 2 },
          py: 1.5,
          borderTop: `1px solid ${alpha(dk.border, 0.12)}`,
          bgcolor: alpha(dk.white, 0.95),
          backdropFilter: "blur(12px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            color="error"
            variant="text"
            sx={{ textTransform: "none", fontWeight: 700 }}
            onClick={() => toast("Brouillon supprimé")}
          >
            Supprimer
          </Button>
          <Button
            startIcon={<Preview />}
            variant="outlined"
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999 }}
            onClick={() => toast("Prévisualisation ouverte")}
          >
            Prévisualiser
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            startIcon={<Save />}
            sx={{ textTransform: "none", fontWeight: 700, color: "text.secondary" }}
            onClick={() => {
              setLastDraft(new Date());
              toast("Brouillon enregistré — horodatage mis à jour");
            }}
          >
            Brouillon
          </Button>
          <Button
            variant="outlined"
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999, px: 2 }}
            onClick={() => {
              scrollTo("offer");
              toast("Haut de page");
            }}
          >
            Retour
          </Button>
          <Button
            endIcon={<ChevronRight />}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 800,
              borderRadius: 999,
              px: 2.5,
              bgcolor: dk.tertiary,
              boxShadow: "none",
              "&:hover": { bgcolor: darken(dk.tertiary, 0.08), boxShadow: "none" },
            }}
            onClick={() =>
              toast(
                activityTitle.trim()
                  ? `« ${activityTitle.trim()} » est en ligne`
                  : "Activité publiée",
              )
            }
          >
            Publier l’activité
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3200}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
