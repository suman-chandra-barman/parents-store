import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Toaster position="top-right" richColors closeButton />
      <Navbar />
      {children}
    </NextIntlClientProvider>
  );
}
