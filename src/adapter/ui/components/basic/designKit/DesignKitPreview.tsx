"use client";

import {
  AutoAwesome,
  ChevronLeft,
  ChevronRight,
  Favorite,
  Place,
} from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { SvgIconProps } from "@mui/material";
import WireframeAccessibilityPanel from "./WireframeAccessibilityPanel";
import WireframeActivitiesHub from "./WireframeActivitiesHub";
import WireframeActivityCreatorModern from "./WireframeActivityCreatorModern";
import WireframeAchievementUnlock from "./WireframeAchievementUnlock";
import WireframeAlertBanner from "./WireframeAlertBanner";
import WireframeAvailabilityGrid from "./WireframeAvailabilityGrid";
import WireframeAvatarBuilder from "./WireframeAvatarBuilder";
import WireframeAvatarStack from "./WireframeAvatarStack";
import WireframeBadgeShowcase from "./WireframeBadgeShowcase";
import WireframeBarChart from "./WireframeBarChart";
import WireframeBioEditor from "./WireframeBioEditor";
import WireframeButtons from "./WireframeButtons";
import WireframeCards from "./WireframeCards";
import WireframeChatbot from "./WireframeChatbot";
import WireframeChecklist from "./WireframeChecklist";
import WireframeCommandPalette from "./WireframeCommandPalette";
import WireframeCommitmentTimeline from "./WireframeCommitmentTimeline";
import WireframeDashboardV2 from "./WireframeDashboardV2";
import WireframeContactPicker from "./WireframeContactPicker";
import WireframeDateRangePicker from "./WireframeDateRangePicker";
import WireframeDonutChart from "./WireframeDonutChart";
import WireframeDragSortList from "./WireframeDragSortList";
import WireframeEmptyState from "./WireframeEmptyState";
import WireframeFilePicker from "./WireframeFilePicker";
import WireframeFilterBar from "./WireframeFilterBar";
import WireframeFloatingSubNav from "./WireframeFloatingSubNav";
import WireframeFunnelChart from "./WireframeFunnelChart";
import WireframeGanttBar from "./WireframeGanttBar";
import WireframeHeatmap from "./WireframeHeatmap";
import WireframeHero from "./WireframeHero";
import WireframeImpactCounter from "./WireframeImpactCounter";
import WireframeInlineEditor from "./WireframeInlineEditor";
import WireframeKPITile from "./WireframeKPITile";
import WireframeLanguageSwitcher from "./WireframeLanguageSwitcher";
import WireframeLeaderboard from "./WireframeLeaderboard";
import WireframeManagementNav from "./WireframeManagementNav";
import WireframeManagerInbox from "./WireframeManagerInbox";
import WireframeManagerThread from "./WireframeManagerThread";
import WireframeMessageReactions from "./WireframeMessageReactions";
import WireframeMissionCalendar from "./WireframeMissionCalendar";
import WireframeMissionDetailCard from "./WireframeMissionDetailCard";
import WireframeMissionDetailPage from "./WireframeMissionDetailPage";
import WireframeMissionDiscoveryPage from "./WireframeMissionDiscoveryPage";
import WireframeMissionMap from "./WireframeMissionMap";
import WireframeNotificationFeed from "./WireframeNotificationFeed";
import WireframeOnboardingTour from "./WireframeOnboardingTour";
import WireframeOrgaProfile from "./WireframeOrgaProfile";
import WireframePollWidget from "./WireframePollWidget";
import WireframePricingCards from "./WireframePricingCards";
import WireframeProfileCard from "./WireframeProfileCard";
import WireframeProgressJourney from "./WireframeProgressJourney";
import WireframePushSettings from "./WireframePushSettings";
import WireframeQRCode from "./WireframeQRCode";
import WireframeReferralCard from "./WireframeReferralCard";
import WireframeReminderToast from "./WireframeReminderToast";
import WireframeReviewForm from "./WireframeReviewForm";
import WireframeSearchPanel from "./WireframeSearchPanel";
import WireframeSegmentedControl from "./WireframeSegmentedControl";
import WireframeShareSheet from "./WireframeShareSheet";
import WireframeSkillChips from "./WireframeSkillChips";
import WireframeSkillRadar from "./WireframeSkillRadar";
import WireframeSortableTable from "./WireframeSortableTable";
import WireframeStatsRow from "./WireframeStatsRow";
import WireframeThemeSwitcher from "./WireframeThemeSwitcher";
import WireframeTipsCarousel from "./WireframeTipsCarousel";
import WireframeToastStack from "./WireframeToastStack";
import WireframeUpgradeBanner from "./WireframeUpgradeBanner";
import WireframeWelcomeBanner from "./WireframeWelcomeBanner";
import DesignKitWelcomeSlide from "./DesignKitWelcomeSlide";
import { designKitPalette } from "./designKitPalette";
import { MAIN_CONTENT_PADDING_TOP } from "@/adapter/ui/utils/layoutConstants";
import { useIsMobile } from "@/adapter/ui/utils/mediaQueries";

/** Hauteur sticky approximative de la nav Contributeur (toolbar full-bleed) pour placer le bandeau Design Kit */
const DESIGN_KIT_PREVIEW_CONTRIB_NAV_GAP_PX = 56;

type Insights = { works: string; apply: string; why: string };
type Slide = {
  label: string;
  content: ReactNode;
  /** Si absent, pas de cartes « Ce qui fonctionne / Où / Pourquoi » sous le wireframe */
  insights?: Insights;
  fullWidth?: boolean;
  /** Barre Giveety (WireframeManagementNav) au-dessus du bandeau Design Kit · alignée sous le header app */
  contribNavDetached?: boolean;
};

