// src/utils/__api__/users.ts
import { cache } from "react";
import { cookies } from "next/headers";
import User from "models/User.model";

export const getUser = cache(async (): Promise<User> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("shopify_session");

    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value);
      const customer = session.customer;

      if (customer) {
        const nameParts = (customer.name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        return {
          id: customer.id || "",
          email: customer.email || "",
          phone: "",
          avatar: customer.image || "/assets/images/avatars/001-man.svg",
          password: "",
          dateOfBirth: "",
          verified: true,
          name: { firstName, lastName },
        };
      }
    }
  } catch (err) {
    console.error("[users] Error reading session:", err);
  }

  return {
    id: "",
    email: "",
    phone: "",
    avatar: "/assets/images/avatars/001-man.svg",
    password: "",
    dateOfBirth: "",
    verified: false,
    name: { firstName: "Guest", lastName: "User" },
  };
});

export const getUserAnalytics = cache(async (_id: string) => {
  // TODO: Fetch real order counts from Shopify when needed
  return {
    balance: 0,
    type: "CUSTOMER",
    orderSummary: [
      { title: "0", subtitle: "All Orders" },
      { title: "0", subtitle: "Awaiting Payments" },
      { title: "0", subtitle: "Awaiting Shipment" },
      { title: "0", subtitle: "Awaiting Delivery" },
    ],
  };
});

export default { getUser, getUserAnalytics };
