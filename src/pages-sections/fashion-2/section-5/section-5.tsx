import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
// LOCAL CUSTOM COMPONENT
import BannerCard1 from "./banner-card-1";
import BannerCard2 from "./banner-card-2";

export default function Section5() {
  return (
    <Container className="mt-4">
      <Grid container spacing={3}>
        {/* FOR MEN'S BANNER CARD */}
        <Grid size={{ md: 4, xs: 12 }}>
          <BannerCard2
            url="#"
            title="For Men's"
            contentPosition="left"
            subTitle="Starting At $29"
            img="/assets/images/banners/hero1.png"
          />
        </Grid>

        {/* SALES BANNER CARD */}
        <Grid size={{ md: 4, xs: 12 }}>
          <BannerCard1
            url="#"
            text3="Sale"
            text2="Black Friday"
            text1="Up to 20% Off"
            img="/assets/images/banners/hero2.png"
          />
        </Grid>

        {/* FOR WOMEN'S BANNER CARD */}
        <Grid size={{ md: 4, xs: 12 }}>
          <BannerCard2
            url="#"
            subTitle="25% Off"
            title="For Women's"
            contentPosition="right"
            img="/assets/images/banners/hero3.png"
          />
        </Grid>
      </Grid>
    </Container>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
