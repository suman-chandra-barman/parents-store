import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const routing = {
  locales: ['en','de'],
  defaultLocale: 'en'
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  
  if (!locale || !routing.locales.includes(locale as string)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
