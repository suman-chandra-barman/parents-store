import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { CartProvider } from "@/features/cart/context/CartContext";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CartProvider>
        <Toaster position="top-right" richColors closeButton />
        <Navbar />
        {children}
      </CartProvider>
    </NextIntlClientProvider>
  );
}

