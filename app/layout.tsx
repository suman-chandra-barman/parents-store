import type { Metadata } from 'next';
import { Roboto, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { TenantProvider } from '@/providers/TenantProvider';
import { fetchTenant } from '@/stores/useTenantStore';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host');

  if (!host) {
    return {
      title: 'Invalid request',
    };
  }

  const tenant = await fetchTenant(host);

  const title = tenant?.name ? `${tenant.name} | LumiPhoto` : 'LumiPhoto';

  const description = tenant?.name
    ? `${tenant.name} - Access Photo Galleries & Order Prints`
    : 'Access Photo Galleries & Order Prints';

  return {
    title,
    description,

    icons: tenant?.logo?.url
      ? {
          icon: tenant.logo.url,
        }
      : undefined,

    openGraph: {
      title,
      description,
      images: tenant?.logo?.url
        ? [
            {
              url: tenant.logo.url,
              width: tenant.logo.width,
              height: tenant.logo.height,
              alt: `${tenant.name} logo`,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: tenant?.logo?.url ? [tenant.logo.url] : undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        roboto.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Toaster position="top-right" richColors closeButton />
        <TenantProvider>
          <Navbar />
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
