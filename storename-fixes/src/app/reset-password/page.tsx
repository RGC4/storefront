import type { Metadata } from "next";
import ResetPasswordPageView from "pages-sections/sessions/page-view";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Prestige Apparel Group";

export const metadata: Metadata = {
  title: `Reset Password — ${storeName}`,
  description: `Reset your account password at ${storeName}.`,
  authors: [{ name: storeName }],
};

export default function ResetPassword() {
  return <ResetPasswordPageView />;
}
