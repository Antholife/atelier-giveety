"use client";

import {
  Add,
  ArrowForward,
  AutoAwesome,
  Celebration,
  Check,
  Close,
  ContentCopy,
  EmojiEvents,
  ExpandMore,
  Share,
  Tune,
} from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken, type SxProps, type Theme } from "@mui/material/styles";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";
import WireframeActivitiesHub from "./WireframeActivitiesHub";
import WireframeAvailabilityGrid from "./WireframeAvailabilityGrid";
import WireframeBadgeShowcase from "./WireframeBadgeShowcase";
import WireframeChecklist from "./WireframeChecklist";
import WireframeCommitmentTimeline from "./WireframeCommitmentTimeline";
import WireframeHeatmap from "./WireframeHeatmap";
import WireframeImpactCounter from "./WireframeImpactCounter";
import WireframeLeaderboard from "./WireframeLeaderboard";
import WireframeManagementNav from "./WireframeManagementNav";
import WireframeManagerThread from "./WireframeManagerThread";
import WireframeMissionCalendar from "./WireframeMissionCalendar";
import WireframeNotificationFeed from "./WireframeNotificationFeed";
import { WireframeProfileQRThumb } from "./WireframeQRCode";
import WireframeReferralCard from "./WireframeReferralCard";
import WireframeSkillRadar from "./WireframeSkillRadar";
import WireframeTipsCarousel from "./WireframeTipsCarousel";
import WireframeUpgradeBanner from "./WireframeUpgradeBanner";
import WireframeWelcomeBanner from "./WireframeWelcomeBanner";
import type { DismissRetention } from "./DismissRetentionDialog";

/** Préférences « ne plus afficher » (dashboard démo, persistance locale navigateur). */
const LS_DASH_TIPS_FOREVER = "atelier.designKit.dashboard.dismissTipsForever.v1";
const LS_DASH_PREMIERS_FOREVER = "atelier.designKit.dashboard.dismissPremiersPasForever.v1";

function readDismissForeverLs(key: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "1";
}

/** URL publique fictive pour QR + partage (dashboard démo). */
const DASHBOARD_PROFILE_SHARE_URL = "https://giveety.app/u/anthony-renevey";

/** Styles partagés « liquid glass » (vitres, profondeur, palette Giveety). */
function dashGlassShellSx(dk: DesignKitPalette, primaryMain: string): SxProps<Theme> {
  return {
    position: "relative",
    isolation: "isolate",
    overflow: "hidden",
    background: `linear-gradient(
      165deg,
      ${alpha(dk.pageBg, 0.7)} 0%,
      ${alpha(dk.primaryLight, 0.4)} 38%,
      ${alpha(dk.tertiaryLight, 0.3)} 72%,
      ${alpha(dk.pageBg, 0.66)} 100%
    )`,
    backdropFilter: "blur(22px) saturate(175%)",
    WebkitBackdropFilter: "blur(22px) saturate(175%)",
    border: `1px solid ${alpha(dk.white, 0.52)}`,
    boxShadow: `
      0 0 0 1px ${alpha(dk.white, 0.16)} inset,
      0 20px 50px ${alpha(primaryMain, 0.1)}
    `,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      pointerEvents: "none",
      zIndex: 0,
      background: `linear-gradient(195deg, ${alpha(dk.white, 0.22)} 0%, transparent 52%)`,
      opacity: 0.6,
    },
    "& > *": { position: "relative", zIndex: 1 },
  };
}

function dashGlassPanelSx(dk: DesignKitPalette, primaryMain: string): SxProps<Theme> {
  return {
    position: "relative",
    overflow: "hidden",
    bgcolor: alpha(dk.white, 0.36),
    backdropFilter: "blur(18px) saturate(170%)",
    WebkitBackdropFilter: "blur(18px) saturate(170%)",
    border: `1px solid ${alpha(dk.white, 0.6)}`,
    boxShadow: `
      0 0 0 1px ${alpha(dk.white, 0.18)} inset,
      0 12px 36px ${alpha(primaryMain, 0.08)}
    `,
  };
}

/** Vitre « frosted » neutre (léger flou + blanc laiteux, ombre grise — sans teinte primaire). */
function dashGlassFrostedPanelSx(dk: DesignKitPalette): SxProps<Theme> {
  return {
    position: "relative",
    isolation: "isolate",
    overflow: "hidden",
    bgcolor: alpha(dk.white, 0.52),
    backdropFilter: "blur(24px) saturate(200%)",
    WebkitBackdropFilter: "blur(24px) saturate(200%)",
    border: `1px solid ${alpha(dk.white, 0.72)}`,
    boxShadow: `
      0 0 0 1px ${alpha(dk.white, 0.42)} inset,
      0 2px 8px ${alpha("#000", 0.04)},
      0 14px 44px ${alpha("#000", 0.09)}
    `,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      pointerEvents: "none",
      zIndex: 0,
      background: `linear-gradient(200deg, ${alpha(dk.white, 0.58)} 0%, transparent 52%)`,
      opacity: 0.5,
    },
    "& > *": { position: "relative", zIndex: 1 },
  };
}

function dashGlassFrostedDashedButtonSx(dk: DesignKitPalette): SxProps<Theme> {
  return {
    ...dashGlassFrostedPanelSx(dk),
    border: `1px dashed ${alpha(dk.border, 0.4)}`,
    bgcolor: alpha(dk.white, 0.38),
  };
}

function dashGlassModalBodySx(dk: DesignKitPalette): SxProps<Theme> {
  return {
    bgcolor: alpha(dk.white, 0.45),
    backdropFilter: "blur(28px) saturate(180%)",
    WebkitBackdropFilter: "blur(28px) saturate(180%)",
    border: `1px solid ${alpha(dk.white, 0.62)}`,
    boxShadow: `
      0 0 0 1px ${alpha(dk.white, 0.28)} inset,
      0 10px 40px ${alpha("#000", 0.07)},
      0 28px 64px ${alpha("#000", 0.16)}
    `,
  };
}

function dashGlassDashedButtonSx(dk: DesignKitPalette, primaryMain: string): SxProps<Theme> {
  return {
    ...dashGlassPanelSx(dk, primaryMain),
    border: `1px dashed ${alpha(dk.tertiary, 0.42)}`,
    bgcolor: alpha(dk.white, 0.26),
  };
}

function GreetingRow({ actions }: { actions?: ReactNode }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={1.5}
    >
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: 22, color: "primary.main" }}>
          Bonjour Anthony 👋
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
          Mer. 13 mai · tu as 2 missions cette semaine
        </Typography>
      </Box>
      {actions ? (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          useFlexGap
          flexWrap="wrap"
        >
          {actions}
        </Stack>
      ) : null}
    </Stack>
  );
}

