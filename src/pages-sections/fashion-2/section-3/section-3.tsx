import api from "utils/__api__/fashion-2";
import Section3Client from "./section-3-client";

export default async function Section3() {
  const categories = await api.getCategories();
  if (!categories || !categories.length) return null;
  return <Section3Client categories={categories as any} />;
}
