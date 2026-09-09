import type { Metadata } from 'next';
import { Roboto, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { TenantLayout } from '@/components/layout/TenantLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LumiPhotos Store',
  description: 'LumiPhotos Store - Access Photo Galleries & Order Prints',
};

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
        <TenantLayout>
          <Navbar />
          {children}
        </TenantLayout>
      </body>
    </html>
  );
}
