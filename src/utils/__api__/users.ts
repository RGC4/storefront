<<<<<<< HEAD
import { cache } from "react";
=======
﻿import { cache } from "react";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import User from "models/User.model";

const INFO_LIST = [
  { title: "16", subtitle: "All Orders" },
  { title: "02", subtitle: "Awaiting Payments" },
  { title: "00", subtitle: "Awaiting Shipment" },
  { title: "01", subtitle: "Awaiting Delivery" }
];

export const getUser = cache(async (): Promise<User> => {
  return {
    id: "",
    email: "",
    phone: "",
    avatar: "",
    password: "",
    dateOfBirth: "2000-01-01",
    verified: false,
    name: { firstName: "Guest", lastName: "User" }
  };
});

export const getUserAnalytics = cache(async (id: string) => {
  return { balance: 0, type: "GUEST", orderSummary: INFO_LIST };
});

export default { getUser, getUserAnalytics };
