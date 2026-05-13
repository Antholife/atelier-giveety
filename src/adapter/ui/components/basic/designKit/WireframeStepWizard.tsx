"use client";

import { Check, ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { useCallback, useMemo, useState } from "react";
import { designKitPalette } from "./designKitPalette";

const STEPS = [
  { id: "infos", label: "Infos", question: "Comment t'appelles-tu ?", placeholder: "Prénom" },
  { id: "mission", label: "Mission", question: "Quelle est ta mission préférée ?", placeholder: "Maraude, atelier…" },
  { id: "manager", label: "Manager", question: "E-mail de ton manager", placeholder: "manager@asso.fr" },
  { id: "recap", label: "Récap", question: "", placeholder: "" },
] as const;

export default function WireframeStepWizard() {
  const theme = useTheme();
  const dk = useMemo(() => designKitPalette(theme), [theme]);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const current = STEPS[step];
  const canNext = step === STEPS.length - 1 || (values[current.id]?.trim().length ?? 0) > 0;

  const update = useCallback(
    (v: string) => setValues((prev) => ({ ...prev, [current.id]: v })),
    [current.id],
  );

  const next = useCallback(() => {
    if (step === STEPS.length - 1) {
      setDone(true);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }, [step]);

  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  const reset = useCallback(() => {
    setStep(0);
    setValues({});
    setDone(false);
  }, []);

  if (done) {
    return (
      <Box
        sx={{
          borderRadius: 3,
          bgcolor: dk.canvas,
          border: `1px solid ${alpha(dk.border, 0.18)}`,
          boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
          p: 4,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            bgcolor: dk.surfaceStrong,
            color: dk.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
          Demande envoyée 🎉
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          On a transmis ta demande à {values.manager || "ton manager"}.
        </Typography>
        <Button onClick={reset} sx={{ textTransform: "none", fontWeight: 700, color: "tertiary.main" }}>
          Recommencer
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        borderRadius: 3,
        bgcolor: dk.canvas,
        border: `1px solid ${alpha(dk.border, 0.18)}`,
        boxShadow: `0 4px 18px ${alpha(dk.surfaceStrong, 0.06)}`,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          minWidth: { sm: 200 },
          bgcolor: alpha(dk.surfaceMuted, 0.3),
          p: 2,
          borderRight: { sm: `1px solid ${alpha(dk.border, 0.12)}` },
        }}
      >
        <Stack spacing={1.25}>
          {STEPS.map((s, i) => {
            const isDone = i < step;
            const isActive = i === step;
            return (
              <Stack
                key={s.id}
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={() => i <= step && setStep(i)}
                sx={{ cursor: i <= step ? "pointer" : "default", opacity: i > step ? 0.5 : 1 }}
              >
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    bgcolor: isDone ? dk.surfaceStrong : isActive ? dk.tertiary : dk.canvas,
                    border: `2px solid ${isDone || isActive ? "transparent" : alpha(dk.border, 0.3)}`,
                    color: isDone || isActive ? dk.white : dk.textMuted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {isDone ? <Check sx={{ fontSize: 14 }} /> : i + 1}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {s.label}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Box>

      <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 240 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "tertiary.main", fontWeight: 800 }}>
            ÉTAPE {step + 1} / {STEPS.length}
          </Typography>
          {step === STEPS.length - 1 ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mt: 0.5, mb: 2 }}>
                Récapitulatif
              </Typography>
              <Stack spacing={1}>
                {STEPS.slice(0, -1).map((s) => (
                  <Stack key={s.id} direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      {s.label}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.main" }}>
                      {values[s.id] || "—"}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main", mt: 0.5, mb: 1.5 }}>
                {current.question}
              </Typography>
              <TextField
                fullWidth
                value={values[current.id] || ""}
                onChange={(e) => update(e.target.value)}
                placeholder={current.placeholder}
                size="small"
                autoFocus
              />
            </Box>
          )}
        </Box>
        <Stack direction="row" justifyContent="space-between" sx={{ pt: 2 }}>
          <Button
            onClick={prev}
            disabled={step === 0}
            startIcon={<ChevronLeft />}
            sx={{ textTransform: "none", fontWeight: 700, color: "text.secondary" }}
          >
            Retour
          </Button>
          <Button
            onClick={next}
            disabled={!canNext}
            endIcon={<ChevronRight />}
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 800,
              borderRadius: 9999,
              px: 2.5,
              bgcolor: dk.surfaceStrong,
              color: dk.white,
              "&:hover": { bgcolor: darken(dk.surfaceStrong, 0.1) },
            }}
          >
            {step === STEPS.length - 1 ? "Envoyer" : "Suivant"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
