import { AppProviders } from '@/providers/AppProviders';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Extranjería Grupo Ramirez Ventura',
  description: 'by    t r a s c e n d i e n d o',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} relative`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
