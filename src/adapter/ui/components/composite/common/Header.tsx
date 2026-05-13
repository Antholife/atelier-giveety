"use client";

import giveetyLogo from "@/adapter/ui/assets/giveety.svg";
import { marketingAbsolute, marketingWithLocale } from "@/adapter/ui/utils/marketingSite";
import { capitalize } from "@/domain/services";
import ConstructionIcon from "@mui/icons-material/Construction";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import MenuIcon from "@mui/icons-material/Menu";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import {
  AppBar as MuiAppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { type MouseEvent, type ReactNode, useCallback, useMemo, useState } from "react";
import { LanguageSwitcher } from "../../basic/common";

const KC_HEADER_SHADOW =
  "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)";

function MarketingLink({
  href,
  children,
  sx,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: ReactNode;
  sx?: object;
  ["aria-label"]?: string;
}) {
  return (
    <Box
      component="a"
      href={href}
      aria-label={ariaLabel}
      sx={{ textDecoration: "none", color: "inherit", ...(sx ?? {}) } as object}
    >
      {children}
    </Box>
  );
}

type DropdownItem = { label: string; href?: string; disabled?: boolean; icon?: ReactNode };

function DesktopHoverDropdown(props: {
  label: string;
  items: DropdownItem[];
  primary: string;
  hoverColor: string;
}) {
  const { label, items, primary, hoverColor } = props;

  return (
    <Box
      sx={{
        position: "relative",
        mr: "32px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        [`&:hover .kf-dd-panel`]: {
          opacity: 1,
          transform: "translate(-50%, 0)",
          pointerEvents: "auto",
        },
        [`&:hover .kf-dd-trigger`]: {
          color: `${hoverColor} !important`,
        },
      }}
    >
      <Box
        className="kf-dd-trigger"
        sx={{
          my: 2,
          color: "white",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          textTransform: "none",
          fontFamily: "var(--font-mulish), sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: 1.2,
          transition: "color 0.2s ease",
        }}
      >
        {label}
        <KeyboardArrowDownIcon sx={{ fontSize: "18px", color: "inherit" }} />
      </Box>
      <Box
        className="kf-dd-panel"
        sx={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translate(-50%, 6px)",
          minWidth: "270px",
          backgroundColor: "rgba(255,255,255,0.96)",
          border: `1px solid ${alpha(primary, 0.2)}`,
          borderRadius: "14px",
          boxShadow: `0 18px 40px ${alpha(primary, 0.2)}`,
          backdropFilter: "blur(8px)",
          p: "8px",
          opacity: 0,
          pointerEvents: "none",
          transition: "opacity 0.18s ease, transform 0.18s ease",
          zIndex: 20,
        }}
      >
        {items.map((dropdownItem, itemIndex) => (
          <Box key={dropdownItem.label}>
            <Box
              component={dropdownItem.disabled ? "span" : "a"}
              href={dropdownItem.disabled ? undefined : dropdownItem.href}
              sx={{
                width: "100%",
                border: "none",
                background: "transparent",
                borderRadius: "10px",
                py: "10px",
                px: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: dropdownItem.icon ? "flex-start" : "center",
                gap: "8px",
                fontFamily: "var(--font-mulish), sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1.25,
                color: primary,
                cursor: dropdownItem.disabled ? "not-allowed" : "pointer",
                opacity: dropdownItem.disabled ? 0.6 : 1,
                textDecoration: "none",
                "&:hover": dropdownItem.disabled
                  ? {}
                  : {
                      backgroundColor: alpha(primary, 0.08),
                      transform: "translateX(2px)",
                    },
              }}
            >
              {dropdownItem.icon ? (
                <Box component="span" sx={{ display: "inline-flex", color: "inherit", mr: "6px" }}>
                  {dropdownItem.icon}
                </Box>
              ) : null}
              {dropdownItem.label}
            </Box>
            {itemIndex < items.length - 1 ? (
              <Box sx={{ borderTop: `1px solid ${alpha(primary, 0.14)}`, mx: "8px" }} />
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/** En-tête aligné sur Keycloak Giveety docker (`Navbar.tsx` type header, variante giveety). */
function Header() {
  const theme = useTheme();
  const t = useTranslations("externalPages");
  const locale = useLocale();
  const primary = theme.palette.primary.main;
  const secondaryHover = theme.palette.secondary.main;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [mobileDropdown, setMobileDropdown] = useState<null | "services" | "resources" | "about" | "contact">(null);

  const orgHref = marketingAbsolute("/find-an-organization");
  const activityHref = marketingAbsolute("/find-an-activity");

  const servicesItems: DropdownItem[] = useMemo(
    () => [
      { label: t("discoverServicesItem"), href: marketingAbsolute("/giveety-services") },
      { label: t("footerPricingAndTerms"), href: marketingAbsolute("/pricing") },
    ],
    [t],
  );

  const resourcesItems: DropdownItem[] = useMemo(
    () => [
      {
        label: t("footerCompetencyFramework"),
        href: marketingWithLocale(locale, "/giveety/glossary"),
        icon: <MenuBookRoundedIcon sx={{ fontSize: "18px" }} />,
      },
      {
        label: t("footerFaqFull"),
        href: marketingAbsolute("/faq"),
        icon: <QuizOutlinedIcon sx={{ fontSize: "18px" }} />,
      },
    ],
    [locale, t],
  );

  const aboutItems: DropdownItem[] = useMemo(
    () => [
      { label: t("footerWhoAreWe"), href: marketingAbsolute("/about-us") },
      { label: t("footerManifesto"), disabled: true },
      { label: t("footerSupportUs"), href: "mailto:contact@giveety.org" },
    ],
    [t],
  );

  const contactItems: DropdownItem[] = useMemo(
    () => [
      { label: t("footerNewsletter"), disabled: true, icon: <SendOutlinedIcon sx={{ fontSize: "18px" }} /> },
      {
        label: t("footerGiveetyForMyOrganization"),
        href: marketingAbsolute("/contact"),
        icon: <GroupsOutlinedIcon sx={{ fontSize: "18px" }} />,
      },
      {
        label: t("contactSupport"),
        href: marketingAbsolute("/support"),
        icon: <ConstructionIcon sx={{ fontSize: "18px" }} />,
      },
      { label: t("contactSendEmail"), href: "mailto:contact@giveety.org", icon: <EmailOutlinedIcon sx={{ fontSize: "18px" }} /> },
    ],
    [t],
  );

  const contactDropdownMinWidth = "320px";

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
    setMobileDropdown(null);
  }, []);

  const navButtonSx = useMemo(
    () => ({
      my: 2,
      color: "white",
      textTransform: "none" as const,
      mr: "32px",
      fontFamily: "var(--font-mulish), sans-serif",
      fontWeight: 500,
      fontSize: "14px",
      borderRadius: 0,
      minWidth: "auto",
      "&:hover": {
        color: `${secondaryHover} !important`,
        backgroundColor: "transparent",
      },
    }),
    [secondaryHover],
  );

  return (
    <MuiAppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: 10,
        height: { xs: "50px", md: "90px" },
        justifyContent: "center",
        backgroundColor: primary,
        borderBottom: "none",
        px: { xs: 2, md: 8 },
        boxShadow: KC_HEADER_SHADOW,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            px: { xs: 0.5, md: "12px" },
            justifyContent: "space-between",
            width: "100%",
            minHeight: { xs: "50px", md: "90px" },
          }}
        >
          {/* Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", width: "100%", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MarketingLink href={marketingWithLocale(locale, "/")} sx={{ display: "flex", alignItems: "center", mr: "3.5rem" }}>
                <Box sx={{ width: "144px", height: "48px", position: "relative" }}>
                  <Image src={giveetyLogo as string} alt="Giveety" fill sizes="144px" style={{ objectFit: "contain" }} />
                </Box>
              </MarketingLink>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button component="a" href={orgHref} sx={navButtonSx}>
                  {capitalize(t("organizations"))}
                </Button>
                <Button component="a" href={activityHref} sx={navButtonSx}>
                  {capitalize(t("activities"))}
                </Button>
                <DesktopHoverDropdown label={t("headerDiscover")} items={servicesItems} primary={primary} hoverColor={secondaryHover} />
                <DesktopHoverDropdown label={t("footerResources")} items={resourcesItems} primary={primary} hoverColor={secondaryHover} />
                <DesktopHoverDropdown label={t("headerAbout")} items={aboutItems} primary={primary} hoverColor={secondaryHover} />
                <Box
                  sx={{
                    position: "relative",
                    mr: "32px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    "&:hover .kf-dd-contact": { opacity: 1, transform: "translate(-50%, 0)", pointerEvents: "auto" },
                    "&:hover .kf-dd-contact-tr": { color: `${secondaryHover} !important` },
                  }}
                >
                  <Box
                    className="kf-dd-contact-tr"
                    sx={{
                      my: 2,
                      color: "white",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      textTransform: "none",
                      fontFamily: "var(--font-mulish), sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      transition: "color 0.2s ease",
                    }}
                  >
                    {t("headerContact")}
                    <KeyboardArrowDownIcon sx={{ fontSize: "18px" }} />
                  </Box>
                  <Box
                    className="kf-dd-contact"
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translate(-50%, 6px)",
                      minWidth: contactDropdownMinWidth,
                      backgroundColor: "rgba(255,255,255,0.96)",
                      border: `1px solid ${alpha(primary, 0.2)}`,
                      borderRadius: "14px",
                      boxShadow: `0 18px 40px ${alpha(primary, 0.2)}`,
                      backdropFilter: "blur(8px)",
                      p: "8px",
                      opacity: 0,
                      pointerEvents: "none",
                      transition: "opacity 0.18s ease, transform 0.18s ease",
                      zIndex: 20,
                    }}
                  >
                    {contactItems.map((dropdownItem, itemIndex) => (
                      <Box key={dropdownItem.label}>
                        <Box
                          component={dropdownItem.disabled ? "span" : "a"}
                          href={dropdownItem.disabled ? undefined : dropdownItem.href}
                          sx={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            borderRadius: "10px",
                            py: "10px",
                            px: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "8px",
                            fontFamily: "var(--font-mulish), sans-serif",
                            fontSize: "13px",
                            fontWeight: 600,
                            lineHeight: 1.25,
                            color: primary,
                            cursor: dropdownItem.disabled ? "not-allowed" : "pointer",
                            opacity: dropdownItem.disabled ? 0.6 : 1,
                            textDecoration: "none",
                            "&:hover": dropdownItem.disabled
                              ? {}
                              : { backgroundColor: alpha(primary, 0.08), transform: "translateX(2px)" },
                          }}
                        >
                          {dropdownItem.icon ? (
                            <Box component="span" sx={{ display: "inline-flex", color: "inherit", mr: "6px" }}>
                              {dropdownItem.icon}
                            </Box>
                          ) : null}
                          {dropdownItem.label}
                        </Box>
                        {itemIndex < contactItems.length - 1 ? (
                          <Box sx={{ borderTop: `1px solid ${alpha(primary, 0.14)}`, mx: "8px" }} />
                        ) : null}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LanguageSwitcher />
            </Box>
          </Box>

          {/* Mobile */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              size="small"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ p: 0.5, minWidth: "40px", height: "40px", color: theme.palette.common.white }}
            >
              <MenuIcon />
            </IconButton>
            <MarketingLink href={marketingWithLocale(locale, "/")} sx={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center" }}>
              <Box sx={{ width: "112px", height: "36px", position: "relative" }}>
                <Image src={giveetyLogo as string} alt="Giveety" fill sizes="112px" style={{ objectFit: "contain" }} />
              </Box>
            </MarketingLink>
            <Box sx={{ minWidth: "40px", display: "flex", justifyContent: "flex-end", width: 72 }}>
              <LanguageSwitcher />
            </Box>
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            {[
              { key: "org" as const, label: capitalize(t("organizations")), href: orgHref },
              { key: "act" as const, label: capitalize(t("activities")), href: activityHref },
            ].map((row) => (
              <MenuItem
                key={row.key}
                component="a"
                href={row.href}
                onClick={handleCloseNavMenu}
                sx={{ "& .MuiTypography-root": { color: `${primary} !important`, fontFamily: "var(--font-mulish), sans-serif" } }}
              >
                <Typography sx={{ fontWeight: 600 }}>{row.label}</Typography>
              </MenuItem>
            ))}
            {(
              [
                { key: "services" as const, label: t("headerDiscover"), items: servicesItems },
                { key: "resources" as const, label: t("footerResources"), items: resourcesItems },
                { key: "about" as const, label: t("headerAbout"), items: aboutItems },
                { key: "contact" as const, label: t("headerContact"), items: contactItems },
              ] as const
            ).map((section) => {
              const open = mobileDropdown === section.key;
              return (
                <MenuItem
                  key={section.key}
                  onClick={() => setMobileDropdown(open ? null : section.key)}
                  sx={{ display: "block" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <Typography sx={{ fontFamily: "var(--font-mulish), sans-serif", fontWeight: 600, color: `${primary} !important` }}>
                      {section.label}
                    </Typography>
                    <KeyboardArrowDownIcon
                      sx={{ fontSize: "20px", color: primary, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                    />
                  </Box>
                  {open ? (
                    <Box sx={{ mt: "8px", borderRadius: "10px", backgroundColor: alpha(primary, 0.05), p: "6px" }}>
                      {section.items.map((item, idx) => (
                        <Box key={item.label}>
                          <Box
                            component={item.disabled ? "span" : "a"}
                            href={item.disabled ? undefined : item.href}
                            onClick={
                              item.disabled
                                ? undefined
                                : (e: MouseEvent) => {
                                    e.stopPropagation();
                                    handleCloseNavMenu();
                                  }
                            }
                            sx={{
                              width: "100%",
                              py: "8px",
                              px: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "8px",
                              fontFamily: "var(--font-mulish), sans-serif",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: primary,
                              textDecoration: "none",
                              cursor: item.disabled ? "not-allowed" : "pointer",
                              opacity: item.disabled ? 0.6 : 1,
                            }}
                          >
                            {item.icon ? <Box sx={{ display: "inline-flex" }}>{item.icon}</Box> : null}
                            {item.label}
                          </Box>
                          {idx < section.items.length - 1 ? <Box sx={{ borderTop: `1px solid ${alpha(primary, 0.14)}`, mx: "8px" }} /> : null}
                        </Box>
                      ))}
                    </Box>
                  ) : null}
                </MenuItem>
              );
            })}
          </Menu>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}

export default Header;