const SLIDES: Slide[] = [
  {
    label: "Accueil Design Kit",
    content: <DesignKitWelcomeSlide />,
    fullWidth: true,
  },
  {
    label: "Dashboard V2 (page complète)",
    content: (
      /* Rendu réel piloté ci-dessous (ref tour + omit nav dupliquée) — placeholder pour garder SLIDES typé */
      null
    ),
    fullWidth: true,
    contribNavDetached: true,
    insights: {
      works: "Top nav (ManagementNav) adaptée avec « Tableau de bord / Notifications / Messagerie / Trouver une activité / Mes récompenses » + badges, ligne d’accueil avec **Partager mon profil** (modale **QR** `WireframeProfileQRThumb` + copie lien), WelcomeBanner dismissible, hero « prochaine contribution », grille de 7 widgets, accordéons ActivitiesHub et MissionCalendar. **Tour guidé** (8 étapes), « Refaire la visite ».",
      apply: "Page de tableau de bord complète, avec un onboarding qui explique chaque zone in-context — exactement l'expérience d'un bénévole à sa 1re connexion.",
      why: "La V1 = sidebar gauche + sections plates illisibles + onglets vides. Ici la nav passe en haut (gain d'espace), les sections lourdes sont pliables, chaque composant existant devient widget, et le tour guide remplace toute la documentation que personne ne lit.",
    },
  },
  {
    label: "Découverte missions · page complète",
    content: <WireframeMissionDiscoveryPage />,
    fullWidth: true,
    insights: {
      works: "Même ManagementNav avec « Trouver une activité » active, rayon Genève, segmented **Carte / Pour toi / Liste** avec ancres (`#discovery-carte`, `#discovery-pourtoi`, `#discovery-liste`), recherche + filtres, **carte à gauche et fiche mission à droite** (desktop), puis bloc recommandations « Pour toi », puis **liste « Toutes les activités »** en dessous.",
      apply: "Parcours bénévole après le dashboard : chercher une mission géolocalisée, affiner avec filtres, basculer vue liste/carte/reco, puis lire une fiche et une suggestion suivante sans changer d’URL (wireframe démo).",
      why: "Le dashboard rassemble tout ; cette page montre une seconde grande surface utilisée très souvent. La cohérence visuelle (palette, chrome, typo) évite que la démo ait l’air d’être deux applis différentes.",
    },
  },
  {
    label: "Fiche mission · télétravail (CRM / données)",
    content: <WireframeMissionDetailPage preset="distanceData" />,
    fullWidth: true,
    insights: {
      works: "Fil d’ariane, **hero** (catégories uppercase, titre, org, ligne d’activité, chip certificat, CTA saumon + outline), **barre statut** pleine largeur verte, grille **Savoir-être / Savoir-faire**, description à puces, profil contributeur + langue, **sidebar sticky** dates + télétravail + référent, pied de page structure.",
      apply: "Page publique ou post-clic recherche pour une mission entièrement **à distance** : réassurance compte contrib, délais de candidature lisibles.",
      why: "Recolle au wireframe fonctionnel hors design kit tout en gardant palette Giveety (**tertiary** saumon, primary vert, fond page #F2F1ED).",
    },
  },
  {
    label: "Fiche mission · présentiel (jardinage + carte)",
    content: <WireframeMissionDetailPage preset="gardenOnsite" />,
    fullWidth: true,
    insights: {
      works:
        "**Mise en page terrain** : bloc **Compétences** pleine largeur, puis grille **desktop** colonne logistique sticky (~360px) à gauche (dates, places, **avatars** engagés, mini-carte, adresse, référent) + colonne texte à droite. **Sans** grille calendrier sur la page.",
      apply: "Missions terrain : géolocalisation, places restantes et calendrier d’animations au même endroit que la proposition de valeur.",
      why: "Deux presets (`distanceData`, `gardenOnsite`) partagent une seule mise en page pour itérer sur le contenu sans dupliquer la structure.",
    },
  },
  {
    label: "Création activité · page unique (manager)",
    content: <WireframeActivityCreatorModern />,
    fullWidth: true,
    insights: {
      works: "Remplace le wizard 5 étapes par **3 blocs thématiques** sur une seule page scrollable : offre + certification, profil recherché, logistique. **Barre d’ancres sticky** (pills), **progression %** continue, **aperçu contributeur** fixe à droite (desktop), créneaux en **chips** au lieu du calendrier plein écran, **footer d’actions** collant (brouillon, prévisualiser, publier).",
      apply: "Parcours manager « nouvelle activité » / brouillon : moins de clics perçus, retour visuel immédiat sur la fiche publique, navigation par saut de section plutôt que Suivant/Suivant.",
      why: "Les captures V1 = long scroll par étape, récap final illisible, stepper rouge confus, calendrier qui casse le rythme. Ici on **réduit la friction cognitive** : tout est éditable d’un coup, l’utilisateur voit l’impact live, et le récap devient dispensable.",
    },
  },
  {
    label: "Welcome Banner",
    content: <WireframeWelcomeBanner />,
    insights: {
      works: "Salutation perso + 1 seul CTA + gradient brandé. Style Notion / Linear.",
      apply: "Tout en haut du dashboard à la 1re connexion, et au début de chaque semaine.",
      why: "Crée un effet « waouh, c'est mon espace » dès la première seconde.",
    },
  },
  {
    label: "Onboarding Tour",
    content: <WireframeOnboardingTour />,
    insights: {
      works: "Spotlight + tooltips ciblés, skip toujours visible. Style Intercom / Stripe.",
      apply: "Premier login, ou première consultation d'un espace donné (dashboard, profil, etc.)",
      why: "Bénévoles peu tech : ils ont besoin d'être pris par la main, pas d'un PDF.",
    },
  },
  {
    label: "Checklist · Onboarding",
    content: <WireframeChecklist />,
    insights: {
      works: "Progression % + items concrets cochables. Style Slack / Linear setup.",
      apply: "Bloc latéral du dashboard tant que profil < 100%. Disparaît quand fini.",
      why: "Profils complets. La checklist guide sans forcer.",
    },
  },
  {
    label: "Tips Carousel",
    content: <WireframeTipsCarousel />,
    insights: {
      works: "Conseils courts, autoplay + dots, illustration emoji. Style Duolingo.",
      apply: "Sidebar du dashboard ou écran de chargement entre 2 étapes.",
      why: "Réduit la friction sans pop-up. Éduque en douceur sur les bonnes pratiques.",
    },
  },
  {
    label: "Hero Section",
    content: (
      <WireframeHero
        logoLabel="Giveety"
        title="Engage-toi, fais valoir ce que tu apprends."
        subtitle="Atteste tes compétences acquises sur le terrain et partage-les en un clic."
      />
    ),
    insights: {
      works: "Titre fort + sous-titre + 1 CTA. Espace blanc maîtrisé. Style Apple landing.",
      apply: "Sur nos pages",
      why: "1re impression = conversion. On vend une promesse, pas une feature.",
    },
  },
  {
    label: "Management Navigation",
    content: (
      <WireframeManagementNav
        initials="EM"
        spaceTag="Espace bénévole"
        links={["Tableau de bord", "Mes engagements", "Mes certificats"]}
      />
    ),
    insights: {
      works: "Switch espace (bénévole/manager/asso) + profil clair. Style Notion workspaces.",
      apply: "Barre top de tout l'app authentifié. Une seule source de navigation.",
      why: "Un même user peu avoir 2 casquettes (bénévole + manager). Switch = friction zéro.",
    },
  },
  {
    label: "Floating Sub-navigation",
    content: <WireframeFloatingSubNav options={["Vue mosaïque", "Vue liste", "Vue chronologique"]} />,
    insights: {
      works: "Pilule flottante avec switch de vue. Léger, accessible au pouce. Style Linear.",
      apply: "Sur les pages listes",
      why: "Toggle rapide et intuitif.",
    },
  },
  {
    label: "Command Palette · ⌘ K",
    content: <WireframeCommandPalette />,
    insights: {
      works: "Recherche universelle + raccourcis clavier. Style Linear / Vercel / Raycast.",
      apply: "Accessible partout via ⌘K : jump to mission, contact, certificat, action rapide.",
      why: "Power-users (managers d'asso, recruteurs) gagnent un temps fou.",
    },
  },
  {
    label: "Stats Row · KPI",
    content: <WireframeStatsRow />,
    insights: {
      works: "3-4 chiffres clés + animation count-up + refresh. Style Stripe dashboard.",
      apply: "Top du dashboard bénévole : heures, missions, compétences, badges.",
      why: "Effet récompense immédiat. Les chiffres motivent à continuer.",
    },
  },
  {
    label: "KPI Tiles",
    content: (
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} useFlexGap>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <WireframeKPITile label="Heures ce mois" value="42 h" delta={18} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <WireframeKPITile label="Missions" value="7" delta={-5} series={[8, 9, 7, 10, 8, 6, 7, 8, 9, 7, 8, 7]} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <WireframeKPITile label="Compétences validées" value="14" delta={32} series={[2, 4, 5, 6, 7, 9, 10, 12, 12, 13, 14, 14]} />
        </Box>
      </Stack>
    ),
    insights: {
      works: "Tile dense : valeur + delta + sparkline inline. Style Linear / Datadog.",
      apply: "Espace manager d'asso : suivi temps réel des KPI de la structure.",
      why: "Les responsables d'asso ont besoin d'une vue compacte, pas d'un mega chart.",
    },
  },
  {
    label: "Impact Counter",
    content: <WireframeImpactCounter />,
    insights: {
      works: "Compteur animé + sparkline + chiffre social. Style Strava annual recap.",
      apply: "Page « Impact » publique de la communauté Giveety, à partager sur réseaux.",
      why: "Effet fierté collective : « notre asso a fait X heures ». Vecteur de viralité.",
    },
  },
  {
    label: "Manager Inbox",
    content: <WireframeManagerInbox />,
    insights: {
      works: "Inbox triée + actions inline (valider/refuser). Style Gmail Smart Compose.",
      apply: "Espace manager pour valider en lot les demandes d'certificat.",
      why: "Managers bénévoles = peu de temps. Doivent valider 20 demandes en 2 min.",
    },
  },
  {
    label: "Mission Detail Card",
    content: <WireframeMissionDetailCard />,
    insights: {
      works: "Fiche structurée : dates, places, prérequis, CTA collant. Style Airbnb listing.",
      apply: "Page détail d'une mission ouverte dans le catalogue Giveety.",
      why: "Donne toutes les infos sans surcharger. Décision postuler en 30 sec.",
    },
  },
  {
    label: "Mission Map",
    content: <WireframeMissionMap />,
    insights: {
      works: "Pins cliquables + bottom sheet. Style Google Maps / Airbnb map.",
      apply: "Vue « missions près de moi » avec géolocalisation et filtre rayon.",
      why: "Beaucoup de bénévoles cherchent local. Carte = format intuitif universel.",
    },
  },
  {
    label: "Commitment Timeline",
    content: <WireframeCommitmentTimeline />,
    insights: {
      works: "Timeline verticale avec passé/présent/futur. Style GitHub contributions.",
      apply: "Planning.",
      why: "Efficace pour visualiser rapidement les engagements à venir et passés.",
    },
  },
  {
    label: "Manager Thread · Chat",
    content: <WireframeManagerThread />,
    insights: {
      works: "Bulles asymétriques + skill tags inline. Style WhatsApp + Linear comments.",
      apply: "Échange bénévole ↔ manager autour d'une mission ou d'une compétence.",
      why: "Les managers parlent par WhatsApp aujourd'hui. Ramène ça in-app pour traçabilité.",
    },
  },
  {
    label: "Progress Journey",
    content: <WireframeProgressJourney />,
    insights: {
      works: "Stepper horizontal avec gradient + steps cliquables. Style Stripe Checkout.",
      apply: "Suivi visuel de la création d'certificat et de la validation manager.",
      why: "Donne une attente claire : « il me reste 2 étapes ». Réduit l'abandon.",
    },
  },
  {
    label: "Review Form",
    content: <WireframeReviewForm />,
    insights: {
      works: "Étoiles + tags rapides + commentaire optionnel. Style Airbnb post-stay.",
      apply: "Email post-mission « comment ça s'est passé ? » → in-app form 30 sec.",
      why: "Capte le feedback à chaud. Les asso ont besoin de ces retours pour évoluer.",
    },
  },
  {
    label: "Availability Grid",
    content: <WireframeAvailabilityGrid />,
    insights: {
      works: "Grille semaine cliquable façon Calendly. Style Cal.com / Notion calendar.",
      apply: "Onboarding bénévole : « quand es-tu dispo ? » pour matcher des missions.",
      why: "Permet de proposer uniquement des missions qui collent au planning réel.",
    },
  },
  {
    label: "Skill Chips",
    content: <WireframeSkillChips />,
    insights: {
      works: "Chips filtrables + favoris ⭐. Multi-sélection souple. Style Linear labels.",
      apply: "Sélection des compétences à mettre en avant sur l'certificat.",
      why: "Choisir = stressant. Les chips rendent le choix ludique et rapide.",
    },
  },
  {
    label: "Skill Radar",
    content: <WireframeSkillRadar />,
    insights: {
      works: "Radar SVG hover-friendly + reset. Style LinkedIn Skill Assessment.",
      apply: "Sur le profil public : visualiser le profil de compétences en 1 coup d'œil.",
      why: "Format visuel parlant pour les recruteurs. Différencie Giveety du CV classique.",
    },
  },
  {
    label: "Drag-Sort List",
    content: <WireframeDragSortList />,
    insights: {
      works: "Drag natif + boutons fallback. Style Trello / Linear ordering.",
      apply: "Réordonner les compétences/missions par priorité avant export certificat.",
      why: "L'ordre raconte une histoire. L'user veut hiérarchiser ce qu'il met en avant.",
    },
  },
  {
    label: "Donut Chart",
    content: <WireframeDonutChart />,
    insights: {
      works: "Segments hoverables + légende synchro. Style Stripe revenue split.",
      apply: "Répartition des heures par thème (solidarité, culture, sport, env.).",
      why: "Aide à montrer la diversité de l'engagement, important pour l'employabilité.",
    },
  },
  {
    label: "Bar Chart",
    content: <WireframeBarChart />,
    insights: {
      works: "Barres animées avec tooltip et highlight courant. Style Vercel analytics.",
      apply: "Évolution mensuelle des heures sur l'année courante.",
      why: "Permet à l'user de visualiser sa progression et de fixer un objectif annuel.",
    },
  },
  {
    label: "Heatmap",
    content: <WireframeHeatmap />,
    insights: {
      works: "Carrés colorés par intensité, légende discrète. Style GitHub contributions.",
      apply: "Page de profil public : preuve visuelle d'un engagement régulier.",
      why: "Argument fort sur un CV : « régulier·e depuis 2 ans » mieux qu'« actif » flou.",
    },
  },
  {
    label: "Funnel Chart",
    content: <WireframeFunnelChart />,
    insights: {
      works: "Funnel vertical centré + taux de conversion par étape. Style Mixpanel.",
      apply: "Tableau de bord asso : où on perd les bénévoles dans le parcours mission.",
      why: "Les asso optimisent leurs annonces ; donne-leur la data pour décider.",
    },
  },
  {
    label: "Gantt Bar",
    content: <WireframeGanttBar />,
    insights: {
      works: "Mini Gantt horizontal compact, hover sur barres. Style Linear roadmap.",
      apply: "Vue planning des engagements à venir pour bénévoles multi-missions.",
      why: "Évite les chevauchements de missions et donne une vision long terme.",
    },
  },
  {
    label: "Mission Calendar",
    content: <WireframeMissionCalendar />,
    insights: {
      works: "Vue mois avec barres d'événements multi-jours, filtres = légende, today pill, weekends teintés, panneau de détail du jour. Style Google Calendar / Cron / Linear.",
      apply: "Espace bénévole et manager : visualiser engagements et dispos en un coup d'œil, filtrer par type, voir les chevauchements.",
      why: "La V1 entasse les pills dans des cellules sans hiérarchie ; ici les missions deviennent des barres continues, lisibles, filtrables, et la légende remplace une lecture devinette.",
    },
  },
  {
    label: "Activities Hub",
    content: <WireframeActivitiesHub />,
    insights: {
      works: "Tabs avec compteur + pastille colorée (on voit ce qu'il y a partout), 4 layouts de carte selon le statut (postulation/en cours/à venir/terminée), stats strip en header, empty state avec recos de matching. Style Notion / Linear inbox.",
      apply: "Page \u00ab Mes activit\u00e9s \u00bb du bénévole. Chaque carte raconte ce qui est à faire MAINTENANT (pointer, préparer, évaluer, télécharger).",
      why: "La V1 a 5 onglets opaques + une boîte vide quand il n'y a rien. Ici les compteurs donnent la map du parcours, et même un onglet vide propose une action (« voici 3 missions qui matchent »).",
    },
  },
  {
    label: "Sortable Table",
    content: <WireframeSortableTable />,
    insights: {
      works: "Tri par colonne, pagination, status pills. Style Notion DB / Airtable.",
      apply: "Espace manager : tableau des missions/bénévoles avec filtres et tri.",
      why: "Les managers d'asso aiment Excel. Donne-leur la puissance sans la complexité.",
    },
  },
  {
    label: "Filter Bar",
    content: <WireframeFilterBar />,
    insights: {
      works: "Chips + popovers, compteur de filtres actifs. Style Notion / Linear filters.",
      apply: "Catalogue de missions : filtre par thème, lieu, durée, dispo.",
      why: "Catalogue volumineux = sans filtres c'est l'overload. Indispensable.",
    },
  },
  {
    label: "Search Panel",
    content: <WireframeSearchPanel />,
    insights: {
      works: "Recherche live + bookmark. Pas de page intermédiaire. Style Algolia.",
      apply: "Recherche d'activités passées à mettre dans l'certificat.",
      why: "Profil de 50+ missions ? L'user veut taper, pas scroller.",
    },
  },
  {
    label: "Date Range Picker",
    content: <WireframeDateRangePicker />,
    insights: {
      works: "Popover calendrier + range visuel, edge highlight. Style Airbnb.",
      apply: "Définir la période couverte par une certificat (« du X au Y »).",
      why: "Pattern universel ; les users savent l'utiliser sans tuto.",
    },
  },
  {
    label: "Orga Profile",
    content: <WireframeOrgaProfile />,
    insights: {
      works: "Cover + avatar + bio + stats + missions ouvertes. Style LinkedIn company.",
      apply: "Page publique d'une asso partenaire avec ses missions vivantes.",
      why: "Permet aux bénévoles de connaître l'asso avant de postuler. Crée la confiance.",
    },
  },
  {
    label: "Profile Card",
    content: <WireframeProfileCard />,
    insights: {
      works: "Cover + avatar + badges + stats + CTA follow. Style Twitter / LinkedIn.",
      apply: "Profil public du bénévole partageable comme alternative au CV.",
      why: "Une URL = un CV vivant. Plus moderne et plus crédible qu'un PDF.",
    },
  },
  {
    label: "Notification Feed",
    content: <WireframeNotificationFeed />,
    insights: {
      works: "Badge non-lus + mark-as-read + dismiss. Style GitHub notifications.",
      apply: "Cloche en haut à droite : invitations manager, validations, missions.",
      why: "Beaucoup de signaux à gérer ; un feed centralisé évite la dispersion.",
    },
  },
  {
    label: "Avatar Builder",
    content: <WireframeAvatarBuilder />,
    insights: {
      works: "Initiales auto + couleur + forme. Pas de photo requise. Style Linear / Vercel.",
      apply: "Default avatar à l'inscription, modifiable depuis le profil.",
      why: "Tout le monde n'a pas envie de mettre sa photo. Crée une identité visuelle propre.",
    },
  },
  {
    label: "Bio Editor",
    content: <WireframeBioEditor />,
    insights: {
      works: "Mise en forme légère + emoji picker + compteur. Style Twitter compose.",
      apply: "Édition de la bio profil et des descriptions d'expériences.",
      why: "Permet à l'user de personnaliser sa narration sans complexité Markdown.",
    },
  },
  {
    label: "Badge Showcase",
    content: <WireframeBadgeShowcase />,
    insights: {
      works: "Earned vs locked + barre progression. Style Strava / Duolingo achievements.",
      apply: "Onglet « Badges » du profil : montre les jalons franchis et à venir.",
      why: "Gamification douce ; donne envie d'aller chercher le prochain badge.",
    },
  },
  {
    label: "Achievement Unlock",
    content: <WireframeAchievementUnlock />,
    insights: {
      works: "Modale célébration + confettis SVG + partage. Style Duolingo streak.",
      apply: "Apparaît à chaque palier franchi (10 h, 100 h, 1re compétence certifiée).",
      why: "Effet dopamine = rétention. Le moment de joie pousse au partage social.",
    },
  },
  {
    label: "Leaderboard",
    content: <WireframeLeaderboard />,
    insights: {
      works: "Podium + ranks + filtre période. Style Strava clubs.",
      apply: "Classement interne d'une asso ou d'une école/entreprise mécène.",
      why: "Crée l'esprit d'équipe interne sans entrer dans la compétition individuelle.",
    },
  },
  {
    label: "Avatar Stack",
    content: <WireframeAvatarStack />,
    insights: {
      works: "Avatars overlap + overflow « +N » + tooltips. Style Notion / Figma collab.",
      apply: "Sur les fiches mission : qui d'autre est inscrit ? Sur les asso : équipe.",
      why: "Preuve sociale : « 6 autres bénévoles sont inscrits » rassure et motive.",
    },
  },
  {
    label: "Share Sheet",
    content: <WireframeShareSheet />,
    insights: {
      works: "Bottom sheet mobile-first + multi-réseaux + copy. Style iOS share sheet.",
      apply: "Partager son profil, une certificat ou une mission qu'on recommande.",
      why: "Le partage doit être 1 clic. Sinon personne ne le fait.",
    },
  },
  {
    label: "QR Code",
    content: <WireframeQRCode />,
    insights: {
      works: "QR avec logo central + download. Style billetterie / cartes pro modernes.",
      apply: "Sur l'certificat PDF + en bas du profil pour scan rapide en présentiel.",
      why: "Forums emploi, salons d'asso : un QR vaut mille cartes de visite.",
    },
  },
  {
    label: "Message Reactions",
    content: <WireframeMessageReactions />,
    insights: {
      works: "Picker emoji + compteurs cliquables. Style Slack / Discord reactions.",
      apply: "Sur les messages manager → bénévole pour féliciter sans écrire un message.",
      why: "Un 💚 vaut mieux qu'un silence. Maintient le lien avec friction zéro.",
    },
  },
  {
    label: "Referral Card",
    content: <WireframeReferralCard />,
    insights: {
      works: "Lien copiable + progression vers récompense. Style Dropbox / Notion referral.",
      apply: "Inviter un·e ami·e à rejoindre Giveety : badge déblocable au 3e parrainage.",
      why: "Acquisition organique gratuite, la meilleure source de bénévoles engagés.",
    },
  },
  {
    label: "Chatbot · Givi",
    content: <WireframeChatbot />,
    insights: {
      works: "Bulle flottante + suggestions + réponses scriptées. Style Intercom.",
      apply: "FAQ vivante : aide à la création d'certificat, lien manager, missions.",
      why: "Réduit la charge support, dispo 24/7, sans coût marginal.",
    },
  },
  {
    label: "Poll Widget",
    content: <WireframePollWidget />,
    insights: {
      works: "Barres qui se remplissent au vote + winner highlight. Style Twitter polls.",
      apply: "Sondage communautaire : « quel thème vous tente pour 2026 ? ».",
      why: "Engagement léger + signaux produit pour orienter la roadmap.",
    },
  },
  {
    label: "Contact Picker",
    content: <WireframeContactPicker />,
    insights: {
      works: "Autocomplete + multi-pick + tag déjà manager. Style Linear assignee.",
      apply: "Choisir le·la manager qui va certifier une compétence.",
      why: "Les users ont souvent plusieurs managers. Choisir doit être instantané.",
    },
  },
  {
    label: "Segmented Control",
    content: <WireframeSegmentedControl />,
    insights: {
      works: "Indicator qui glisse en CSS, pas de modal. Style iOS native.",
      apply: "Switch « mes missions / catalogue » ou « toutes / favorites » sur listes.",
      why: "Moins lourd qu'un dropdown pour 2-4 options. Plus rapide à scanner.",
    },
  },
  {
    label: "Theme Switcher",
    content: <WireframeThemeSwitcher />,
    insights: {
      works: "Light / Auto / Dark avec preview live. Style Vercel / Linear settings.",
      apply: "Préférences utilisateur, accessible depuis le menu profil.",
      why: "Dark mode = standard moderne ; Auto suit l'OS, c'est la valeur par défaut attendue.",
    },
  },
  {
    label: "Language Switcher",
    content: <WireframeLanguageSwitcher />,
    insights: {
      works: "Drapeau + nom natif (Français, English…) + check. Style Airbnb i18n.",
      apply: "Header public et préférences user. Pré-rempli selon le navigateur.",
      why: "Beaucoup de bénévoles non francophones (FLE, accueil migrants). Indispensable.",
    },
  },
  {
    label: "Accessibility Panel",
    content: <WireframeAccessibilityPanel />,
    insights: {
      works: "Taille texte +/- + contraste + dyslexie + reduce motion. Style BBC a11y panel.",
      apply: "Bouton ♿ dans le footer, accessible sans login. Mémorisé local.",
      why: "Public diversifié : seniors, dyslexie, malvoyants. RGAA = obligation légale.",
    },
  },
  {
    label: "Alert Banner",
    content: <WireframeAlertBanner />,
    insights: {
      works: "Bordure colorée + icône + close. Variants info/success/warning/error. Style Vercel.",
      apply: "Annonces produit, maintenance prévue, alerte manager à valider.",
      why: "Communique en haut sans interrompre. Beaucoup plus doux qu'une modale.",
    },
  },
  {
    label: "Toast Stack",
    content: <WireframeToastStack />,
    insights: {
      works: "Empilement bottom-right + auto-dismiss + animation. Style Sonner / Vercel.",
      apply: "Feedback d'actions : « certificat sauvegardée », « manager invité ».",
      why: "Confirme les actions sans bloquer l'utilisateur. Standard moderne.",
    },
  },
  {
    label: "Push Settings",
    content: <WireframePushSettings />,
    insights: {
      works: "Matrice topic × canal avec switches. Style GitHub notifications.",
      apply: "Réglages notif : email vs push vs SMS pour chaque type d'événement.",
      why: "Évite le burn out de notifs. L'user garde le contrôle = il reste.",
    },
  },
  {
    label: "Reminder Toast",
    content: <WireframeReminderToast />,
    insights: {
      works: "Toast riche + boutons Snooze 10min/1h/demain. Style Google Calendar.",
      apply: "Rappel avant une mission ou une deadline de validation d'certificat.",
      why: "Vie chargée des bénévoles : le snooze évite la culpabilité et la désinscription.",
    },
  },
  {
    label: "File Picker",
    content: <WireframeFilePicker />,
    insights: {
      works: "Drag & drop + progress + retry. Style Vercel deploy / Notion uploader.",
      apply: "Joindre justificatif (RIB, convention) ou logo asso lors de l'onboarding.",
      why: "Upload = moment friction. Doit être visuel, instant feedback, retry facile.",
    },
  },
  {
    label: "Inline Editor",
    content: <WireframeInlineEditor />,
    insights: {
      works: "Click-to-edit + save/cancel inline. Style Notion / Linear properties.",
      apply: "Champs profil (ville, bio courte) éditables sans page settings dédiée.",
      why: "Évite le « entrer en mode édition / sauvegarder / sortir ». Plus naturel.",
    },
  },
  {
    label: "Empty State",
    content: <WireframeEmptyState />,
    insights: {
      works: "Illustration SVG + texte chaleureux + 1 CTA. Style Linear / Notion.",
      apply: "Liste vide : pas encore d'certificat, pas encore de manager, etc.",
      why: "Un écran vide démotive ; un empty state guide vers la prochaine action.",
    },
  },
  {
    label: "Cards",
    content: (
      <WireframeCards
        heroLabel="Mon engagement de la saison"
        tiles={["Maraude hebdo", "Atelier FLE", "Festival local"]}
      />
    ),
    insights: {
      works: "Hero card extensible + tiles sélectionnables. Style Apple Music / Spotify.",
      apply: "Mise en avant d'un engagement principal + tiles secondaires sur le dashboard.",
      why: "Hiérarchie visuelle claire : on sait immédiatement où regarder en premier.",
    },
  },
  {
    label: "Buttons",
    content: (
      <WireframeButtons
        primaryLabel="Demander une certificat"
        secondaryLabel="Sauvegarder en brouillon"
      />
    ),
    insights: {
      works: "Primary + secondary + loading state. Hiérarchie visuelle forte. Style Stripe.",
      apply: "Toutes les pages : 1 seul primary visible à la fois pour clarté.",
      why: "L'user ne doit jamais douter de l'action principale. Réduit l'hésitation.",
    },
  },
  {
    label: "Pricing Cards",
    content: <WireframePricingCards />,
    insights: {
      works: "3 plans + toggle mensuel/annuel + plan « popular » highlight. Style Stripe.",
      apply: "Page tarifs publique : Free pour bénévoles, Pro pour avancés, Asso pour structures.",
      why: "Modèle de monétisation freemium clair. Conversion via l'effet d'ancrage Pro.",
    },
  },
  {
    label: "Upgrade Banner",
    content: <WireframeUpgradeBanner />,
    insights: {
      works: "Gradient sombre + offre limitée + price barré. Style Notion / Linear upsell.",
      apply: "Bannière contextuelle quand l'user atteint une limite Free (3 certificats).",
      why: "Pitch au bon moment : juste après une action qui a apporté de la valeur.",
    },
  },
];

