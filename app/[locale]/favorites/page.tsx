import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FavoritesContent } from "@/features/favorites/components/FavoritesContent";

interface FavoritesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: FavoritesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Favorites" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function FavoritesPage() {
  return <FavoritesContent />;
}