function NextContributionCard({ dk }: { dk: DesignKitPalette }) {
  const theme = useTheme();
  const pm = theme.palette.primary.main;
  const tertiary = dk.tertiary;

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        ...dashGlassPanelSx(dk, pm),
        borderLeft: `4px solid ${tertiary}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -36,
          right: -24,
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: alpha(tertiary, 0.14),
          filter: "blur(36px)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -48,
          left: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: alpha(pm, 0.09),
          filter: "blur(32px)",
          pointerEvents: "none",
        }}
      />

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", lg: "center" }}
        justifyContent="space-between"
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1.1,
                py: 0.35,
                borderRadius: 999,
                bgcolor: alpha(tertiary, 0.12),
                color: tertiary,
                border: `1px solid ${alpha(tertiary, 0.38)}`,
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              ✓ Validée
            </Box>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, fontSize: 12 }}>
              Dans 4 jours · sam. 9 mai
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.08rem", sm: "1.2rem" },
              lineHeight: 1.28,
              color: "primary.dark",
              letterSpacing: "-0.02em",
            }}
          >
            Maraude AEP · Distribution petits-déjeuners
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: 12,
              mt: 0.5,
              display: "block",
            }}
          >
            Giveety_TestA · Paris 11e · 09h00 — 14h00
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.25 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: ["#E63946", "#2A9D8F", "#F4A261", "#5A189A", "#0077B6"][i],
                  border: `2px solid ${alpha(dk.white, 0.98)}`,
                  boxShadow: `0 0 0 1px ${alpha(pm, 0.2)}`,
                  ml: i === 0 ? 0 : -0.65,
                }}
              />
            ))}
            <Typography variant="caption" sx={{ ml: 1.2, fontWeight: 700, color: "text.secondary" }}>
              5 bénévoles confirmés
            </Typography>
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            flexShrink: 0,
            alignSelf: { xs: "stretch", lg: "center" },
            width: { xs: "100%", lg: "auto" },
          }}
        >
          <Button
            variant="contained"
            disableElevation
            size="small"
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              fontWeight: 800,
              fontSize: 12.5,
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: pm,
              boxShadow: `0 8px 22px ${alpha(pm, 0.28)}`,
              "&:hover": {
                bgcolor: darken(pm, 0.06),
                boxShadow: `0 10px 26px ${alpha(pm, 0.34)}`,
              },
            }}
          >
            Voir l'activité
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: 12.5,
              px: 2,
              py: 1,
              borderRadius: 2,
              borderColor: alpha(pm, 0.38),
              color: "primary.main",
              bgcolor: alpha(dk.white, 0.5),
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              "&:hover": {
                borderColor: pm,
                bgcolor: alpha(dk.white, 0.72),
              },
            }}
          >
            Préparer
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function SectionTitle({
  title,
  hint,
  hintVariant = "inline",
}: {
  title: string;
  hint?: string;
  /** `pill` : hint dans une pastille (meilleure hiérarchie visuelle). */
  hintVariant?: "inline" | "pill";
}) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap" useFlexGap>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: 17,
          color: "primary.main",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {hint ? (
        hintVariant === "pill" ? (
          <Box
            component="span"
            sx={{
              typography: "caption",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              px: 1.25,
              py: 0.45,
              borderRadius: 999,
              color: "tertiary.main",
              bgcolor: alpha(theme.palette.tertiary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.tertiary.main, 0.35)}`,
            }}
          >
            {hint}
          </Box>
        ) : (
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: 12 }}>
            {hint}
          </Typography>
        )
      ) : null}
    </Stack>
  );
}

function CollapsibleSection({
  title,
  hint,
  summary,
  defaultOpen = false,
  children,
  dk,
}: {
  title: string;
  hint?: string;
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  dk: DesignKitPalette;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box
      sx={{
        borderRadius: 2.5,
        overflow: "hidden",
        ...dashGlassPanelSx(dk, theme.palette.primary.main),
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
          cursor: "pointer",
          userSelect: "none",
          bgcolor: open ? alpha(dk.white, 0.22) : "transparent",
          backdropFilter: open ? "blur(10px) saturate(150%)" : "none",
          WebkitBackdropFilter: open ? "blur(10px) saturate(150%)" : "none",
          transition: "background 0.15s ease, backdrop-filter 0.15s ease",
          "&:hover": { bgcolor: alpha(dk.white, 0.28) },
          outline: "none",
          "&:focus-visible": {
            boxShadow: `inset 0 0 0 2px ${alpha(dk.tertiary, 0.5)}`,
          },
        }}
      >
        <ExpandMore
          sx={{
            fontSize: 20,
            color: "primary.main",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.2s ease",
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 15, color: "primary.main", lineHeight: 1.2 }}>
            {title}
          </Typography>
          {hint ? (
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: 11 }}>
              {hint}
            </Typography>
          ) : null}
        </Box>
        {summary ? (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1,
              py: 0.4,
              borderRadius: 999,
              bgcolor: alpha(dk.surfaceStrong, 0.1),
              color: "primary.main",
              fontSize: 11,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {summary}
          </Box>
        ) : null}
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit={false}>
        <Box
          sx={{
            p: { xs: 1.25, sm: 1.75 },
            pt: { xs: 1, sm: 1.25 },
            bgcolor: alpha(dk.white, 0.14),
            backdropFilter: "blur(12px) saturate(150%)",
            WebkitBackdropFilter: "blur(12px) saturate(150%)",
            borderTop: `1px solid ${alpha(dk.white, 0.22)}`,
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}


type TourStep = {
  key: string;
  ref: RefObject<HTMLDivElement | null>;
  title: string;
  body: string;
  preferred?: "top" | "bottom";
};

type TourRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  rootW: number;
  rootH: number;
};