function InsightCard({
  Icon,
  label,
  text,
  accent,
}: {
  Icon: ComponentType<SvgIconProps>;
  label: string;
  text: string;
  accent: string;
}) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  return (
    <Box
      sx={{
        p: 1.75,
        borderRadius: 2.5,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 14px ${alpha(dk.surfaceStrong, 0.05)}`,
        borderLeft: `4px solid ${accent}`,
        height: "100%",
        transition: "transform 0.15s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 10px 22px ${alpha(dk.surfaceStrong, 0.12)}`,
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: 9999,
            bgcolor: alpha(accent, 0.15),
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ fontSize: 14 }} />
        </Box>
        <Typography
          variant="overline"
          sx={{ fontWeight: 800, color: accent, letterSpacing: "0.08em", fontSize: 10, lineHeight: 1 }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: "text.primary", lineHeight: 1.4 }}>
        {text}
      </Typography>
    </Box>
  );
}

export default function DesignKitPreview() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [current, setCurrent] = useState(0);
  const contribNavDetachedTourRef = useRef<HTMLDivElement | null>(null);
  const isMobileForHeaderOffset = useIsMobile();
  const appBarStickyTop = isMobileForHeaderOffset
    ? MAIN_CONTENT_PADDING_TOP.MOBILE
    : MAIN_CONTENT_PADDING_TOP.DESKTOP;

  const total = SLIDES.length;
  const slide = SLIDES[current];

  /** Même retrait horizontal que la zone de contenu (`px` du bloc principal). */
  const carouselArrowInsetX = useMemo(
    () =>
      slide.fullWidth
        ? { xs: theme.spacing(1), md: theme.spacing(2) }
        : { xs: theme.spacing(2), md: theme.spacing(6) },
    [slide.fullWidth, theme],
  );

  const designKitToolbarSxTop = slide.contribNavDetached
    ? `calc(${appBarStickyTop} + ${DESIGN_KIT_PREVIEW_CONTRIB_NAV_GAP_PX}px)`
    : 0;

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(((idx % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflowX: "clip",
        bgcolor: dk.pageBg,
        backgroundImage: `radial-gradient(${alpha(dk.surfaceStrong, 0.06)} 1px, transparent 1px)`,
        backgroundSize: "18px 18px",
      }}
    >
      {slide.contribNavDetached ? (
        <Box
          ref={contribNavDetachedTourRef}
          key={`dk-preview-contrib-nav-${current}`}
          sx={{
            width: "100%",
            maxWidth: "100%",
            position: "sticky",
            top: appBarStickyTop,
            boxSizing: "border-box",
            p: 0,
            zIndex: 11,
            bgcolor: "transparent",
            overflow: "visible",
          }}
        >
          <Box
            sx={{
              width: "100%",
              willChange: "transform, opacity",
              animation:
                "dkPreviewContribNavDrop 0.62s cubic-bezier(0.22, 1, 0.36, 1) both",
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
                opacity: 1,
                transform: "none",
                willChange: "auto",
              },
              "@keyframes dkPreviewContribNavDrop": {
                from: {
                  opacity: 0,
                  /* Glisse depuis juste sous la ligne du header (au-dessus de la position finale) */
                  transform: "translateY(-36px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            <WireframeManagementNav
              fullBleedToolbar
              initials="AR"
              spaceTag="Espace Contributeur"
              spaceOptions={["Espace Contributeur", "Espace Manager"]}
              links={[
                "Tableau de bord",
                { label: "Notifications", badge: 3 },
                { label: "Messagerie", badge: 5 },
                "Trouver une activité",
                "Mes récompenses",
              ]}
            />
          </Box>
        </Box>
      ) : null}

      <Box
        sx={{
          position: "sticky",
          top: designKitToolbarSxTop,
          zIndex: 10,
          px: { xs: 2, md: 4 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: alpha(dk.pageBg, 0.85),
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${alpha(dk.border, 0.12)}`,
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "tertiary.main", fontWeight: 800, letterSpacing: "0.15em", lineHeight: 1 }}
          >
            Design Kit · Giveety V2
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1, mt: 0.25 }}>
            {slide.label}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "text.secondary",
            bgcolor: dk.white,
            px: 1.5,
            py: 0.75,
            borderRadius: 9999,
            border: `1px solid ${alpha(dk.border, 0.18)}`,
          }}
        >
          {current + 1} / {total}
        </Typography>
      </Box>

      <Box
        sx={{
          px: slide.fullWidth ? { xs: 1, md: 2 } : { xs: 2, md: 6 },
          py: { xs: 3, md: 4 },
        }}
      >
        <Box
          key={current}
          sx={{
            maxWidth: slide.fullWidth ? "none" : 1200,
            mx: "auto",
            animation: "fadeSlide 0.4s cubic-bezier(.4,1,.4,1)",
            "@keyframes fadeSlide": {
              from: { opacity: 0, transform: "translateX(24px)" },
              to: { opacity: 1, transform: "translateX(0)" },
            },
          }}
        >
          <Box sx={{ mb: 3 }}>
            {slide.contribNavDetached ? (
              <WireframeDashboardV2
                contribNavTourRef={contribNavDetachedTourRef}
                hideEmbeddedContribNav
              />
            ) : (
              slide.content
            )}
          </Box>

          {slide.insights ? (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            useFlexGap
            sx={{
              alignItems: "stretch",
              maxWidth: slide.fullWidth ? 1200 : "none",
              mx: slide.fullWidth ? "auto" : 0,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <InsightCard
                Icon={AutoAwesome}
                label="Ce qui fonctionne · moderne"
                text={slide.insights.works}
                accent={dk.tertiary}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <InsightCard
                Icon={Place}
                label="Où l'appliquer chez nous"
                text={slide.insights.apply}
                accent={dk.surfaceStrong}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <InsightCard
                Icon={Favorite}
                label="Pourquoi pour nos users"
                text={slide.insights.why}
                accent="#F4709F"
              />
            </Box>
          </Stack>
          ) : null}
        </Box>
      </Box>

      <IconButton
        onClick={prev}
        aria-label="Précédent"
        sx={{
          position: "fixed",
          left: carouselArrowInsetX,
          bottom: 20,
          zIndex: 20,
          width: 48,
          height: 48,
          bgcolor: alpha(dk.white, 0.9),
          color: "primary.main",
          boxShadow: `0 4px 16px ${alpha(dk.surfaceStrong, 0.18)}`,
          "&:hover": { bgcolor: dk.white, transform: "scale(1.05)" },
          transition: "all 0.15s ease",
        }}
      >
        <ChevronLeft sx={{ fontSize: 28 }} />
      </IconButton>

      <IconButton
        onClick={next}
        aria-label="Suivant"
        sx={{
          position: "fixed",
          right: carouselArrowInsetX,
          bottom: 20,
          zIndex: 20,
          width: 48,
          height: 48,
          bgcolor: alpha(dk.white, 0.9),
          color: "primary.main",
          boxShadow: `0 4px 16px ${alpha(dk.surfaceStrong, 0.18)}`,
          "&:hover": { bgcolor: dk.white, transform: "scale(1.05)" },
          transition: "all 0.15s ease",
        }}
      >
        <ChevronRight sx={{ fontSize: 28 }} />
      </IconButton>
    </Box>
  );
}
