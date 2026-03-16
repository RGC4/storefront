import Link from "next/link";
import Button from "@mui/material/Button";

interface Props {
  title: string;
  imgUrl: string;
  buttonLink: string;
  buttonText: string;
  description: string;
  buttonColor?: "dark" | "primary";
}

export default function CarouselCard1({
  title,
  imgUrl,
  buttonText,
  buttonLink,
  description,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "700px",
        maxHeight: "700px",
        minHeight: "300px",
        position: "relative",
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        paddingLeft: "clamp(24px, 5vw, 80px)",
      }}
    >
<<<<<<< HEAD
=======
      {/* Subtle left gradient for text readability */}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, color: "white", maxWidth: "clamp(280px, 35vw, 500px)" }}>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 900,
            lineHeight: 1.15,
            marginTop: 0,
            marginBottom: "1rem",
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "clamp(13px, 1.4vw, 18px)",
            marginBottom: "2rem",
            opacity: 0.95,
            lineHeight: 1.6,
            textShadow: "0 1px 6px rgba(0,0,0,0.7)",
          }}
        >
          {description}
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href={buttonLink}>
            <Button
              size="large"
              variant="outlined"
              disableElevation
              style={{
                height: 44,
                borderRadius: 0,
                fontWeight: 700,
                color: "white",
                borderColor: "white",
                paddingInline: "24px",
                fontSize: "clamp(11px, 1vw, 14px)",
              }}
            >
              {buttonText}
            </Button>
          </Link>
<<<<<<< HEAD
          <Link href={buttonLink}>
=======
          <Link href="/collections">
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
            <Button
              size="large"
              variant="text"
              disableElevation
              style={{
                height: 44,
                borderRadius: 0,
                fontWeight: 700,
                color: "white",
                paddingInline: "24px",
                fontSize: "clamp(11px, 1vw, 14px)",
              }}
            >
              Explore
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