function DashboardTour({
  open,
  steps,
  stepIdx,
  onNext,
  onPrev,
  onClose,
  rootRef,
  dk,
}: {
  open: boolean;
  steps: TourStep[];
  stepIdx: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  rootRef: RefObject<HTMLDivElement | null>;
  dk: DesignKitPalette;
}) {
  const [rect, setRect] = useState<TourRect | null>(null);
  const current = steps[stepIdx];

  const computeRect = useCallback(() => {
    const target = current?.ref.current;
    const root = rootRef.current;
    if (!target || !root) return;
    const t = target.getBoundingClientRect();
    const r = root.getBoundingClientRect();
    setRect({
      top: t.top - r.top,
      left: t.left - r.left,
      width: t.width,
      height: t.height,
      rootW: root.scrollWidth,
      rootH: root.scrollHeight,
    });
  }, [current, rootRef]);

  useLayoutEffect(() => {
    if (!open || !current) return;
    const target = current.ref.current;
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    const t0 = window.setTimeout(computeRect, 30);
    const t1 = window.setTimeout(computeRect, 400);
    const t2 = window.setTimeout(computeRect, 700);
    window.addEventListener("resize", computeRect);
    window.addEventListener("scroll", computeRect, true);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", computeRect);
      window.removeEventListener("scroll", computeRect, true);
    };
  }, [open, current, computeRect]);

  if (!open || !current || !rect) return null;

  const PAD = 8;
  const TIP_W = 320;
  const TIP_H_EST = 170;
  const placeBelow = current.preferred === "top"
    ? false
    : rect.top + rect.height + TIP_H_EST + 32 < rect.rootH;
  const tipTop = placeBelow
    ? rect.top + rect.height + PAD + 12
    : Math.max(8, rect.top - TIP_H_EST - PAD - 12);
  let tipLeft = rect.left + rect.width / 2 - TIP_W / 2;
  tipLeft = Math.max(12, Math.min(tipLeft, rect.rootW - TIP_W - 12));

  const backdropBg = alpha("#0a0a0a", 0.52);
  const isLast = stepIdx === steps.length - 1;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {/* 4 backdrop rectangles around the cutout */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: Math.max(0, rect.top - PAD),
          bgcolor: backdropBg,
          pointerEvents: "auto",
          transition: "all 0.25s ease",
        }}
        onClick={onClose}
      />
      <Box
        sx={{
          position: "absolute",
          top: rect.top + rect.height + PAD,
          left: 0,
          right: 0,
          height: Math.max(0, rect.rootH - (rect.top + rect.height + PAD)),
          bgcolor: backdropBg,
          pointerEvents: "auto",
          transition: "all 0.25s ease",
        }}
        onClick={onClose}
      />
      <Box
        sx={{
          position: "absolute",
          top: rect.top - PAD,
          left: 0,
          width: Math.max(0, rect.left - PAD),
          height: rect.height + PAD * 2,
          bgcolor: backdropBg,
          pointerEvents: "auto",
          transition: "all 0.25s ease",
        }}
        onClick={onClose}
      />
      <Box
        sx={{
          position: "absolute",
          top: rect.top - PAD,
          left: rect.left + rect.width + PAD,
          right: 0,
          height: rect.height + PAD * 2,
          bgcolor: backdropBg,
          pointerEvents: "auto",
          transition: "all 0.25s ease",
        }}
        onClick={onClose}
      />

      {/* Highlight outline */}
      <Box
        sx={{
          position: "absolute",
          top: rect.top - PAD,
          left: rect.left - PAD,
          width: rect.width + PAD * 2,
          height: rect.height + PAD * 2,
          border: `2px solid ${dk.tertiary}`,
          borderRadius: 2,
          boxShadow: `0 0 0 6px ${alpha(dk.tertiary, 0.22)}`,
          transition: "all 0.25s ease",
          pointerEvents: "none",
        }}
      />

      {/* Tooltip card — presque opaque (lisibilité), léger flou conservé */}
      <Box
        sx={{
          position: "absolute",
          top: tipTop,
          left: tipLeft,
          width: TIP_W,
          maxWidth: "calc(100% - 24px)",
          borderRadius: 2.5,
          p: 1.75,
          pointerEvents: "auto",
          transition: "all 0.25s ease",
          background: `linear-gradient(
            185deg,
            ${alpha(dk.white, 0.995)} 0%,
            ${alpha(dk.white, 0.97)} 62%,
            ${alpha("#F5F5F7", 0.99)} 100%
          )`,
          backdropFilter: "blur(14px) saturate(165%)",
          WebkitBackdropFilter: "blur(14px) saturate(165%)",
          border: `1px solid ${alpha(dk.white, 0.95)}`,
          boxShadow: `
            0 0 0 1px ${alpha(dk.white, 0.65)} inset,
            0 18px 48px ${alpha("#000", 0.1)},
            0 4px 14px ${alpha("#000", 0.07)}
          `,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <AutoAwesome sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 800,
              color: "text.secondary",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Étape {stepIdx + 1} sur {steps.length}
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 800,
            color: "text.primary",
            mt: 0.5,
            lineHeight: 1.25,
          }}
        >
          {current.title}
        </Typography>
        <Typography
          sx={{
            fontSize: 12.5,
            color: "text.secondary",
            mt: 0.75,
            lineHeight: 1.5,
          }}
        >
          {current.body}
        </Typography>

        {/* progress bar */}
        <Box
          sx={{
            mt: 1.25,
            height: 4,
            borderRadius: 999,
            bgcolor: alpha(dk.border, 0.25),
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${((stepIdx + 1) / steps.length) * 100}%`,
              bgcolor: dk.tertiary,
              transition: "width 0.3s ease",
            }}
          />
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1.25 }}
        >
          <Button
            size="small"
            onClick={onClose}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Passer le tour
          </Button>
          <Stack direction="row" spacing={1}>
            {stepIdx > 0 ? (
              <Button
                size="small"
                variant="outlined"
                onClick={onPrev}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: alpha(dk.border, 0.5),
                  color: "primary.main",
                }}
              >
                Précédent
              </Button>
            ) : null}
            <Button
              size="small"
              variant="contained"
              onClick={isLast ? onClose : onNext}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                bgcolor: dk.tertiary,
                "&:hover": { bgcolor: alpha(dk.tertiary, 0.88) },
                boxShadow: "none",
              }}
            >
              {isLast ? "C'est parti !" : "Suivant"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/*  Confetti + "Badge unlocked" modal (auto-trigger when tour closes)           */
/* -------------------------------------------------------------------------- */

const CONFETTI_COUNT = 32;

function Confetti({ dk, seed }: { dk: DesignKitPalette; seed: number }) {
  const colors = [dk.tertiary, dk.surfaceStrong, dk.surfaceAccent, dk.mint];
  const pieces = useMemo(() => {
    void seed;
    return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.5 + Math.random() * 1.3,
      rotate: Math.random() * 360,
      color: colors[i % colors.length],
      size: 6 + Math.random() * 8,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pieces.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: "absolute",
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            bgcolor: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.rotate}deg)`,
            animation: `wf-confetti-fall ${p.duration}s ${p.delay}s linear forwards`,
            "@keyframes wf-confetti-fall": {
              "0%": { transform: `translateY(0) rotate(${p.rotate}deg)`, opacity: 1 },
              "100%": {
                transform: `translateY(440px) rotate(${p.rotate + 720}deg)`,
                opacity: 0,
              },
            },
          }}
        />
      ))}
    </Box>
  );
}

