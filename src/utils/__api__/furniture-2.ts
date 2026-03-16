<<<<<<< HEAD
import { cache } from "react";
=======
﻿import { cache } from "react";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import axios from "axios";

const getNewArrivalProducts = cache(async () => {
  const response = await axios.get("/api/furniture-2/new-arrivals");
  return response.data;
});

const getTrendingProducts = cache(async () => {
  const response = await axios.get("/api/furniture-2/trending");
  return response.data;
});

const getTestimonial = cache(async () => {
  const response = await axios.get("/api/furniture-2/testimonial");
  return response.data;
});

const getServices = cache(async () => {
  const response = await axios.get("/api/furniture-2/services");
  return response.data;
});

export default { getNewArrivalProducts, getTrendingProducts, getTestimonial, getServices };
