// src/app/not-found.tsx

import type { Metadata } from "next";
import { NotFoundPageView } from "pages-sections/not-found";

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

export const metadata: Metadata = {
  title: `Page Not Found — ${STORE_NAME}`,
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return <NotFoundPageView />;
}
