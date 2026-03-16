<<<<<<< HEAD
"use client";

import { useState } from "react";
=======
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import type { PropsWithChildren } from "react";
// MUI
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
<<<<<<< HEAD
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
// LOCAL CUSTOM COMPONENTS
import { Navigation } from "./navigation";

export function CustomerDashboardLayout({ children }: PropsWithChildren) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box bgcolor="grey.50" py={{ xs: 3, sm: 4 }}>
      <Container>
        {/* Mobile: "My Account" header with hamburger to open nav drawer */}
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            alignItems: "center",
            mb: 2,
            gap: 1
          }}
        >
          <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open account menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            My Account
          </Typography>
        </Box>

        {/* Mobile nav drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": { width: 280, pt: 2 }
          }}
        >
          <Box onClick={() => setDrawerOpen(false)}>
            <Navigation />
          </Box>
        </Drawer>

        <Grid container spacing={3}>
          {/* Desktop sidebar — hidden on mobile */}
          <Grid
            size={{ lg: 3, xs: 12 }}
            sx={{ display: { xs: "none", lg: "block" } }}
          >
            <Navigation />
          </Grid>

          {/* Main content — full width on mobile */}
=======
// LOCAL CUSTOM COMPONENTS
import { Navigation } from "./navigation";

const gridStyle = {
  display: {
    xs: "none",
    lg: "block"
  }
};

export function CustomerDashboardLayout({ children }: PropsWithChildren) {
  return (
    <Box bgcolor="grey.50" py={{ xs: 3, sm: 4 }}>
      <Container>
        <Grid container spacing={3}>
          <Grid size={{ lg: 3, xs: 12 }} sx={gridStyle}>
            <Navigation />
          </Grid>

>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
          <Grid size={{ lg: 9, xs: 12 }}>{children}</Grid>
        </Grid>
      </Container>
    </Box>
  );
}
