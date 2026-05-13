"use client";

import giveetyLogo from "@/adapter/ui/assets/giveety.svg";
import {
  Email,
  Facebook,
  Instagram,
  LinkedIn,
  Send,
} from "@mui/icons-material";
import { Box, Divider, Link, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Fragment, ReactNode, useMemo } from "react";

import { capitalize } from "@/domain/services";

/**
 * Footer link structure
 *
 * @property label - Link label text
 * @property href - Link URL
 */
type FooterLink = {
  label: string;
  href: string;
};

/**
 * Social media link structure
 *
 * @property icon - Icon component for the social media platform
 * @property href - Link URL
 * @property label - Accessibility label
 */
type SocialLink = {
  icon: ReactNode;
  href: string;
  label: string;
};

/**
 * Footer component
 *
 * Displays the application footer with:
 * - Logo and description
 * - About us links
 * - Services links
 * - Contact information and social media links
 * - Legal links
 *
 * Features a wave design at the top and responsive layout.
 *
 * @returns The rendered footer component
 */
function Footer() {
  const theme = useTheme();
  const t = useTranslations();

  const aboutUsLinks: FooterLink[] = [
    { label: t("externalPages.manifest"), href: "#" },
    { label: t("externalPages.whoAreWe"), href: "#" },
    { label: t("externalPages.joinUs"), href: "#" },
    { label: t("externalPages.supportUs"), href: "#" },
  ];

  const servicesLinks: FooterLink[] = [
    { label: t("externalPages.forVolunteers"), href: "#" },
    { label: t("externalPages.forOrganizations"), href: "#" },
    { label: t("externalPages.pricing"), href: "#" },
    { label: t("externalPages.resources"), href: "#" },
  ];

  const socialLinks: SocialLink[] = [
    { icon: <Instagram />, href: "#", label: "Instagram" },
    { icon: <Facebook />, href: "#", label: "Facebook" },
    { icon: <LinkedIn />, href: "#", label: "LinkedIn" },
  ];

  const legalLinks: FooterLink[] = [
    { label: t("externalPages.faq"), href: "#" },
    { label: t("externalPages.termsOfUse"), href: "#" },
    { label: t("externalPages.privacyPolicy"), href: "#" },
    { label: t("externalPages.legalNotices"), href: "#" },
  ];

  const columnStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: { xs: "12px", sm: "16px" },
      width: { xs: "100%", md: "224px" },
      alignItems: "center" as const,
    }),
    [],
  );

  const titleStyles = useMemo(
    () => ({
      color: theme.palette.background.default,
      fontSize: { xs: "16px", sm: "18px" },
      fontWeight: 700,
      textAlign: "center" as const,
    }),
    [theme.palette.background.default],
  );

  const dividerStyles = useMemo(
    () => ({
      backgroundColor: theme.palette.background.default,
      width: "100%",
      marginBottom: { xs: 0.5, sm: 1 },
    }),
    [theme.palette.background.default],
  );

  const linkStyles = useMemo(
    () => ({
      color: theme.palette.background.default,
      textDecoration: "none",
      fontSize: { xs: "12px", sm: "14px" },
      transition: "color 0.3s ease",
      textAlign: "center" as const,
      "&:hover": {
        color: theme.palette.secondary.main,
      },
    }),
    [theme.palette.background.default, theme.palette.secondary.main],
  );

  const textStyles = useMemo(
    () => ({
      color: theme.palette.background.default,
      fontSize: { xs: "12px", sm: "14px" },
      lineHeight: { xs: "18px", sm: "20px" },
      textAlign: "center",
    }),
    [theme.palette.background.default],
  );

  const renderColumn = (
    title: string | ReactNode,
    content: ReactNode,
    isLogoColumn = false,
  ) => (
    <Box sx={columnStyles}>
      {isLogoColumn ? (
        <Box
          sx={{
            height: { xs: "auto", sm: "20px" },
            marginBottom: { xs: 0.5, sm: 1 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          {title}
        </Box>
      ) : (
        <Typography sx={titleStyles}>{title}</Typography>
      )}
      <Divider sx={dividerStyles} />
      {content}
    </Box>
  );

  const renderLinkList = (links: FooterLink[]) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1, sm: 1.5 },
      }}
    >
      {links.map((link, index) => (
        <Link key={index} href={link.href} sx={linkStyles}>
          {link.label}
        </Link>
      ))}
    </Box>
  );

  const waveSvg = `<svg width="100%" height="30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0,20 L45,20 L70,16 L110,20 L160,20 L195,18 L240,20 L290,20 L330,15 L380,20 L430,20 L470,17 L520,20 L580,20 L620,19 L670,20 L730,20 L770,16 L820,20 L880,20 L920,18 L970,20 L1030,20 L1070,15 L1120,20 L1180,20 L1220,17 L1280,20 L1350,20 L1390,19 L1440,20 L1500,20 L1540,16 L1590,20 L1650,20 L1690,18 L1740,20 L1800,20 L1840,15 L1890,20 L1950,20 L1990,17 L2040,20 L2100,20 L2140,19 L2190,20 L2250,20 L2290,16 L2340,20 L2400,20 L2440,18 L2490,20 L2550,20 L2590,15 L2640,20 L2700,20 L2740,17 L2790,20 L2850,20 L2890,19 L2940,20 L3000,20 L3040,16 L3090,20 L3150,20 L3190,18 L3250,20 L3300,20 L3340,15 L3400,20 L3400,30 L0,30 Z" fill="black"/></svg>`;

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default,
        padding: {
          xs: "20px 8px",
          sm: "30px 16px",
          md: "40px 120px 20px 120px",
        },
        marginTop: "auto",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 1,
          left: 0,
          width: "100%",
          height: "30px",
          backgroundColor: theme.palette.primary.main,
          maskImage: `url("data:image/svg+xml,${encodeURIComponent(waveSvg)}")`,
          WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(waveSvg)}")`,
          maskRepeat: "no-repeat",
          maskSize: "100% 30px",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "100% 30px",
          transform: "translateY(-100%)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 3, sm: 4, md: 6 },
          marginBottom: { xs: 2, sm: 3, md: 4 },
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {renderColumn(
          <Box
            sx={{
              width: { xs: "144px", sm: "180px", md: "216px" },
              height: { xs: "auto", sm: "auto", md: "72px" },
            }}
          >
            <Image
              src={giveetyLogo}
              alt="Giveety Logo"
              width={216}
              height={72}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>,
          <Fragment>
            <Typography sx={textStyles}>
              {t("externalPages.description1")}
            </Typography>
            <Typography sx={textStyles}>
              {t("externalPages.description2")}
            </Typography>
          </Fragment>,
          true,
        )}

        {renderColumn(
          capitalize(t("externalPages.aboutUs")),
          renderLinkList(aboutUsLinks),
        )}

        {renderColumn(
          capitalize(t("externalPages.ourServices")),
          renderLinkList(servicesLinks),
        )}

        {renderColumn(
          capitalize(t("externalPages.stayInTouch")),
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 1, sm: 1.5 },
                justifyContent: "center",
              }}
            >
              <Link
                href="#"
                sx={{
                  ...linkStyles,
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                <Email sx={{ fontSize: { xs: "16px", sm: "20px" } }} />
                {t("externalPages.contactByEmail")}
              </Link>
              <Link
                href="#"
                sx={{
                  ...linkStyles,
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.5, sm: 1 },
                }}
              >
                <Send sx={{ fontSize: { xs: "16px", sm: "20px" } }} />
                {t("externalPages.newsletter")}
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1.5 },
                marginTop: { xs: 0.5, sm: 1 },
                justifyContent: "center",
              }}
            >
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    color: theme.palette.background.default,
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: theme.palette.secondary.main,
                      transform: "scale(1.1)",
                    },
                    "& svg": {
                      fontSize: { xs: "24px", sm: "30px" },
                    },
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </Box>
          </>,
        )}
      </Box>

      <Divider
        sx={{
          backgroundColor: theme.palette.background.default,
          marginY: { xs: 2, sm: 3 },
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 2 },
          alignItems: "center",
          justifyContent: { xs: "center", md: "center" },
        }}
      >
        {legalLinks.map((link, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Link href={link.href} sx={linkStyles}>
              {link.label}
            </Link>
            {index < legalLinks.length - 1 && (
              <Box
                sx={{
                  width: { xs: "3px", sm: "4px" },
                  height: { xs: "3px", sm: "4px" },
                  borderRadius: "50%",
                  backgroundColor: theme.palette.background.default,
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Footer;
