import { cache } from "react";
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
