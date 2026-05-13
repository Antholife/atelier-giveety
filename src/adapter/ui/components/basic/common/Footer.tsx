"use client";

import giveetyLogo from "@/adapter/ui/assets/giveety.svg";
import { marketingAbsolute, marketingWithLocale } from "@/adapter/ui/utils/marketingSite";
import {
  Construction as ConstructionIcon,
  EmailOutlined as EmailOutlinedIcon,
  GroupsOutlined,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  SendOutlined as SendOutlinedIcon,
} from "@mui/icons-material";
import { Box, Link as MuiLink, Typography, useTheme } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";

type FooterIconLinkProps = {
  icon: ReactNode;
  label: string;
  href?: string;
  disabled?: boolean;
  alignLeft?: boolean;
};

function FooterIconLink({ icon, label, href = "#", disabled = false, alignLeft = false }: FooterIconLinkProps) {
  const theme = useTheme();
  const white = theme.palette.background.default;

  return (
    <Box
      component={disabled ? "span" : "a"}
      href={disabled ? undefined : href}
      aria-disabled={disabled ? "true" : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: alignLeft ? { xs: "center", md: "flex-start" } : "center",
        gap: "10px",
        mb: "6px",
        color: white,
        textDecoration: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        "& .MuiSvgIcon-root": { color: "inherit" },
        "&:hover": disabled
          ? {
              textDecoration: "none !important",
              color: `${white} !important`,
            }
          : {
              textDecoration: "none",
              color: `${theme.palette.secondary.main} !important`,
              "& .MuiTypography-root, & .MuiSvgIcon-root": {
                color: `${theme.palette.secondary.main} !important`,
              },
            },
      }}
    >
      {icon}
      <Typography
        sx={{
          fontFamily: "var(--font-mulish), sans-serif",
          fontSize: "13px",
          lineHeight: 1.2,
          color: "inherit !important",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

type FooterColumnProps = {
  title: string;
  links: { label: string; href?: string; disabled?: boolean }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  const theme = useTheme();
  const white = theme.palette.background.default;
  const secondaryHover = theme.palette.secondary.main;

  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        sx={{
          minHeight: { xs: "30px", md: "44px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: { xs: "4px", md: "10px" },
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-mulish), sans-serif",
            fontSize: "16px",
            lineHeight: 1.2,
            fontWeight: 600,
            color: `${white} !important`,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          borderTop: { xs: "1px solid #FFFFFF", md: "1px solid rgba(255,255,255,0.45)" },
          width: { xs: "200px", md: "auto" },
          mx: "auto",
          mb: { xs: "6px", md: "12px" },
        }}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        {links.map((link) => (
          <Box
            key={link.label}
            component={link.disabled ? "span" : "a"}
            href={link.disabled ? undefined : link.href}
            aria-disabled={link.disabled ? "true" : undefined}
            sx={{
              fontFamily: "var(--font-mulish), sans-serif",
              fontSize: "13px",
              lineHeight: 1.2,
              color: `${white} !important`,
              textDecoration: "none",
              cursor: link.disabled ? "not-allowed" : "pointer",
              opacity: link.disabled ? 0.6 : 1,
              "&:hover": link.disabled
                ? { textDecoration: "none !important", color: `${white} !important` }
                : { textDecoration: "none", color: `${secondaryHover} !important` },
            }}
          >
            {link.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

type FooterBottomLinkProps = {
  label: string;
  mobileLabel?: string;
  href: string;
};

function FooterBottomLink({ label, mobileLabel, href }: FooterBottomLinkProps) {
  const theme = useTheme();
  const secondaryHover = theme.palette.secondary.main;
  const white = theme.palette.background.default;

  return (
    <MuiLink
      href={href}
      sx={{
        fontFamily: "var(--font-mulish), sans-serif",
        fontSize: "13px",
        lineHeight: 1.2,
        color: `${white} !important`,
        textDecoration: "none !important",
        "&:hover": { color: `${secondaryHover} !important`, textDecoration: "none !important" },
      }}
    >
      <Box component="span" sx={{ display: { xs: "inline", md: "none" } }}>
        {mobileLabel ?? label}
      </Box>
      <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
        {label}
      </Box>
    </MuiLink>
  );
}

function FooterDot() {
  const theme = useTheme();
  return (
    <Box component="span" sx={{ fontFamily: "var(--font-mulish), sans-serif", fontSize: "13px", color: theme.palette.background.default }}>
      •
    </Box>
  );
}

/**
 * Pied de page aligné sur le thème Keycloak Giveety (`NavbarFooterDefault`, repo docker).
 */
function Footer() {
  const theme = useTheme();
  const t = useTranslations("externalPages");
  const locale = useLocale();
  const primary = theme.palette.primary.main;
  const white = theme.palette.background.default;

  const termsHref = marketingWithLocale(locale, "/terms");
  const privacyHref = marketingWithLocale(locale, "/privacy-policy");

  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={{
        width: "100%",
        backgroundColor: primary,
        px: { xs: 0, md: 6 },
        pt: { xs: 0, md: "40px" },
        pb: { xs: "20px", md: "40px" },
        position: "relative",
        zIndex: 1,
        mt: "auto",
        color: white,
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: "-22px",
          width: "100%",
          height: "24px",
          background: primary,
          clipPath:
            "polygon(0 100%, 0 61%, 3% 43%, 8% 72%, 15% 34%, 19% 67%, 27% 39%, 33% 74%, 41% 36%, 48% 70%, 56% 33%, 62% 75%, 69% 38%, 77% 69%, 84% 35%, 90% 73%, 96% 41%, 100% 54%, 100% 100%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "2px",
          background: primary,
          pointerEvents: "none",
        },
        "& a": {
          color: "white !important",
          textDecoration: "none !important",
        },
        "& a:visited": {
          color: "white !important",
        },
        "& a:hover": {
          color: `${theme.palette.secondary.main} !important`,
        },
        "& .MuiTypography-root": {
          color: "inherit",
        },
      }}
    >
      <Box sx={{ maxWidth: "1320px", mx: "auto", display: "flex", flexDirection: "column" }}>
        <MuiLink
          href={marketingWithLocale(locale, "/")}
          sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center", px: "12px", pt: "10px", pb: "6px" }}
        >
          <Box sx={{ width: "120px", height: "auto", position: "relative" }}>
            <Image src={giveetyLogo} alt="Giveety" width={120} height={36} style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </Box>
        </MuiLink>
        <Box sx={{ display: { xs: "block", md: "none" }, borderTop: "1px solid #FFFFFF", width: "152px", mx: "auto", mb: "10px" }} />
        <Box sx={{ display: { xs: "block", md: "none" }, px: "12px", mb: "14px", textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: "var(--font-mulish), sans-serif",
              fontSize: "13px",
              lineHeight: 1.35,
              color: white,
              maxWidth: "290px",
              mb: "8px",
              mx: "auto",
            }}
          >
            {t("description1")}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-mulish), sans-serif",
              fontSize: "13px",
              lineHeight: 1.35,
              color: white,
              maxWidth: "290px",
              mx: "auto",
            }}
          >
            {t("description2")}
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" }, gap: "12px", mt: "2px", mb: "12px", justifyContent: "center" }}>
          <MuiLink
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/giveety.app"
            sx={{ color: `${white} !important`, display: "inline-flex" }}
          >
            <InstagramIcon sx={{ fontSize: "28px" }} />
          </MuiLink>
          <MuiLink
            className="footer-social-link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/showcase/eternitee-org"
            sx={{ color: `${white} !important`, display: "inline-flex" }}
          >
            <LinkedInIcon sx={{ fontSize: "28px" }} />
          </MuiLink>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr 1fr 1fr" },
            gap: { xs: 3, md: 5 },
            order: { xs: 2, md: 1 },
          }}
        >
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Box
              sx={{
                height: "45px",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                mb: "10px",
              }}
            >
              <MuiLink
                href={marketingWithLocale(locale, "/")}
                aria-label="Home"
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Box sx={{ width: "168px", height: "auto", position: "relative" }}>
                  <Image src={giveetyLogo} alt="Giveety" width={168} height={52} style={{ width: "100%", height: "auto" }} />
                </Box>
              </MuiLink>
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" }, borderTop: "1px solid rgba(255,255,255,0.45)", mb: "12px" }} />
            <Typography
              sx={{
                display: { xs: "none", md: "block" },
                fontFamily: "var(--font-mulish), sans-serif",
                fontSize: "13px",
                lineHeight: 1.35,
                color: white,
                maxWidth: "290px",
                mb: "8px",
                mx: "auto",
                textAlign: "center",
              }}
            >
              {t("description1")}
            </Typography>
            <Typography
              sx={{
                display: { xs: "none", md: "block" },
                fontFamily: "var(--font-mulish), sans-serif",
                fontSize: "13px",
                lineHeight: 1.35,
                color: white,
                maxWidth: "290px",
                mx: "auto",
                textAlign: "center",
              }}
            >
              {t("description2")}
            </Typography>
          </Box>

          <Box>
            <FooterColumn
              title={t("footerAboutUs")}
              links={[
                { label: t("footerWhoAreWe"), href: marketingAbsolute("/about-us") },
                { label: t("footerManifesto"), disabled: true },
                { label: t("footerSupportUs"), href: "mailto:contact@giveety.org" },
              ]}
            />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "12px", mt: "18px", justifyContent: "center" }}>
              <MuiLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/giveety.app"
                sx={{ color: `${white} !important`, display: "inline-flex" }}
              >
                <InstagramIcon sx={{ fontSize: "28px" }} />
              </MuiLink>
              <MuiLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/showcase/eternitee-org"
                sx={{ color: `${white} !important`, display: "inline-flex" }}
              >
                <LinkedInIcon sx={{ fontSize: "28px" }} />
              </MuiLink>
            </Box>
          </Box>

          <FooterColumn
            title={t("headerDiscover")}
            links={[
              { label: t("discoverServicesItem"), href: marketingAbsolute("/giveety-services") },
              { label: t("footerPricingAndTerms"), href: marketingAbsolute("/pricing") },
              { label: t("footerCompetencyFramework"), href: marketingWithLocale(locale, "/giveety/glossary") },
              { label: t("footerFaqFull"), href: marketingAbsolute("/faq") },
            ]}
          />

          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Box
              sx={{
                minHeight: { xs: "30px", md: "44px" },
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                mb: { xs: "4px", md: "10px" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-mulish), sans-serif",
                  fontSize: "16px",
                  lineHeight: 1.2,
                  fontWeight: 600,
                  color: `${white} !important`,
                }}
              >
                {t("footerStayInTouch")}
              </Typography>
            </Box>
            <Box
              sx={{
                borderTop: { xs: "1px solid #FFFFFF", md: "1px solid rgba(255,255,255,0.45)" },
                width: { xs: "200px", md: "auto" },
                mx: { xs: "auto", md: 0 },
                mb: { xs: "6px", md: "12px" },
              }}
            />
            <FooterIconLink icon={<SendOutlinedIcon sx={{ fontSize: "22px" }} />} label={t("footerNewsletter")} disabled alignLeft />
            <FooterIconLink
              icon={<GroupsOutlined sx={{ fontSize: "22px" }} />}
              label={t("footerGiveetyForMyOrganization")}
              href={marketingAbsolute("/contact")}
              alignLeft
            />
            <FooterIconLink
              icon={<ConstructionIcon sx={{ fontSize: "22px" }} />}
              label={t("contactSupport")}
              href={marketingAbsolute("/support")}
              alignLeft
            />
            <FooterIconLink
              icon={<EmailOutlinedIcon sx={{ fontSize: "22px" }} />}
              label={t("contactSendEmail")}
              href="mailto:contact@giveety.org"
              alignLeft
            />
          </Box>
        </Box>

        <Box sx={{ order: { xs: 3, md: 2 }, mb: { xs: 3, md: 0 } }}>
          <Box sx={{ borderTop: { xs: "none", md: "1px solid rgba(255,255,255,0.45)" }, mt: { xs: 0, md: 3 }, pt: "14px" }} />

          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "center", px: "12px", gap: "10px" }}>
            <FooterBottomLink label={t("cguTitle")} mobileLabel={t("footerConditionsMobile")} href={termsHref} />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "center", px: "12px", mt: "6px", gap: "10px" }}>
            <FooterBottomLink label={t("privacyTitle")} mobileLabel={t("footerDataProtectionMobile")} href={privacyHref} />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "center", px: "12px", mt: "6px" }}>
            <FooterBottomLink label={t("footerOrgTerms")} mobileLabel={t("footerOrgTerms")} href={marketingAbsolute("/organization-terms")} />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "center", px: "12px", mt: "6px" }}>
            <FooterBottomLink label={t("footerLegalMentions")} mobileLabel={t("footerLegalMentions")} href={marketingAbsolute("/legal-notice")} />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "center", px: "12px", mt: "10px" }}>
            <Typography sx={{ fontFamily: "var(--font-mulish), sans-serif", fontSize: "13px", lineHeight: 1.2, color: white }}>
              © {new Date().getFullYear()} {t("copyrightBrand")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex", lg: "grid" },
              flexDirection: { md: "column" },
              alignItems: "center",
              rowGap: { md: "8px", lg: 0 },
              gridTemplateColumns: { lg: "1fr auto 1fr" },
              color: white,
              width: "100%",
              minHeight: "24px",
            }}
          >
            <Typography sx={{ fontFamily: "var(--font-mulish), sans-serif", fontSize: "13px", lineHeight: 1.2, justifySelf: { lg: "start" }, color: white }}>
              © {new Date().getFullYear()} {t("copyrightBrand")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              <FooterBottomLink label={t("cguTitle")} mobileLabel={t("footerConditionsMobile")} href={termsHref} />
              <FooterDot />
              <FooterBottomLink label={t("privacyTitle")} mobileLabel={t("footerDataProtectionMobile")} href={privacyHref} />
              <FooterDot />
              <FooterBottomLink label={t("footerOrgTerms")} mobileLabel={t("footerOrgTerms")} href={marketingAbsolute("/organization-terms")} />
              <FooterDot />
              <FooterBottomLink label={t("footerLegalMentions")} mobileLabel={t("footerLegalMentions")} href={marketingAbsolute("/legal-notice")} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
