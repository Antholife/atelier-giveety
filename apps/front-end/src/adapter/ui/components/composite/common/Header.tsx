"use client";
import giveetyLogo from "@/adapter/ui/assets/giveety.svg";
import { capitalize } from "@/domain/services";
import { APP_VERSION } from "@/infra/version";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  AppBar as MuiAppbar,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { MouseEvent, useMemo, useState } from "react";
import { Button, LanguageSwitcher } from "../../basic/common";

/**
 * Main application header component
 *
 * Displays the application header with:
 * - Logo
 * - Navigation menu (mobile hamburger menu, desktop buttons)
 * - Version information and feedback link
 * - Language switcher
 * - Member space button
 *
 * Features responsive design with different layouts for mobile and desktop.
 *
 * @returns The rendered header component
 */
function Header() {
  const t = useTranslations();

  const pages = useMemo(
    () => [
      {
        label: capitalize(t("externalPages.organizations")),
        baseUrl: "/organizations",
        onClick: () => {},
      },
      {
        label: capitalize(t("externalPages.activities")),
        baseUrl: "/activities",
        onClick: () => {},
      },
    ],
    [t],
  );

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget as HTMLElement);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <MuiAppbar
      position="fixed"
      sx={{
        zIndex: 10,
        "& .MuiButton-root": {
          textTransform: "none",
          fontSize: { xs: "12px", sm: "14px" },
          fontWeight: 500,
        },
        "&.MuiAppBar-root": {
          height: { xs: "70px", sm: "90px" },
          justifyContent: "center",
        },
      }}
    >
      <Box
        padding={{ xs: "0 4px", sm: "0 10px", md: "0 20px" }}
        display="flex"
        width="100%"
      >
        <Toolbar disableGutters sx={{ width: "100%" }}>
          <Box sx={{ display: { xs: "flex", md: "none" }, flexShrink: 0 }}>
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              data-navigation
              sx={{
                padding: { xs: "6px", sm: "12px" },
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: "18px", sm: "24px" } }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" }, gap: "5px" }}
            >
              {pages.map((page) => (
                <div key={page.label}>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      page.onClick();
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontSize: { xs: "12px", sm: "14px" },
                      }}
                    >
                      {page.label}
                    </Typography>
                  </MenuItem>
                </div>
              ))}
              <MenuItem
                onClick={handleCloseNavMenu}
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  padding: "16px",
                  minWidth: "200px",
                  maxWidth: "250px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "10px", lg: "11px" },
                    color: "tertiary.main",
                    fontWeight: 700,
                    fontStyle: "italic",
                    fontFamily: "var(--font-mulish), sans-serif",
                  }}
                >
                  v{APP_VERSION}-BETA
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={handleCloseNavMenu}
                sx={{
                  display: { xs: "flex", sm: "none" },
                  justifyContent: "center",
                }}
              >
                <LanguageSwitcher inMenu />
              </MenuItem>
            </Menu>
          </Box>
          <Box
            sx={{
              width: { xs: "100px", sm: "130px", md: "160px" },
              height: { xs: "auto", sm: "auto", md: "48px" },
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={giveetyLogo as string}
              alt="Giveety Logo"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          <Box
            sx={{
              flexGrow: { xs: 1, md: 0 },
              display: { xs: "block", md: "none" },
            }}
          />
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: "5px",
              flexShrink: 0,
            }}
          >
            {pages.map((page) => (
              <Button
                variant="appbar"
                key={page.label}
                type="button"
                onClick={() => {
                  handleCloseNavMenu();
                  if (page.onClick) page.onClick();
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} />
          <Box
            display="flex"
            alignItems="center"
            gap={{ xs: "4px", sm: "8px", md: "20px" }}
            sx={{
              flexShrink: 0,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              type="button"
              onClick={() => {}}
              sx={{
                padding: { xs: "6px 8px", sm: "6.5px 20px", md: "6.5px 40px" },
                fontSize: { xs: "10px", sm: "12px", md: "14px" },
                whiteSpace: "nowrap",
              }}
            >
              {capitalize(t("externalPages.memberSpace"))}
            </Button>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <LanguageSwitcher />
            </Box>
          </Box>
        </Toolbar>
      </Box>
    </MuiAppbar>
  );
}

export default Header;