function BadgeUnlockedModal({
  open,
  onClose,
  dk,
  tick,
}: {
  open: boolean;
  onClose: () => void;
  dk: DesignKitPalette;
  tick: number;
}) {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slotProps={{ backdrop: { sx: { backdropFilter: "blur(18px) saturate(140%)", bgcolor: alpha("#000", 0.42) } } }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 440 },
          borderRadius: 3,
          overflow: "hidden",
          outline: "none",
          animation: "wf-pop 0.35s ease",
          "@keyframes wf-pop": {
            "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: 0 },
            "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
          },
          ...dashGlassModalBodySx(dk),
        }}
        key={tick}
      >
        <Box
          sx={{
            position: "relative",
            px: 4,
            pt: 5,
            pb: 4,
            textAlign: "center",
            background: `linear-gradient(160deg, ${alpha(dk.primaryLight, 0.42)} 0%, ${alpha(dk.white, 0.38)} 100%)`,
            backdropFilter: "blur(18px) saturate(175%)",
            WebkitBackdropFilter: "blur(18px) saturate(175%)",
            borderBottom: `1px solid ${alpha(dk.white, 0.35)}`,
            boxShadow: `inset 0 1px 0 ${alpha(dk.white, 0.35)}`,
          }}
        >
          <Confetti dk={dk} seed={tick} />
          <Box
            sx={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              mx: "auto",
              mb: 2,
              background: `linear-gradient(135deg, ${dk.tertiary} 0%, ${dk.surfaceStrong} 100%)`,
              color: dk.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 0 12px ${alpha(dk.tertiary, 0.18)}`,
              position: "relative",
              animation: "wf-spin 0.8s ease",
              "@keyframes wf-spin": {
                "0%": { transform: "rotate(-180deg) scale(0)" },
                "100%": { transform: "rotate(0) scale(1)" },
              },
            }}
          >
            <EmojiEvents sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
            Badge débloqué !
          </Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 600, mb: 3 }}>
            Tu viens de gagner le badge <strong>« Pionnier »</strong> pour avoir
            terminé ta visite guidée. Bienvenue à bord, Anthony 🎉
          </Typography>
          <Stack direction="row" spacing={1.5} justifyContent="center">
            <Button
              disableElevation
              startIcon={<Celebration />}
              onClick={onClose}
              sx={{
                borderRadius: 9999,
                textTransform: "none",
                fontWeight: 800,
                px: 3,
                bgcolor: dk.surfaceStrong,
                color: dk.white,
                "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
              }}
            >
              Trop bien !
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*  Widget registry (editable dashboard)                                       */
/* -------------------------------------------------------------------------- */

type WidgetKey =
  | "messages"
  | "badges"
  | "notifications"
  | "availability"
  | "skills"
  | "impact"
  | "leaderboard"
  | "referral"
  | "heatmap";

type WidgetDef = {
  key: WidgetKey;
  title: string;
  hint?: string;
  fullWidth?: boolean;
  render: () => ReactNode;
};

const WIDGET_DEFS: readonly WidgetDef[] = [
  { key: "messages", title: "Ma messagerie", hint: "3 non lus · 4 conversations", render: () => <MessagerieWidget /> },
  { key: "badges", title: "Mes badges", hint: "3 sur 12 débloqués", render: () => <WireframeBadgeShowcase /> },
  { key: "notifications", title: "Mes notifications", hint: "3 non lues", render: () => <WireframeNotificationFeed /> },
  { key: "availability", title: "Mes disponibilités", hint: "cette semaine", render: () => <WireframeAvailabilityGrid /> },
  { key: "skills", title: "Mes compétences", hint: "radar des forces", render: () => <WireframeSkillRadar /> },
  { key: "impact", title: "Mon impact", hint: "depuis l'inscription", render: () => <WireframeImpactCounter /> },
  { key: "leaderboard", title: "Classement de l'asso", hint: "cette semaine", render: () => <WireframeLeaderboard /> },
  { key: "referral", title: "Inviter un proche", hint: "2 / 5 parrainés", render: () => <WireframeReferralCard /> },
  { key: "heatmap", title: "Mes contributions", hint: "12 derniers mois", fullWidth: true, render: () => <WireframeHeatmap /> },
];

const DEFAULT_VISIBLE_WIDGETS: WidgetKey[] = WIDGET_DEFS.map((w) => w.key);

function EditableWidgetCard({
  def,
  dk,
  editing,
  onDelete,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
}: {
  def: WidgetDef;
  dk: DesignKitPalette;
  editing: boolean;
  onDelete: () => void;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}) {
  const theme = useTheme();
  const pm = theme.palette.primary.main;
  return (
    <Box
      draggable={editing}
      onDragStart={editing ? onDragStart : undefined}
      onDragOver={editing ? onDragOver : undefined}
      onDragLeave={editing ? onDragLeave : undefined}
      onDragEnd={editing ? onDragEnd : undefined}
      onDrop={editing ? onDrop : undefined}
      sx={{
        gridColumn: def.fullWidth ? "1 / -1" : "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        minWidth: 0,
        cursor: editing ? (isDragging ? "grabbing" : "grab") : "auto",
        opacity: isDragging ? 0.35 : 1,
        transformOrigin: "center",
        transition: "outline-offset 0.15s ease, opacity 0.15s ease, transform 0.15s ease",
        outline: isDropTarget
          ? `2px dashed ${dk.tertiary}`
          : "none",
        outlineOffset: isDropTarget ? 4 : 0,
        animation:
          editing && !isDragging
            ? "wf-jiggle 0.32s ease-in-out infinite"
            : "none",
        "@keyframes wf-jiggle": {
          "0%, 100%": { transform: "rotate(-0.4deg)" },
          "50%": { transform: "rotate(0.4deg)" },
        },
        WebkitUserSelect: editing ? "none" : "auto",
        userSelect: editing ? "none" : "auto",
      }}
    >
      {editing ? (
        <IconButton
          aria-label="Retirer le widget"
          onClick={onDelete}
          onMouseDown={(e) => e.stopPropagation()}
          size="small"
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            zIndex: 4,
            width: 22,
            height: 22,
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            boxShadow: `0 2px 6px ${alpha(dk.surfaceStrong, 0.3)}`,
            "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
          }}
        >
          <Close sx={{ fontSize: 14 }} />
        </IconButton>
      ) : null}
      {editing ? (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -8,
            left: 8,
            zIndex: 4,
            px: 0.75,
            py: 0.25,
            borderRadius: 999,
            bgcolor: alpha(dk.tertiary, 0.92),
            color: dk.white,
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.4,
            boxShadow: `0 2px 6px ${alpha(dk.tertiary, 0.4)}`,
            pointerEvents: "none",
          }}
        >
          ⋮⋮ glisser
        </Box>
      ) : null}
      <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ px: 0.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 13, color: "primary.main" }}>
          {def.title}
        </Typography>
        {def.hint ? (
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 600, fontSize: 11 }}
          >
            · {def.hint}
          </Typography>
        ) : null}
      </Stack>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          pointerEvents: editing ? "none" : "auto",
          opacity: editing ? 0.85 : 1,
          transition: "opacity 0.15s ease",
          borderRadius: 2.5,
          p: { xs: 1, sm: 1.15 },
          ...dashGlassPanelSx(dk, pm),
        }}
      >
        {def.render()}
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/*  Messagerie widget (list + modal chat)                                       */
/* -------------------------------------------------------------------------- */

type Conversation = {
  id: string;
  name: string;
  role: string;
  initials: string;
  preview: string;
  time: string;
  unread?: number;
  gradient: [string, string];
};

const CONVERSATIONS: Conversation[] = [
  {
    id: "camille",
    name: "Camille Brun",
    role: "Manager · Maraude AEP",
    initials: "CB",
    preview: "Bravo pour la maraude de samedi, ton accueil était top.",
    time: "14:10",
    unread: 2,
    gradient: ["#7C5BFF", "#3DBBFF"],
  },
  {
    id: "yasmine",
    name: "Yasmine Sahraoui",
    role: "Association · Les Petits Frères",
    initials: "YS",
    preview: "On t'attend mercredi 09h pour la prépa des paniers !",
    time: "12:48",
    unread: 1,
    gradient: ["#F4709F", "#FFAA7B"],
  },
  {
    id: "tom",
    name: "Tom Lefèvre",
    role: "Coordinateur · Cycle Solidaire",
    initials: "TL",
    preview: "Ok parfait, je valide ta participation. À samedi !",
    time: "Hier",
    gradient: ["#00B894", "#43E97B"],
  },
  {
    id: "support",
    name: "Équipe Giveety",
    role: "Support",
    initials: "GV",
    preview: "Ton certificat de bénévolat est prêt à télécharger.",
    time: "Lun.",
    gradient: ["#1E3A8A", "#0E7490"],
  },
];

function ConversationRow({
  conv,
  onClick,
  dk,
}: {
  conv: Conversation;
  onClick: () => void;
  dk: DesignKitPalette;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%",
        textAlign: "left",
        px: 1.25,
        py: 1,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        transition: "background 0.15s ease",
        "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.18) },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${conv.gradient[0]} 0%, ${conv.gradient[1]} 100%)`,
          color: dk.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        {conv.initials}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 13,
              color: "primary.main",
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {conv.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              fontSize: 10.5,
              flexShrink: 0,
            }}
          >
            {conv.time}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            fontSize: 10.5,
            display: "block",
            lineHeight: 1.15,
          }}
        >
          {conv.role}
        </Typography>
        <Typography
          sx={{
            color: conv.unread ? "primary.main" : "text.secondary",
            fontWeight: conv.unread ? 700 : 500,
            fontSize: 11.5,
            mt: 0.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {conv.preview}
        </Typography>
      </Box>
      {conv.unread ? (
        <Box
          sx={{
            minWidth: 20,
            height: 20,
            borderRadius: 999,
            bgcolor: dk.tertiary,
            color: dk.white,
            fontSize: 10.5,
            fontWeight: 800,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            px: 0.6,
            flexShrink: 0,
          }}
        >
          {conv.unread}
        </Box>
      ) : null}
    </ButtonBase>
  );
}

