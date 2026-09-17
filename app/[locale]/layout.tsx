import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { CartProvider } from "@/features/cart/context/CartContext";
import { TenantProvider } from "@/providers/TenantProvider";
import StoreProvider from "@/providers/StoreProvider";
import { fetchTenant } from "@/stores/useTenantStore";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const tenant = await fetchTenant(host);

  return (
    <NextIntlClientProvider messages={messages}>
      <StoreProvider>
        <TenantProvider initialTenant={tenant}>
          <CartProvider>
            <Toaster position="top-center" richColors closeButton />
            <Navbar />
            {children}
          </CartProvider>
        </TenantProvider>
      </StoreProvider>
    </NextIntlClientProvider>
  );
}
