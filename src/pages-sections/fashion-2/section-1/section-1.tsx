<<<<<<< HEAD
import VideoHero from "./hero-carousel";

export default function Section1() {
  return <VideoHero />;
}
=======
import Box from "@mui/material/Box";
import HeroCarousel from "./hero-carousel";
import CarouselCard1 from "components/carousel-cards/carousel-card-1";
import api from "utils/__api__/fashion-2";

export default async function Section1() {
  const carouselData = await api.getMainCarouselData();
  if (!carouselData || !carouselData.length) return null;

  return (
    <Box mb={7.5}>
      <HeroCarousel>
        {carouselData.map((item, ind) => (
          <CarouselCard1
            key={ind}
            buttonColor="dark"
            title={item.title!}
            imgUrl={item.imgUrl!}
            buttonLink={item.buttonLink!}
            buttonText={item.buttonText!}
            description={item.description!}
          />
        ))}
      </HeroCarousel>
    </Box>
  );
}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