function MessagerieWidget() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [openConv, setOpenConv] = useState<Conversation | null>(null);
  return (
    <>
      <Stack spacing={0.25} sx={{ width: "100%" }}>
        {CONVERSATIONS.map((c) => (
          <ConversationRow
            key={c.id}
            conv={c}
            dk={dk}
            onClick={() => setOpenConv(c)}
          />
        ))}
      </Stack>

      <Modal open={openConv !== null} onClose={() => setOpenConv(null)} closeAfterTransition slotProps={{ backdrop: { sx: { backdropFilter: "blur(16px) saturate(140%)", bgcolor: alpha("#000", 0.38) } } }}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "94%", sm: "min(720px, 94vw)" },
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            outline: "none",
            animation: "wf-chat-pop 0.25s ease",
            "@keyframes wf-chat-pop": {
              "0%": { transform: "translate(-50%, -50%) scale(0.96)", opacity: 0 },
              "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
            },
            ...dashGlassModalBodySx(dk),
          }}
        >
          {openConv ? (
            <>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.25}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: `1px solid ${alpha(dk.border, 0.14)}`,
                  bgcolor: alpha(dk.white, 0.32),
                  backdropFilter: "blur(18px) saturate(175%)",
                  WebkitBackdropFilter: "blur(18px) saturate(175%)",
                  boxShadow: `inset 0 1px 0 ${alpha(dk.white, 0.45)}`,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${openConv.gradient[0]} 0%, ${openConv.gradient[1]} 100%)`,
                    color: dk.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {openConv.initials}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{ fontWeight: 800, fontSize: 14, color: "primary.main" }}
                  >
                    {openConv.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontWeight: 600, fontSize: 11 }}
                  >
                    {openConv.role}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setOpenConv(null)}
                  aria-label="Fermer"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { bgcolor: alpha(dk.surfaceMuted, 0.2) },
                  }}
                >
                  <Close />
                </IconButton>
              </Stack>
              <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", p: 1.5 }}>
                <WireframeManagerThread />
              </Box>
            </>
          ) : null}
        </Box>
      </Modal>
    </>
  );
}

function AddWidgetTile({
  fullWidth,
  hiddenCount,
  onClick,
  dk,
}: {
  fullWidth?: boolean;
  hiddenCount: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  dk: DesignKitPalette;
}) {
  const disabled = hiddenCount === 0;
  return (
    <ButtonBase
      disabled={disabled}
      onClick={onClick}
      sx={{
        gridColumn: fullWidth ? "1 / -1" : "auto",
        minHeight: 130,
        borderRadius: 2.5,
        border: `2px dashed ${alpha(dk.tertiary, disabled ? 0.25 : 0.55)}`,
        bgcolor: alpha(dk.tertiary, disabled ? 0.04 : 0.09),
        backdropFilter: "blur(14px) saturate(150%)",
        WebkitBackdropFilter: "blur(14px) saturate(150%)",
        color: dk.tertiary,
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s ease",
        boxShadow: `0 0 0 1px ${alpha(dk.white, 0.15)} inset`,
        "&:hover": {
          bgcolor: alpha(dk.tertiary, disabled ? 0.02 : 0.14),
          borderColor: disabled ? alpha(dk.tertiary, 0.25) : dk.tertiary,
        },
      }}
    >
      <Stack alignItems="center" spacing={0.5}>
        <Add sx={{ fontSize: 30 }} />
        <Typography sx={{ fontWeight: 800, fontSize: 13 }}>
          {disabled ? "Tous les widgets sont affichés" : "Ajouter un widget"}
        </Typography>
        {!disabled ? (
          <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8 }}>
            {hiddenCount} disponible{hiddenCount > 1 ? "s" : ""}
          </Typography>
        ) : null}
      </Stack>
    </ButtonBase>
  );
}

export default function WireframeDashboardV2({
  contribNavTourRef,
  hideEmbeddedContribNav = false,
}: {
  /** Barre Giveety rendue ailleurs (ex. Preview · sous header app) mais ciblée au tour guidé */
  contribNavTourRef?: RefObject<HTMLDivElement | null>;
  /** Ne pas doubler WireframeManagementNav quand elle est montée dans le shell parent */
  hideEmbeddedContribNav?: boolean;
} = {}) {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);

  /* ----------------------------- Tour refs ------------------------------ */
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const profileAlertRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);
  const nextContribRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const widgetsRef = useRef<HTMLDivElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const navTourTargetRef = contribNavTourRef ?? navRef;

  const steps = useMemo<TourStep[]>(
    () => [
      {
        key: "nav",
        ref: navTourTargetRef,
        title: "Ta barre de navigation",
        body:
          "Toutes tes sections clés sont ici : tableau de bord, notifications, messagerie, recherche de missions et tes récompenses. Le sélecteur d'espace te permet de basculer entre Contributeur et Manager.",
        preferred: "bottom",
      },
      {
        key: "greeting",
        ref: greetingRef,
        title: "Ton accueil",
        body:
          "Ici ton prénom et le jour : tu peux partager ton profil (QR + lien via la modale), ou relancer la visite guidée « Refaire la visite ».",
        preferred: "bottom",
      },
      {
        key: "profileAlert",
        ref: profileAlertRef,
        title: "Informations et demandes importantes",
        body:
          "Tout en haut : un bloc blanc titre « À traiter… » puis une liste de bandeaux selon tes besoins (sans nombre fixe). Exemples : profil incomplet (pièce d’identité, photo, adresse avec numéro de rue comme à l’inscription) ; demandes complémentaires d’un Manager en messagerie.",
        preferred: "bottom",
      },
      {
        key: "tips",
        ref: tipsRef,
        title: "Bloc astuces",
        body:
          "Astuces qui défilent à gauche, Premiers pas à droite — chaque coin a une croix pour fermer uniquement ce bloc ; les bandeaux en pointillés les réaffichent.",
        preferred: "bottom",
      },
      {
        key: "next",
        ref: nextContribRef,
        title: "Ta prochaine contribution",
        body:
          "Le focus du jour : la mission la plus proche dans ton agenda. Un clic pour avoir le détail et tout préparer.",
        preferred: "bottom",
      },
      {
        key: "timeline",
        ref: timelineRef,
        title: "Ta timeline d'engagement",
        body:
          "Ce qui arrive et ce qui s'est passé : missions à venir, en cours, terminées — chronologiquement, avec leurs détails au survol.",
        preferred: "top",
      },
      {
        key: "widgets",
        ref: widgetsRef,
        title: "Tes widgets perso",
        body:
          "Messagerie, badges, dispos, compétences, classement… Le bouton « Modifier le dashboard » est sur cette ligne : retire des cartes, ajoute-en, réorganise-les par glisser-déposer. Un clic en dehors de cette zone termine l'édition.",
        preferred: "top",
      },
      {
        key: "activities",
        ref: activitiesRef,
        title: "Mes activités",
        body:
          "Toutes tes postulations, missions en cours, à venir et terminées — regroupées par onglets avec des cartes adaptées à chaque statut. Replié par défaut pour ne pas surcharger.",
        preferred: "top",
      },
      {
        key: "calendar",
        ref: calendarRef,
        title: "Mon agenda",
        body:
          "Vue mois avec les missions en barres multi-jours, filtres par catégorie, et panneau jour-par-jour. Replié par défaut pour ne pas surcharger.",
        preferred: "top",
      },
    ],
    [navTourTargetRef],
  );

  const [shareProfileOpen, setShareProfileOpen] = useState(false);
  const [shareSnack, setShareSnack] = useState<string | null>(null);

  const copyProfileLink = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(DASHBOARD_PROFILE_SHARE_URL).then(
        () => setShareSnack("Lien copié dans le presse-papiers"),
        () => setShareSnack(`Lien : ${DASHBOARD_PROFILE_SHARE_URL}`),
      );
    } else {
      setShareSnack(`Lien : ${DASHBOARD_PROFILE_SHARE_URL}`);
    }
  }, []);

  const downloadQRPlaceholder = useCallback(() => {
    setShareSnack("Export PNG du QR (démo produit)");
  }, []);

  /* --------------------------- Tips + premiers pas (indépendants) ------ */
  const [tipsForeverDismissed, setTipsForeverDismissed] = useState(() =>
    readDismissForeverLs(LS_DASH_TIPS_FOREVER),
  );
  const [premiersForeverDismissed, setPremiersForeverDismissed] = useState(() =>
    readDismissForeverLs(LS_DASH_PREMIERS_FOREVER),
  );
  const [tipsOpen, setTipsOpen] = useState(() => !readDismissForeverLs(LS_DASH_TIPS_FOREVER));
  const [premiersPasOpen, setPremiersPasOpen] = useState(
    () => !readDismissForeverLs(LS_DASH_PREMIERS_FOREVER),
  );

  const onTipsDismissChoice = useCallback((r: DismissRetention) => {
    if (r === "permanent") {
      try {
        window.localStorage.setItem(LS_DASH_TIPS_FOREVER, "1");
      } catch {
        /* ignore */
      }
      setTipsForeverDismissed(true);
    }
    setTipsOpen(false);
  }, []);

  const onPremiersDismissChoice = useCallback((r: DismissRetention) => {
    if (r === "permanent") {
      try {
        window.localStorage.setItem(LS_DASH_PREMIERS_FOREVER, "1");
      } catch {
        /* ignore */
      }
      setPremiersForeverDismissed(true);
    }
    setPremiersPasOpen(false);
  }, []);

  /* --------------------- Tour state + badge unlock ---------------------- */
  const [tourOpen, setTourOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [badgeTick, setBadgeTick] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setTourOpen(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  const triggerBadge = useCallback(() => {
    setBadgeTick((t) => t + 1);
    setBadgeOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setTourOpen(false);
    setStepIdx(0);
    window.setTimeout(triggerBadge, 250);
  }, [triggerBadge]);

  const nextStep = useCallback(
    () => setStepIdx((i) => Math.min(steps.length - 1, i + 1)),
    [steps.length],
  );
  const prevStep = useCallback(() => setStepIdx((i) => Math.max(0, i - 1)), []);
  const restartTour = useCallback(() => {
    setStepIdx(0);
    setTourOpen(true);
  }, []);

  /* ----------------------- Widget edit mode ----------------------------- */
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetKey[]>(
    DEFAULT_VISIBLE_WIDGETS,
  );
  const [editMode, setEditMode] = useState(false);
  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLButtonElement | null>(
    null,
  );

  const widgetsEditScopeRef = useRef<HTMLDivElement>(null);

  const [draggingKey, setDraggingKey] = useState<WidgetKey | null>(null);
  const [dragOverKey, setDragOverKey] = useState<WidgetKey | null>(null);

  const widgetDefsByKey = useMemo(() => {
    const map: Record<string, WidgetDef> = {};
    for (const def of WIDGET_DEFS) map[def.key] = def;
    return map;
  }, []);

  const hiddenWidgets = useMemo(
    () => WIDGET_DEFS.filter((d) => !visibleWidgets.includes(d.key)),
    [visibleWidgets],
  );

  const removeWidget = useCallback((k: WidgetKey) => {
    setVisibleWidgets((prev) => prev.filter((x) => x !== k));
  }, []);
  const addWidget = useCallback((k: WidgetKey) => {
    setVisibleWidgets((prev) => (prev.includes(k) ? prev : [...prev, k]));
    setAddMenuAnchor(null);
  }, []);
  const enterEditMode = useCallback(() => setEditMode(true), []);
  const exitEditMode = useCallback(() => {
    setEditMode(false);
    setAddMenuAnchor(null);
    setDraggingKey(null);
    setDragOverKey(null);
  }, []);

  /* Scroll to widgets row when entering edit mode */
  const prevEditRef = useRef(false);
  useEffect(() => {
    if (editMode && !prevEditRef.current) {
      window.requestAnimationFrame(() => {
        widgetsEditScopeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
    prevEditRef.current = editMode;
  }, [editMode]);

  /* Click outside widgets zone validates (ends edit mode) */
  useEffect(() => {
    if (!editMode) return;
    const onPointerDownCapture = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (!t) return;
      if (widgetsEditScopeRef.current?.contains(t)) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest(".MuiModal-root")) return;
      if (el?.closest(".MuiPopover-root")) return;
      if (el?.closest(".MuiMenu-root")) return;
      setEditMode(false);
      setAddMenuAnchor(null);
      setDraggingKey(null);
      setDragOverKey(null);
    };
    document.addEventListener("pointerdown", onPointerDownCapture, true);
    return () => document.removeEventListener("pointerdown", onPointerDownCapture, true);
  }, [editMode]);

  /* ------------------------- Drag & drop reorder ------------------------ */
  const handleDragStart = useCallback(
    (key: WidgetKey) => (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", key);
      } catch {
        // Some browsers throw if setData is called outside a drag handler context
      }
      setDraggingKey(key);
    },
    [],
  );
  const handleDragOver = useCallback(
    (key: WidgetKey) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverKey((prev) => (prev === key ? prev : key));
    },
    [],
  );
  const handleDragLeave = useCallback(
    (key: WidgetKey) => (e: React.DragEvent<HTMLDivElement>) => {
      // Only clear if leaving this specific target
      const related = e.relatedTarget as Node | null;
      if (related && e.currentTarget.contains(related)) return;
      setDragOverKey((prev) => (prev === key ? null : prev));
    },
    [],
  );
  const handleDragEnd = useCallback(() => {
    setDraggingKey(null);
    setDragOverKey(null);
  }, []);
  const handleDrop = useCallback(
    (targetKey: WidgetKey) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const sourceKey = draggingKey;
      setDraggingKey(null);
      setDragOverKey(null);
      if (!sourceKey || sourceKey === targetKey) return;
      setVisibleWidgets((prev) => {
        const sourceIdx = prev.indexOf(sourceKey);
        const targetIdx = prev.indexOf(targetKey);
        if (sourceIdx === -1 || targetIdx === -1) return prev;
        const next = [...prev];
        next.splice(sourceIdx, 1);
        const insertAt = sourceIdx < targetIdx ? targetIdx - 1 : targetIdx;
        next.splice(insertAt, 0, sourceKey);
        return next;
      });
    },
    [draggingKey],
  );

  return (
    <Box
      ref={rootRef}
      sx={{
        position: "relative",
        width: "100%",
        overflow: tourOpen ? "visible" : "hidden",
      }}
    >
      {/* Barre Giveety : intégrée ici hors shell Design Kit */}
      {!hideEmbeddedContribNav ? (
        <Box
          ref={navRef}
          sx={{
            width: "100%",
            maxWidth: "100%",
            display: "block",
            boxSizing: "border-box",
          }}
        >
          {/* Transform sur un wrapper interne pour ne pas casser le sticky du parent si besoin futur */}
          <Box
            sx={{
              width: "100%",
              willChange: "transform, opacity",
              animation:
                "dkDashEmbeddedContribNavDrop 0.62s cubic-bezier(0.22, 1, 0.36, 1) both",
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
                opacity: 1,
                transform: "none",
                willChange: "auto",
              },
              "@keyframes dkDashEmbeddedContribNavDrop": {
                from: {
                  opacity: 0,
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
        sx={
          hideEmbeddedContribNav
            ? {
                borderRadius: 3,
                p: { xs: 1.25, sm: 2 },
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ...dashGlassShellSx(dk, theme.palette.primary.main),
              }
            : {
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                borderTop: "none",
                p: { xs: 1.25, sm: 2 },
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ...dashGlassShellSx(dk, theme.palette.primary.main),
              }
        }
      >
      <Box ref={greetingRef}>
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 1.5, sm: 2 },
            ...dashGlassPanelSx(dk, theme.palette.primary.main),
          }}
        >
          <GreetingRow
            actions={
              <>
                <Button
                  size="small"
                  disableElevation
                  onClick={() => setShareProfileOpen(true)}
                  startIcon={<Share sx={{ fontSize: 18 }} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: 12.5,
                    borderRadius: 9999,
                    px: 2,
                    py: 0.75,
                    color: dk.surfaceStrong,
                    background: `linear-gradient(125deg, ${alpha(dk.tertiaryLight, 0.92)} 0%, ${alpha(dk.primaryLight, 0.68)} 42%, ${alpha(dk.mint, 0.45)} 100%)`,
                    backdropFilter: "blur(12px) saturate(160%)",
                    WebkitBackdropFilter: "blur(12px) saturate(160%)",
                    border: `1px solid ${alpha(dk.tertiary, 0.5)}`,
                    boxShadow: `0 0 0 1px ${alpha(dk.white, 0.35)} inset, 0 8px 24px ${alpha(dk.surfaceStrong, 0.12)}`,
                    "&:hover": {
                      background: `linear-gradient(125deg, ${alpha(dk.tertiaryLight, 0.98)} 0%, ${alpha(dk.primaryLight, 0.85)} 45%, ${alpha(dk.mint, 0.55)} 100%)`,
                      borderColor: alpha(dk.tertiary, 0.75),
                    },
                  }}
                >
                  Partager mon profil
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AutoAwesome sx={{ fontSize: 16 }} />}
                  onClick={restartTour}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 12.5,
                    borderColor: alpha(dk.tertiary, 0.45),
                    color: dk.tertiary,
                    bgcolor: alpha(dk.white, 0.22),
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    "&:hover": {
                      borderColor: dk.tertiary,
                      bgcolor: alpha(dk.tertiary, 0.12),
                    },
                  }}
                >
                  Refaire la visite
                </Button>
              </>
            }
          />
        </Box>
      </Box>

      {/* Bannières informations profil — carte blanche, titre de section */}
      <Box ref={profileAlertRef}>
        <Box
          sx={{
            borderRadius: 3,
            p: { xs: 2, sm: 2.5 },
            ...dashGlassPanelSx(dk, theme.palette.primary.main),
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box
                aria-hidden
                sx={{
                  width: 4,
                  borderRadius: 1,
                  flexShrink: 0,
                  alignSelf: "stretch",
                  minHeight: 44,
                  background: `linear-gradient(180deg, ${alpha(dk.surfaceStrong, 0.95)} 0%, ${alpha(dk.tertiary, 0.75)} 100%)`,
                }}
              />
              <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "primary.main",
                    fontSize: "0.68rem",
                    lineHeight: 1.2,
                  }}
                >
                  Important
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 900,
                    color: "primary.dark",
                    lineHeight: 1.25,
                    fontSize: { xs: "1.05rem", sm: "1.2rem" },
                  }}
                >
                  À traiter avant d’avancer sur tes missions
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    lineHeight: 1.4,
                  }}
                >
                  Profil, documents et messages des structures : tout ce qui demande ton attention est listé ci-dessous.
                </Typography>
              </Stack>
            </Box>
            <Stack spacing={2}>
              <WireframeWelcomeBanner
                name="Anthony"
                tone="warning"
                compact
                dismissible={false}
                overline="OUPS"
                title="Ton profil n’est pas encore complet"
                message="Il te manque encore la pièce d’identité, la photo de profil et une adresse précise avec numéro de rue (comme demandé à l’inscription) pour pouvoir postuler aux missions."
                ctaLabel="Compléter mon profil"
              />
              <WireframeWelcomeBanner
                name="Anthony"
                tone="info"
                compact
                dismissible={false}
                overline="CÔTÉ STRUCTURE"
                title="Un Manager te demande des informations complémentaires"
                message="Pour la suite de ta mission, une structure précise encore quelques données (documents, précisions métier ou contacts d’urgence). Réponds dans le fil indiqué en messagerie pour que ton dossier avance sans blocage."
                ctaLabel="Ouvrir la messagerie"
              />
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Slider astuces (gauche) · Premiers pas Giveety (droite) — chaque croix ferme son bloc */}
      <Box ref={tipsRef}>
        {tipsOpen || premiersPasOpen ? (
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="stretch">
              {tipsOpen ? (
                <Box
                  sx={{
                    flex: { xs: "none", md: premiersPasOpen ? "1 1 50%" : "1 1 100%" },
                    minWidth: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: { md: premiersPasOpen ? 0 : undefined },
                    borderRadius: 3,
                    p: { xs: 1, sm: 1.25 },
                    ...dashGlassFrostedPanelSx(dk),
                  }}
                >
                  <WireframeTipsCarousel
                    onDismissChoice={onTipsDismissChoice}
                    fillColumnHeight={Boolean(tipsOpen && premiersPasOpen)}
                  />
                </Box>
              ) : null}
              {premiersPasOpen ? (
                <Box
                  sx={{
                    flex: { xs: "none", md: tipsOpen ? "1 1 50%" : "1 1 100%" },
                    minWidth: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: { md: tipsOpen ? 0 : undefined },
                    borderRadius: 3,
                    p: { xs: 1, sm: 1.25 },
                    ...dashGlassFrostedPanelSx(dk),
                  }}
                >
                  <WireframeChecklist pairedLayout onDismissChoice={onPremiersDismissChoice} />
                </Box>
              ) : null}
            </Stack>
            {!tipsOpen && premiersPasOpen && !tipsForeverDismissed ? (
              <ButtonBase
                onClick={() => setTipsOpen(true)}
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  p: 1.5,
                  ...dashGlassFrostedDashedButtonSx(dk),
                  color: "text.secondary",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: alpha(dk.border, 0.62),
                    bgcolor: alpha(dk.white, 0.62),
                    color: "text.primary",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Add sx={{ fontSize: 18 }} />
                  <span>Réafficher les astuces</span>
                </Stack>
              </ButtonBase>
            ) : null}
            {tipsOpen && !premiersPasOpen && !premiersForeverDismissed ? (
              <ButtonBase
                onClick={() => setPremiersPasOpen(true)}
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  p: 1.5,
                  ...dashGlassFrostedDashedButtonSx(dk),
                  color: "text.secondary",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: alpha(dk.border, 0.62),
                    bgcolor: alpha(dk.white, 0.62),
                    color: "text.primary",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Add sx={{ fontSize: 18 }} />
                  <span>Réafficher Premiers pas Giveety</span>
                </Stack>
              </ButtonBase>
            ) : null}
          </Stack>
        ) : !tipsForeverDismissed || !premiersForeverDismissed ? (
          <Stack spacing={2}>
            {!tipsForeverDismissed ? (
              <ButtonBase
                onClick={() => setTipsOpen(true)}
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  p: 1.5,
                  ...dashGlassFrostedDashedButtonSx(dk),
                  color: "text.secondary",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: alpha(dk.border, 0.62),
                    bgcolor: alpha(dk.white, 0.62),
                    color: "text.primary",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Add sx={{ fontSize: 18 }} />
                  <span>Réafficher les astuces</span>
                </Stack>
              </ButtonBase>
            ) : null}
            {!premiersForeverDismissed ? (
              <ButtonBase
                onClick={() => setPremiersPasOpen(true)}
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  p: 1.5,
                  ...dashGlassFrostedDashedButtonSx(dk),
                  color: "text.secondary",
                  fontWeight: 700,
                  fontSize: 13,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: alpha(dk.border, 0.62),
                    bgcolor: alpha(dk.white, 0.62),
                    color: "text.primary",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Add sx={{ fontSize: 18 }} />
                  <span>Réafficher Premiers pas Giveety</span>
                </Stack>
              </ButtonBase>
            ) : null}
          </Stack>
        ) : null}
      </Box>

      {/* Next contribution */}
      <Box ref={nextContribRef}>
        <SectionTitle title="Ma prochaine contribution" hint="Prochaine étape" hintVariant="pill" />
        <Box sx={{ mt: 1 }}>
          <NextContributionCard dk={dk} />
        </Box>
      </Box>

      {/* Commitment timeline – just under next contribution */}
      <Box ref={timelineRef}>
        <SectionTitle
          title="Ma timeline d'engagement"
          hint="ce qui arrive · ce qui s'est passé"
        />
        <Box sx={{ mt: 1 }}>
          <WireframeCommitmentTimeline />
        </Box>
      </Box>

      {/* Widgets grid – editable */}
      <Box ref={widgetsRef}>
        <Box ref={widgetsEditScopeRef}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "flex-start" }}
            justifyContent="space-between"
            spacing={1}
            sx={{ mb: 1 }}
            useFlexGap
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <SectionTitle
                title="Mon espace en un coup d'œil"
                hint={
                  editMode
                    ? "mode édition · ✕ pour retirer · glisser pour réorganiser"
                    : "les infos qui comptent"
                }
              />
            </Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ flexShrink: 0, justifyContent: { xs: "flex-start", sm: "flex-end" } }}
            >
              {editMode ? (
                <>
                  <Typography
                    variant="caption"
                    sx={{
                      color: dk.tertiary,
                      fontWeight: 700,
                      fontSize: 11,
                      px: 1,
                      py: 0.5,
                      borderRadius: 999,
                      bgcolor: alpha(dk.tertiary, 0.1),
                      whiteSpace: "nowrap",
                    }}
                  >
                    {visibleWidgets.length} / {WIDGET_DEFS.length} widgets
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={hiddenWidgets.length === 0}
                    startIcon={<Add sx={{ fontSize: 16 }} />}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddMenuAnchor(e.currentTarget);
                    }}
                    sx={{
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: 12,
                      bgcolor: dk.tertiary,
                      color: dk.white,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: darken(dk.tertiary, 0.08),
                        boxShadow: "none",
                      },
                      "&.Mui-disabled": {
                        bgcolor: alpha(dk.tertiary, 0.2),
                        color: alpha(dk.white, 0.7),
                      },
                    }}
                  >
                    {hiddenWidgets.length === 0
                      ? "Tous affichés"
                      : `Ajouter (${hiddenWidgets.length})`}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Check sx={{ fontSize: 16 }} />}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      exitEditMode();
                    }}
                    sx={{
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: 12.5,
                      bgcolor: dk.surfaceStrong,
                      color: dk.white,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: darken(dk.surfaceStrong, 0.08),
                        boxShadow: "none",
                      },
                    }}
                  >
                    Terminer
                  </Button>
                </>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Tune sx={{ fontSize: 16 }} />}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    enterEditMode();
                  }}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 12.5,
                    borderColor: alpha(dk.surfaceStrong, 0.4),
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: alpha(dk.surfaceStrong, 0.06),
                      borderColor: dk.surfaceStrong,
                    },
                  }}
                >
                  Modifier le dashboard
                </Button>
              )}
            </Stack>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            {visibleWidgets.map((key) => {
              const def = widgetDefsByKey[key];
              if (!def) return null;
              return (
                <EditableWidgetCard
                  key={key}
                  def={def}
                  dk={dk}
                  editing={editMode}
                  onDelete={() => removeWidget(key)}
                  isDragging={draggingKey === key}
                  isDropTarget={
                    editMode &&
                    draggingKey !== null &&
                    draggingKey !== key &&
                    dragOverKey === key
                  }
                  onDragStart={handleDragStart(key)}
                  onDragOver={handleDragOver(key)}
                  onDragLeave={handleDragLeave(key)}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop(key)}
                />
              );
            })}
            {editMode ? (
              <AddWidgetTile
                fullWidth
                hiddenCount={hiddenWidgets.length}
                dk={dk}
                onClick={(e) => {
                  e.stopPropagation();
                  setAddMenuAnchor(e.currentTarget);
                }}
              />
            ) : null}
          </Box>
        </Box>

        <Menu
          anchorEl={addMenuAnchor}
          open={Boolean(addMenuAnchor)}
          onClose={() => setAddMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.75,
                borderRadius: 2,
                minWidth: 280,
                maxHeight: 360,
                ...dashGlassPanelSx(dk, theme.palette.primary.main),
                border: `1px solid ${alpha(dk.white, 0.5)}`,
              },
            },
          }}
        >
          {hiddenWidgets.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Tous les widgets sont déjà affichés
              </Typography>
            </MenuItem>
          ) : (
            hiddenWidgets.map((def) => (
              <MenuItem
                key={def.key}
                onClick={() => addWidget(def.key)}
                sx={{ py: 1 }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                  <Add sx={{ fontSize: 18, color: dk.tertiary }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: "primary.main" }}>
                      {def.title}
                    </Typography>
                    {def.hint ? (
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontWeight: 600, fontSize: 11 }}
                      >
                        {def.hint}
                      </Typography>
                    ) : null}
                  </Box>
                </Stack>
              </MenuItem>
            ))
          )}
        </Menu>
      </Box>

      {/* CTA – passer à Giveety Pro */}
      <Box>
        <SectionTitle title="Passer à Giveety Pro" hint="débloquer toutes les fonctionnalités" />
        <Box sx={{ mt: 1 }}>
          <WireframeUpgradeBanner />
        </Box>
      </Box>

      {/* Activities Hub – collapsible, closed by default */}
      <Box ref={activitiesRef}>
        <CollapsibleSection
          dk={dk}
          title="Mes activités"
          hint="postulations, en cours, à venir, terminées"
          summary="9 engagements"
          defaultOpen={false}
        >
          <WireframeActivitiesHub />
        </CollapsibleSection>
      </Box>

      {/* Calendar – collapsible */}
      <Box ref={calendarRef}>
        <CollapsibleSection
          dk={dk}
          title="Mon agenda"
          hint="vue mois avec barres multi-jours"
          summary="Mai 2026"
          defaultOpen={false}
        >
          <WireframeMissionCalendar />
        </CollapsibleSection>
      </Box>

      </Box>

      <DashboardTour
        open={tourOpen}
        steps={steps}
        stepIdx={stepIdx}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={closeTour}
        rootRef={rootRef}
        dk={dk}
      />

      <BadgeUnlockedModal
        open={badgeOpen}
        onClose={() => setBadgeOpen(false)}
        dk={dk}
        tick={badgeTick}
      />

      <Modal
        open={shareProfileOpen}
        onClose={() => setShareProfileOpen(false)}
        aria-labelledby="share-profile-title"
        slotProps={{
          backdrop: { sx: { backdropFilter: "blur(18px) saturate(140%)", bgcolor: alpha("#000", 0.38) } },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "calc(100vw - 24px)", sm: 428 },
            maxWidth: 428,
            maxHeight: "calc(100vh - 48px)",
            overflow: "auto",
            borderRadius: 3,
            outline: "none",
            ...dashGlassModalBodySx(dk),
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2.25,
              background: `linear-gradient(128deg, ${alpha(dk.surfaceStrong, 0.92)} 0%, ${alpha(dk.tertiary, 0.55)} 52%, ${alpha(dk.primaryLight, 0.48)} 100%)`,
              backdropFilter: "blur(20px) saturate(170%)",
              WebkitBackdropFilter: "blur(20px) saturate(170%)",
              borderBottom: `1px solid ${alpha(dk.white, 0.22)}`,
              boxShadow: `inset 0 1px 0 ${alpha(dk.white, 0.2)}`,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
              <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                <Typography id="share-profile-title" sx={{ fontWeight: 800, fontSize: 21, color: dk.white, lineHeight: 1.2 }}>
                  Partager mon profil
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: alpha(dk.white, 0.92) }}>
                  QR code Giveety + lien public à copier ou envoyer.
                </Typography>
              </Stack>
              <IconButton
                size="small"
                onClick={() => setShareProfileOpen(false)}
                sx={{ color: dk.white, "&:hover": { bgcolor: alpha(dk.white, 0.12) } }}
                aria-label="Fermer"
              >
                <Close sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
          </Box>

            <Stack spacing={2.5} sx={{ p: 3, pt: 2.5, alignItems: "center", textAlign: "center", bgcolor: alpha(dk.white, 0.18), backdropFilter: "blur(8px)" }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(dk.white, 0.38),
                backdropFilter: "blur(14px) saturate(160%)",
                WebkitBackdropFilter: "blur(14px) saturate(160%)",
                border: `1px solid ${alpha(dk.white, 0.55)}`,
                boxShadow: `0 0 0 1px ${alpha(dk.white, 0.15)} inset`,
              }}
            >
              <WireframeProfileQRThumb encodedUrl={DASHBOARD_PROFILE_SHARE_URL} displaySizePx={168} />
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                wordBreak: "break-all",
                px: 1,
                display: "block",
                maxWidth: "100%",
              }}
            >
              {DASHBOARD_PROFILE_SHARE_URL}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ width: "100%" }}>
              <Button
                fullWidth
                disableElevation
                startIcon={<ContentCopy sx={{ fontSize: 18 }} />}
                onClick={copyProfileLink}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  py: 1.1,
                  borderRadius: 9999,
                  bgcolor: dk.surfaceStrong,
                  color: dk.white,
                  "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.08) },
                }}
              >
                Copier le lien
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={downloadQRPlaceholder}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  py: 1.1,
                  borderRadius: 9999,
                  borderColor: alpha(dk.border, 0.35),
                  color: "primary.main",
                  "&:hover": { borderColor: alpha(dk.tertiary, 0.6), bgcolor: alpha(dk.tertiaryLight, 0.35) },
                }}
              >
                Télécharger le QR
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={Boolean(shareSnack)}
        autoHideDuration={2800}
        onClose={() => setShareSnack(null)}
        message={shareSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
