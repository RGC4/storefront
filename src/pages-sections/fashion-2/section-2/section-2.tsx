<<<<<<< HEAD
=======
import Container from "@mui/material/Container";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
// GLOBAL CUSTOM COMPONENT
import ServiceCard3 from "components/service-cards/service-card-3";
// STYLED COMPONENTS
import { RootStyle } from "./styles";
// API FUNCTIONS
import api from "utils/__api__/fashion-2";

export default async function Section2() {
  const services = await api.getServices();
  if (!services || !services.length) return null;

  return (
<<<<<<< HEAD
    <>
=======
    <Container className="mt-2">
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
      <RootStyle>
        {services.map(({ id, icon, title, description }) => (
          <ServiceCard3 key={id} icon={icon} title={title} description={description!} />
        ))}
      </RootStyle>
<<<<<<< HEAD
    </>
=======
    </Container>
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  );
}
