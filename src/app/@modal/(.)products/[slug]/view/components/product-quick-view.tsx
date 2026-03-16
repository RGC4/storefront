import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
<<<<<<< HEAD
import ButtonGroup from "./button-group";
import ImageCarousel from "./image-carousel";
import QuickViewModal from "./quick-view-modal";
import { currency } from "lib";
import Product from "models/Product.model";

type Props = { product: Product };
=======

import ButtonGroup from "./button-group";
import ImageCarousel from "./image-carousel";
import QuickViewModal from "./quick-view-modal";

import { currency } from "lib";

import Product from "models/Product.model";

// =====================================================
type Props = { product: Product };
// =====================================================
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b

export default function ProductQuickView({ product }: Props) {
  return (
    <QuickViewModal>
      <Box position="relative" bgcolor="grey.100">
        <ImageCarousel images={product.images!} title={product.title} />
      </Box>

      <Box py={3} px={4}>
        <Typography variant="body1" fontSize={22} fontWeight={600} sx={{ mb: 1 }}>
          {product.title}
        </Typography>

        <Typography variant="body1" fontSize={22} fontWeight={600}>
          {currency(product.price)}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={3} mt={2}>
          <Rating size="small" color="warn" value={4} readOnly />
<<<<<<< HEAD
          <Typography variant="body1" fontSize={16} lineHeight="1" color="text.secondary">
=======
          <Typography variant="body1" lineHeight="1" color="text.secondary">
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
            (50)
          </Typography>
        </Box>

<<<<<<< HEAD
        <Typography variant="body1" fontSize={16} color="text.secondary" sx={{ mb: 4 }}>
          {product?.description || ""}
=======
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {product?.description ||
            "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus liberpuro ate vol faucibus adipiscing."}
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
        </Typography>

        <ButtonGroup product={product} />
      </Box>
    </QuickViewModal>
  );
}
