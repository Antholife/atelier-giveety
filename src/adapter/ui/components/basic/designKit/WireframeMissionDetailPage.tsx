"use client";

import {
  ArrowForward,
  CalendarMonth,
  CheckCircle,
  LocationOn,
  Nature,
  Psychology,
  Spa,
  Verified,
  VolunteerActivism,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Link,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";
import { WireframeAvatarStackInline, type AvatarStackMember } from "./WireframeAvatarStack";
import WireframeManagementNav from "./WireframeManagementNav";

/** Deux presets calqués sur les captures « fiche mission » (à distance vs terrain). */
export type WireframeMissionDetailPreset = "distanceData" | "gardenOnsite";

const PRESETS: Record<
  WireframeMissionDetailPreset,
  {
    crumbShort: string;
    categories: string[];
    title: string;
    orgName: string;
    orgTagline: string;
    breadcrumbHref: boolean;
    statusLabel: string;
    deadlineLabel: string;
    savoirEtre: string[];
    savoirFaire: string[];
    descriptionLead: string;
    descriptionBullets: string[];
    contributeur: string[];
    contribNote?: string;
    langue: string;
    extraInfo?: string;
    sidebar: {
      mode: "distance" | "onsite";
      dateLine?: string;
      locationLine?: string;
      address?: string;
      spotsWanted?: number;
      spotsFilled?: number;
    };
    orgFooterMission: string;
    /** Présentiel : participants déjà inscrits (avatars) */
    engagedMembers?: readonly AvatarStackMember[];
  }
> = {
  distanceData: {
    crumbShort: "Mettre à jour la base…",
    categories: ["Commerce responsable"],
    title: "Mettre à jour la base de données des donateurs de matériel",
    orgName: "Fondation Horizon Solidaire",
    orgTagline: "Plateforme logistique de collecte de matériel agricole reconditionné.",
    breadcrumbHref: false,
    statusLabel: "Candidature ouverte",
    deadlineLabel: "Date limite de postulation : 31.05.2026 à 00:00",
    savoirEtre: [
      "Travailler de manière autonome",
      "Évaluer de manière critique",
      "Réfléchir de manière analytique",
    ],
    savoirFaire: [
      "Tenir des registres opérationnels",
      "Analyser et évaluer des informations",
      "Utiliser des logiciels de traitement de texte",
    ],
    descriptionLead:
      "Mission à domicile visant à structurer et nettoyer la base de données existante.",
    descriptionBullets: [
      "Vérifier les doublons",
      "Harmoniser les formats d’adresses",
      "Mettre à jour les contacts inactifs",
      "Proposer une structure optimisée",
    ],
    contributeur: [
      "Très à l’aise avec les bases de données, ou rigoureux et méthodique.",
      "Une expérience en gestion CRM serait idéale.",
    ],
    contribNote: "Le « top du top » serait une expérience en gestion CRM.",
    langue: "Français",
    sidebar: {
      mode: "distance",
      dateLine: "01.04.2026 – 01.06.2026",
      locationLine: "À distance",
    },
    orgFooterMission:
      "Sécurité alimentaire et autonomie agricole en Afrique et au Moyen-Orient — mise en lien de donateurs et bénéficiaires.",
  },
  gardenOnsite: {
    crumbShort: "Animer un atelier coll…",
    categories: ["Citoyenneté", "Éducation et formation", "Organisation du territoire"],
    title: "Animer un atelier collectif de jardinage",
    orgName: "Association Rives Vivantes",
    orgTagline: "Jardins partagés pédagogiques.",
    breadcrumbHref: true,
    statusLabel: "Candidature ouverte",
    deadlineLabel: "Date limite de postulation : 06.05.2026 à 13:30",
    savoirEtre: [
      "Savoir prendre patience et encourager le groupe",
      "Être à l’aise à l’oral devant des participant·es",
    ],
    savoirFaire: [
      "Encadrer une activité terrain (semis, arrosage)",
      "Expliquer des gestes simples de jardinage",
      "Veiller aux consignes de sécurité",
    ],
    descriptionLead:
      "Animation d’un après-midi conviviale sur un jardin partagé : présentation des cultures, mise en mains des outils, jeu pédagogique pour les enfants.",
    descriptionBullets: [
      "Accueillir familles et voisinage",
      "Préparer le matériel et les supports",
      "Assurer le debrief avec l’asso",
    ],
    contributeur: [
      "Tu aimes être dehors et transmettre des gestes simples.",
      "Aucune expertise botanique requise ; une première expérience d’animation est un plus.",
    ],
    langue: "Français",
    extraInfo: "Jardins partagés des Charmilles.",
    sidebar: {
      mode: "onsite",
      dateLine: "06.05.2026",
      address: "Rue des Charmilles 15, 1203 Genève, CH",
      spotsWanted: 5,
      spotsFilled: 1,
    },
    orgFooterMission:
      "Nature en ville pour Genève : jardins pédagogiques, biodiversité et lien social dans les quartiers.",
    engagedMembers: [{ id: "e1", initials: "JF", name: "Jules Favero" }],
  },
};

function SkillColumn({
  title,
  Icon,
  items,
  dk,
}: {
  title: string;
  Icon: typeof Psychology;
  items: string[];
  dk: ReturnType<typeof designKitPalette>;
}) {
  return (
    <Box
      sx={{
        borderRadius: 2.5,
        border: `1px solid ${alpha(dk.border, 0.2)}`,
        overflow: "hidden",
        bgcolor: dk.white,
        flex: 1,
        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          px: 2,
          py: 1.25,
          bgcolor: alpha(dk.surfaceMuted, 0.5),
          borderBottom: `1px solid ${alpha(dk.border, 0.12)}`,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: alpha(dk.tertiaryLight, 0.7),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: dk.surfaceStrong,
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Box>
        <Typography sx={{ fontWeight: 800, fontSize: 14, color: "primary.main" }}>{title}</Typography>
      </Stack>
      <Stack spacing={1.25} sx={{ px: 2, py: 2 }}>
        {items.map((line) => (
          <Stack key={line} direction="row" alignItems="flex-start" spacing={1}>
            <CheckCircle sx={{ fontSize: 18, color: "tertiary.main", mt: 0.1, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", lineHeight: 1.45 }}>
              {line}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function MiniGenevaMapPin({ dk }: { dk: ReturnType<typeof designKitPalette> }) {
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        height: 110,
        bgcolor: alpha(dk.primaryLight, 0.85),
        border: `1px solid ${alpha(dk.border, 0.18)}`,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 100 56"
        preserveAspectRatio="none"
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.95 }}
      >
        <defs>
          <linearGradient id="wf-map-mini" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={alpha("#4CAF93", 0.35)} />
            <stop offset="100%" stopColor={alpha("#B2DFDB", 0.5)} />
          </linearGradient>
        </defs>
        <rect width="100" height="56" fill="url(#wf-map-mini)" />
        <path
          d="M 12 40 Q 40 18 62 30 T 92 24"
          fill="none"
          stroke={alpha(dk.surfaceStrong, 0.2)}
          strokeWidth={0.8}
        />
      </Box>
      <LocationOn
        sx={{
          position: "absolute",
          left: "52%",
          top: "42%",
          transform: "translate(-50%, -100%)",
          fontSize: 32,
          color: dk.tertiary,
          filter: `drop-shadow(0 2px 4px ${alpha("#000", 0.25)})`,
        }}
      />
    </Box>
  );
}

type WireframeMissionDetailPageProps = {
  preset: WireframeMissionDetailPreset;
};

export default function WireframeMissionDetailPage({ preset }: WireframeMissionDetailPageProps) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [snack, setSnack] = useState<string | null>(null);
  const c = PRESETS[preset];
  const isGardenSite = preset === "gardenOnsite";

  const accentBtn = {
    borderRadius: 9999,
    textTransform: "none" as const,
    fontWeight: 800,
    px: 3,
    py: 1.25,
    bgcolor: theme.palette.tertiary.main,
    color: dk.white,
    "&:hover": { bgcolor: darken(theme.palette.tertiary.main, 0.08) },
  };

  const outlineBtn = {
    borderRadius: 9999,
    textTransform: "none" as const,
    fontWeight: 700,
    px: 2.5,
    py: 1.1,
    border: `2px solid ${dk.surfaceStrong}`,
    color: dk.surfaceStrong,
    bgcolor: "transparent",
    "&:hover": { bgcolor: alpha(dk.surfaceStrong, 0.06) },
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.pageBg,
        border: `1px solid ${alpha(dk.border, 0.12)}`,
        overflow: "hidden",
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

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 3 } }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 2 }}>
          <Link
            component="button"
            type="button"
            underline="hover"
            onClick={() => setSnack("Retour recherche (démo)")}
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            Trouver une activité
          </Link>
          {" "}
          &gt;{" "}
          {c.breadcrumbHref ? (
            <Link href="#" onClick={(e) => e.preventDefault()} sx={{ color: "text.secondary", fontWeight: 600 }}>
              {c.crumbShort}
            </Link>
          ) : (
            <Box component="span" sx={{ color: "text.secondary" }}>
              {c.crumbShort}
            </Box>
          )}
        </Typography>

        {/* --- Hero -------------------------------------------------------- */}
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: dk.white,
            border: `1px solid ${alpha(dk.border, 0.15)}`,
            p: { xs: 2, sm: 3 },
            mb: 0,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2.5}
            alignItems={{ xs: "flex-start", md: "flex-start" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: { xs: 56, sm: 72 },
                  height: { xs: 56, sm: 72 },
                  borderRadius: 2,
                  bgcolor: dk.white,
                  border: `1px solid ${alpha(dk.border, 0.2)}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {preset === "gardenOnsite" ? (
                  <Nature sx={{ fontSize: 40, color: "primary.main" }} />
                ) : (
                  <VolunteerActivism sx={{ fontSize: 38, color: "primary.main" }} />
                )}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 1 }}>
                  {c.categories.map((cat) => (
                    <Typography
                      key={cat}
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        color: "primary.main",
                        textTransform: "uppercase",
                      }}
                    >
                      {cat}
                    </Typography>
                  ))}
                </Stack>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 22, sm: 28 },
                    color: "primary.main",
                    lineHeight: 1.2,
                    mb: 1,
                  }}
                >
                  {c.title}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>{c.orgName}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1.5 }}>
                  {c.orgTagline}
                </Typography>
                <Chip
                  icon={<Verified sx={{ fontSize: 16, color: `${dk.surfaceStrong} !important` }} />}
                  label="Certificat de contribution"
                  size="small"
                  sx={{
                    fontWeight: 800,
                    bgcolor: alpha(dk.mint, 0.55),
                    color: "primary.main",
                    border: `1px solid ${alpha(dk.surfaceStrong, 0.12)}`,
                  }}
                />
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ flexShrink: 0, width: { xs: "100%", md: "auto" } }}>
              <Button sx={accentBtn} onClick={() => setSnack("Postuler (démo)")}>
                Postuler
              </Button>
              <Button sx={outlineBtn} onClick={() => setSnack("Messager référent (démo)")}>
                Poser une question
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* --- Bande statut ------------------------------------------------ */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{
            mt: 2,
            mb: 3,
            px: { xs: 2, sm: 3 },
            py: 1.75,
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Statut :</Typography>
            <Chip
              label={c.statusLabel}
              sx={{
                bgcolor: dk.mint,
                color: dk.surfaceStrong,
                fontWeight: 800,
                borderRadius: 9999,
              }}
              size="small"
            />
          </Stack>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{c.deadlineLabel}</Typography>
        </Stack>

        {/* --- Corps : distance = classique 2/3·1/3 · jardin = compétences pleine largeur + grille latérale à gauche + calendrier statique */}
        {isGardenSite ? (
          <>
            <Box
              sx={{
                mb: 3,
                borderRadius: 3,
                bgcolor: dk.white,
                border: `1px solid ${alpha(dk.border, 0.15)}`,
                p: { xs: 2, sm: 2.5 },
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: 18, color: "primary.main", mb: 1.5 }}>
                Compétences reconnues
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <SkillColumn title="Savoir-être" Icon={Psychology} items={c.savoirEtre} dk={dk} />
                <SkillColumn title="Savoir-faire" Icon={Spa} items={c.savoirFaire} dk={dk} />
              </Stack>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "minmax(300px, 360px) minmax(0, 1fr)" },
                gap: 3,
                alignItems: "start",
              }}
            >
              <Box sx={{ position: { lg: "sticky" }, top: { lg: 16 }, order: { xs: 2, lg: 1 } }}>
                <Box
                  sx={{
                    borderRadius: 3,
                    bgcolor: dk.white,
                    border: `1px solid ${alpha(dk.border, 0.15)}`,
                    boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.06)}`,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      px: 2.5,
                      py: 2,
                      background: `linear-gradient(120deg, ${alpha(dk.tertiaryLight, 0.75)} 0%, ${alpha(dk.primaryLight, 0.5)} 100%)`,
                      borderBottom: `1px solid ${alpha(dk.border, 0.1)}`,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                      <CalendarMonth sx={{ fontSize: 22, color: "primary.main" }} />
                      <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
                        {c.sidebar.dateLine ?? "—"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocationOn sx={{ fontSize: 22, color: "primary.main" }} />
                      <Typography sx={{ fontWeight: 700, color: "text.secondary" }}>Présentiel</Typography>
                    </Stack>
                  </Box>

                  <Stack spacing={2} sx={{ px: 2.5, py: 2.5 }}>
                    {c.sidebar.spotsWanted != null ? (
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                          {c.sidebar.spotsWanted}{" "}
                          {c.sidebar.spotsWanted > 1 ? "Contributeurs recherchés" : "Contributeur recherché"}
                        </Typography>
                        {(c.sidebar.spotsFilled ?? 0) > 0 ? (
                          <Stack spacing={1}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                              {(c.sidebar.spotsFilled ?? 0) > 1
                                ? `${c.sidebar.spotsFilled} Contributeurs déjà engagés`
                                : `${c.sidebar.spotsFilled} Contributeur déjà engagé`}
                            </Typography>
                            {c.engagedMembers?.length ? (
                              <WireframeAvatarStackInline
                                members={[...c.engagedMembers].slice(0, c.sidebar.spotsFilled ?? 0)}
                                size={40}
                              />
                            ) : null}
                          </Stack>
                        ) : null}
                      </Box>
                    ) : null}

                    <MiniGenevaMapPin dk={dk} />

                    {c.sidebar.address ? (
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                        {c.sidebar.dateLine} · {c.sidebar.address}
                      </Typography>
                    ) : null}

                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", mb: 0.5 }}>
                        Référent
                      </Typography>
                      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 1.5 }}>Anthony Renevey</Typography>
                      <Button fullWidth sx={outlineBtn} onClick={() => setSnack("Question au référent (démo)")}>
                        Poser une question
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Box>

              <Box sx={{ order: { xs: 1, lg: 2 }, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 18, color: "primary.main", mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "text.secondary", mb: 1.5, lineHeight: 1.6 }}>
                  {c.descriptionLead}
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 3, color: "text.secondary", fontWeight: 600 }}>
                  {c.descriptionBullets.map((b) => (
                    <Typography key={b} component="li" variant="body2" sx={{ mb: 0.75 }}>
                      {b}
                    </Typography>
                  ))}
                </Box>

                <Typography sx={{ fontWeight: 800, fontSize: 18, color: "primary.main", mb: 1 }}>
                  Contributeur recherché
                </Typography>
                {c.contributeur.map((p) => (
                  <Typography key={p} variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1, lineHeight: 1.55 }}>
                    {p}
                  </Typography>
                ))}
                {c.contribNote ? (
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 700, fontStyle: "italic", mb: 1 }}>
                    {c.contribNote}
                  </Typography>
                ) : null}
                <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 800, mb: 3 }}>
                  Langue : {c.langue}
                </Typography>

                {c.extraInfo ? (
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 3 }}>
                    Informations supplémentaires : {c.extraInfo}
                  </Typography>
                ) : null}

                <Box sx={{ display: "flex", justifyContent: { xs: "stretch", sm: "flex-start" }, py: 2 }}>
                  <Button sx={{ ...accentBtn, px: 5, py: 1.5 }} onClick={() => setSnack("Postuler (démo)")}>
                    Postuler
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
            <Box sx={{ flex: { lg: "2 1 0" }, width: "100%", minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 18, color: "primary.main", mb: 1.5 }}>
                Compétences reconnues
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                <SkillColumn title="Savoir-être" Icon={Psychology} items={c.savoirEtre} dk={dk} />
                <SkillColumn title="Savoir-faire" Icon={Spa} items={c.savoirFaire} dk={dk} />
              </Stack>

              <Typography sx={{ fontWeight: 800, fontSize: 18, color: "primary.main", mb: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: "text.secondary", mb: 1.5, lineHeight: 1.6 }}>
                {c.descriptionLead}
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 3, color: "text.secondary", fontWeight: 600 }}>
                {c.descriptionBullets.map((b) => (
                  <Typography key={b} component="li" variant="body2" sx={{ mb: 0.75 }}>
                    {b}
                  </Typography>
                ))}
              </Box>

              <Typography sx={{ fontWeight: 800, fontSize: 18, color: "primary.main", mb: 1 }}>
                Contributeur recherché
              </Typography>
              {c.contributeur.map((p) => (
                <Typography key={p} variant="body2" sx={{ color: "text.secondary", fontWeight: 600, mb: 1, lineHeight: 1.55 }}>
                  {p}
                </Typography>
              ))}
              {c.contribNote ? (
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 700, fontStyle: "italic", mb: 1 }}>
                  {c.contribNote}
                </Typography>
              ) : null}
              <Typography variant="body2" sx={{ color: "primary.main", fontWeight: 800, mb: 3 }}>
                Langue : {c.langue}
              </Typography>

              {c.extraInfo ? (
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, display: "block", mb: 3 }}>
                  Informations supplémentaires : {c.extraInfo}
                </Typography>
              ) : null}

              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <Button sx={{ ...accentBtn, px: 5, py: 1.5 }} onClick={() => setSnack("Postuler (démo)")}>
                  Postuler
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                flex: { lg: "1 1 0" },
                width: { xs: "100%", lg: "auto" },
                maxWidth: { lg: 380 },
                minWidth: 0,
                position: { lg: "sticky" },
                top: { lg: 16 },
                alignSelf: "flex-start",
              }}
            >
              <Box
                sx={{
                  borderRadius: 3,
                  bgcolor: dk.white,
                  border: `1px solid ${alpha(dk.border, 0.15)}`,
                  boxShadow: `0 8px 28px ${alpha(dk.surfaceStrong, 0.06)}`,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 2,
                    background: `linear-gradient(120deg, ${alpha(dk.tertiaryLight, 0.75)} 0%, ${alpha(dk.primaryLight, 0.5)} 100%)`,
                    borderBottom: `1px solid ${alpha(dk.border, 0.1)}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <CalendarMonth sx={{ fontSize: 22, color: "primary.main" }} />
                    <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
                      {c.sidebar.dateLine ?? "—"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <LocationOn sx={{ fontSize: 22, color: "primary.main" }} />
                    <Typography sx={{ fontWeight: 700, color: "text.secondary" }}>
                      {c.sidebar.mode === "distance" ? c.sidebar.locationLine : "Présentiel"}
                    </Typography>
                  </Stack>
                </Box>

                <Stack spacing={2} sx={{ px: 2.5, py: 2.5 }}>
                  {c.sidebar.spotsWanted != null ? (
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
                        {c.sidebar.spotsWanted}{" "}
                        {c.sidebar.spotsWanted > 1 ? "Contributeurs recherchés" : "Contributeur recherché"}
                      </Typography>
                      {(c.sidebar.spotsFilled ?? 0) > 0 ? (
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
                            {(c.sidebar.spotsFilled ?? 0) > 1
                              ? `${c.sidebar.spotsFilled} Contributeurs déjà engagés`
                              : `${c.sidebar.spotsFilled} Contributeur déjà engagé`}
                          </Typography>
                          {c.engagedMembers?.length ? (
                            <WireframeAvatarStackInline
                              members={[...c.engagedMembers].slice(0, c.sidebar.spotsFilled ?? 0)}
                              size={40}
                            />
                          ) : null}
                        </Stack>
                      ) : null}
                    </Box>
                  ) : null}

                  {c.sidebar.mode === "onsite" ? <MiniGenevaMapPin dk={dk} /> : null}

                  {c.sidebar.address ? (
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary" }}>
                      {c.sidebar.dateLine} · {c.sidebar.address}
                    </Typography>
                  ) : null}

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", display: "block", mb: 0.5 }}>
                      Référent
                    </Typography>
                    <Typography sx={{ fontWeight: 800, color: "primary.main", mb: 1.5 }}>Anthony Renevey</Typography>
                    <Button fullWidth sx={outlineBtn} onClick={() => setSnack("Question au référent (démo)")}>
                      Poser une question
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Stack>
        )}

        {/* --- Footer org -------------------------------------------------- */}
        <Box
          sx={{
            mt: 4,
            borderRadius: 3,
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            p: { xs: 2.5, sm: 3 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: dk.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {preset === "gardenOnsite" ? (
              <Nature sx={{ fontSize: 36, color: "primary.main" }} />
            ) : (
              <VolunteerActivism sx={{ fontSize: 34, color: "primary.main" }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.75 }}>{c.orgName}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.92, lineHeight: 1.55 }}>
              {c.orgFooterMission}
            </Typography>
          </Box>
          <Button
            endIcon={<ArrowForward />}
            onClick={() => setSnack("Fiche structure (démo)")}
            sx={{
              color: dk.white,
              border: `1px solid ${alpha(dk.white, 0.5)}`,
              borderRadius: 9999,
              textTransform: "none",
              fontWeight: 800,
              flexShrink: 0,
              "&:hover": { bgcolor: alpha(dk.white, 0.08) },
            }}
          >
            En savoir plus
          </Button>
        </Box>
      </Container>

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={2400}
        onClose={() => setSnack(null)}
        message={snack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
