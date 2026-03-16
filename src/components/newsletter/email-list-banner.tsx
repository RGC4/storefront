"use client";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// ======================================================
type Props = { image?: string };
  image = "/assets/images/newsletter/banner-bg.jpg",
}: Props) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 422,
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        pb: "60px",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <Image
        fill
        src={image}
        alt="Email list banner"
        style={{ objectFit: "cover", objectPosition: "center" }}
        priority
      />

      {/* DARK GRADIENT OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(5,15,25,0.72) 0%, rgba(5,15,25,0.35) 55%, rgba(5,15,25,0.1) 100%)",
        }}
      />

      {/* TEXT + BUTTON */}
      <Box sx={{ position: "relative", textAlign: "center", px: 4 }}>
        <Typography
          variant="h1"
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: 38,
            letterSpacing: "-0.5px",
            mb: 1.5,
          }}
        >
          Join our Email List
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 22,
            fontWeight: 400,
            mb: 3,
          }}
        >
          Share your email for newsletters and updates
        </Typography>

        <Button
          variant="contained"
          href="#"
          sx={{
            bgcolor: "#1a2f4a",
            color: "white",
            fontSize: 14,
            fontWeight: 500,
            px: 3.5,
            py: 1.5,
            borderRadius: 1.5,
            "&:hover": { bgcolor: "#243f62" },
          }}
        >
          Join Our Email
        </Button>
      </Box>
    </Box>
  );
}
