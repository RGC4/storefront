// src/components/layouts/customer-dashboard/navigation.tsx
"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import NavItem from "./nav-item";
import { MainContainer } from "./styles";

const MENUS = [
  {
    title: "DASHBOARD",
    list: [
      { icon: "Packages", href: "/orders", title: "Orders" },
      { icon: "Headset", href: "/support-tickets", title: "Support Tickets" },
    ],
  },
  {
    title: "ACCOUNT SETTINGS",
    list: [
      { icon: "User3", href: "/profile", title: "Profile Info" },
      { icon: "Location", href: "/address", title: "Addresses" },
    ],
  },
];

export function Navigation() {
  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <MainContainer>
      {MENUS.map((item) => (
        <Box mt={2} key={item.title}>
          <Typography
            fontSize={12}
            variant="body1"
            fontWeight={500}
            color="text.secondary"
            textTransform="uppercase"
            sx={{ padding: ".75rem 1.75rem" }}
          >
            {item.title}
          </Typography>

          {item.list.map((listItem) => (
            <NavItem item={listItem} key={listItem.title} />
          ))}
        </Box>
      ))}

      <Box px={4} mt={6} pb={2}>
        <Button
          disableElevation
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </MainContainer>
  );
}
