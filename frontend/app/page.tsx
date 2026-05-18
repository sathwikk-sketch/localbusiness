import { HomePage } from "@/components/storefront/home-page";
import { api } from "@/lib/api";

export default async function Page() {
  const data = await api.storefront();
  return <HomePage data={data} />;
}

