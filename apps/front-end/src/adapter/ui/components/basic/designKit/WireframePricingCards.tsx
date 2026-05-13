"use client";

import { Check } from "@mui/icons-material";
import { Box, Button, Chip, Stack, Typography, useTheme } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: { monthly: number; yearly: number };
  cta: string;
  features: string[];
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Pour démarrer",
    price: { monthly: 0, yearly: 0 },
    cta: "Démarrer gratuitement",
    features: ["3 certificats / mois", "1 manager", "Profil public", "Badges"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Pour aller plus loin",
    price: { monthly: 7, yearly: 60 },
    cta: "Essayer 14 jours",
    features: [
      "Certificats illimitées",
      "5 managers",
      "Templates premium",
      "Export PDF / DOCX",
      "Stats détaillées",
    ],
    highlight: true,
  },
  {
    id: "asso",
    name: "Asso",
    tagline: "Pour les structures",
    price: { monthly: 29, yearly: 290 },
    cta: "Demander un devis",
    features: [
      "Tout Pro inclus",
      "Membres illimités",
      "Sigle et charte",
      "Support prioritaire",
      "API & SSO",
    ],
  },
];

export default function WireframePricingCards() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");

  const togglePeriod = useCallback(() => {
    setPeriod((p) => (p === "monthly" ? "yearly" : "monthly"));
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.white,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: "primary.main" }}>
            Choisis ta formule
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Sans engagement · changement à tout moment.
          </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            p: 0.5,
            borderRadius: 9999,
            bgcolor: alpha(dk.surfaceMuted, 0.5),
            border: `1px solid ${alpha(dk.border, 0.15)}`,
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: 4,
              bottom: 4,
              left: 4,
              width: "calc(50% - 4px)",
              borderRadius: 9999,
              bgcolor: dk.white,
              transform: period === "yearly" ? "translateX(100%)" : "translateX(0%)",
              transition: "transform 0.32s cubic-bezier(.4,1.4,.4,1)",
              boxShadow: `0 2px 8px ${alpha(dk.surfaceStrong, 0.18)}`,
            }}
          />
          {(["monthly", "yearly"] as const).map((p) => (
            <Box
              key={p}
              onClick={togglePeriod}
              sx={{
                position: "relative",
                px: 2,
                py: 0.75,
                fontSize: 12,
                fontWeight: 800,
                color: period === p ? "primary.main" : "text.secondary",
                cursor: "pointer",
                borderRadius: 9999,
                transition: "color 0.2s ease",
              }}
            >
              {p === "monthly" ? "Mensuel" : "Annuel · -20%"}
            </Box>
          ))}
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {PLANS.map((plan) => {
          const price = plan.price[period];
          return (
            <Box
              key={plan.id}
              sx={{
                position: "relative",
                p: 2.5,
                borderRadius: 3,
                bgcolor: plan.highlight ? dk.surfaceStrong : dk.white,
                color: plan.highlight ? dk.white : "primary.main",
                border: `1px solid ${plan.highlight ? "transparent" : alpha(dk.border, 0.18)}`,
                boxShadow: plan.highlight
                  ? `0 12px 28px ${alpha(dk.surfaceStrong, 0.3)}`
                  : `0 4px 12px ${alpha(dk.surfaceStrong, 0.06)}`,
                transform: plan.highlight ? "translateY(-4px)" : "none",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "translateY(-6px)" },
              }}
            >
              {plan.highlight ? (
                <Chip
                  label="POPULAIRE"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: dk.tertiary,
                    color: dk.white,
                    fontWeight: 800,
                    height: 20,
                    fontSize: 9,
                  }}
                />
              ) : null}

              <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{plan.name}</Typography>
              <Typography
                variant="caption"
                sx={{ opacity: plan.highlight ? 0.85 : 1, color: plan.highlight ? alpha(dk.white, 0.85) : "text.secondary", fontWeight: 600 }}
              >
                {plan.tagline}
              </Typography>

              <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
                <Typography sx={{ fontWeight: 900, fontSize: 36, lineHeight: 1 }}>
                  {price === 0 ? "0€" : `${period === "monthly" ? price : Math.round(price / 12)}€`}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 700, opacity: 0.8, color: plan.highlight ? alpha(dk.white, 0.8) : "text.secondary" }}
                >
                  / mois
                </Typography>
              </Stack>

              <Stack spacing={1} sx={{ mb: 2.5 }}>
                {plan.features.map((f) => (
                  <Stack key={f} direction="row" alignItems="center" spacing={1}>
                    <Check sx={{ fontSize: 16, color: plan.highlight ? dk.tertiary : "tertiary.main" }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: plan.highlight ? alpha(dk.white, 0.9) : "primary.main" }}>
                      {f}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Button
                fullWidth
                disableElevation
                sx={{
                  borderRadius: 9999,
                  textTransform: "none",
                  fontWeight: 800,
                  py: 1.25,
                  bgcolor: plan.highlight ? dk.white : dk.surfaceStrong,
                  color: plan.highlight ? dk.surfaceStrong : dk.white,
                  "&:hover": {
                    bgcolor: plan.highlight ? darken(dk.white, 0.04) : darken(dk.surfaceStrong, 0.1),
                  },
                }}
              >
                {plan.cta}
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
