<<<<<<< HEAD
import { Metadata } from "next";
=======
﻿import { Metadata } from "next";
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
import { ProfilePageView } from "pages-sections/customer-dashboard/profile/page-view";
import api from "utils/__api__/users";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Profile - Prestige Apparel Group", description: "Manage your profile." };
}

export default async function Profile() {
  const user = await api.getUser();
  return <ProfilePageView user={user} />;
}
