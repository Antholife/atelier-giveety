"use client";

import {
  AccessTime,
  Bolt,
  EmojiEvents,
  Refresh,
  TrendingUp,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { designKitPalette, type DesignKitPalette } from "./designKitPalette";

type Stat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon: ReactNode;
  tint: keyof Pick<DesignKitPalette, "primaryLight" | "tertiaryLight" | "surfaceMuted" | "mint">;
  delta: number;
};

const INITIAL_STATS: Stat[] = [
  {
    id: "hours",
    label: "Heures de bénévolat",
    value: 248,
    suffix: "h",
    icon: <AccessTime fontSize="small" />,
    tint: "primaryLight",
    delta: +12,
  },
  {
    id: "skills",
    label: "Compétences certifiées",
    value: 17,
    icon: <Bolt fontSize="small" />,
    tint: "tertiaryLight",
    delta: +3,
  },
  {
    id: "projects",
    label: "Projets engagés",
    value: 9,
    icon: <EmojiEvents fontSize="small" />,
    tint: "mint",
    delta: +1,
  },
  {
    id: "orgas",
    label: "Organisations",
    value: 4,
    icon: <TrendingUp fontSize="small" />,
    tint: "surfaceMuted",
    delta: 0,
  },
];

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(target);
  const startRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = startRef.current;
    const to = target;
    if (from === to) return undefined;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        startRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

function StatCard({ stat, dk }: { stat: Stat; dk: DesignKitPalette }) {
  const tintColor = dk[stat.tint];
  const display = useCountUp(stat.value);
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 160,
        p: 2.25,
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 10px 28px ${alpha(dk.surfaceStrong, 0.12)}`,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          bgcolor: alpha(tintColor, 0.55),
        }}
      />
      <Stack spacing={1} sx={{ position: "relative" }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: tintColor,
            color: dk.surfaceStrong,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {stat.icon}
        </Box>
        <Stack direction="row" alignItems="baseline" spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main" }}>
            {display}
          </Typography>
          {stat.suffix ? (
            <Typography sx={{ fontWeight: 700, color: "primary.main" }}>
              {stat.suffix}
            </Typography>
          ) : null}
        </Stack>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
          {stat.label}
        </Typography>
        {stat.delta !== 0 ? (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: stat.delta > 0 ? "success.main" : "error.main",
            }}
          >
            {stat.delta > 0 ? "+" : ""}
            {stat.delta} ce mois-ci
          </Typography>
        ) : (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Stable
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

export default function WireframeStatsRow() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [stats, setStats] = useState<Stat[]>(INITIAL_STATS);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setStats((prev) =>
      prev.map((s) => ({
        ...s,
        value: s.value + Math.floor(Math.random() * 8) - 1,
        delta: Math.floor(Math.random() * 9) - 2,
      })),
    );
    window.setTimeout(() => setRefreshing(false), 700);
  }, []);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
          Tableau de bord — données fictives
        </Typography>
        <Tooltip title="Rafraîchir les stats (démo)">
          <IconButton
            onClick={refresh}
            size="small"
            sx={{
              color: "primary.main",
              border: `1px solid ${alpha(dk.border, 0.3)}`,
              "&:hover": { bgcolor: alpha(dk.surfaceAccent, 0.4) },
            }}
          >
            <Refresh
              fontSize="small"
              sx={{
                transition: "transform 0.6s ease",
                transform: refreshing ? "rotate(360deg)" : "none",
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
      >
        {stats.map((s) => (
          <StatCard key={s.id} stat={s} dk={dk} />
        ))}
      </Stack>
    </Box>
  );
}
