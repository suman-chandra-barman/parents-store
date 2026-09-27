import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import enMessages from "../messages/en.json";
import deMessages from "../messages/de.json";

const routing = {
  locales: ["en", "de"] as const,
  defaultLocale: "en",
};

const messagesMap = {
  en: enMessages,
  de: deMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    notFound();
  }

  return {
    locale,
    messages:
      messagesMap[locale as keyof typeof messagesMap] || messagesMap.en,
  };
});
