import { I18nProvider } from '@/i18n/i18n';
import { Inter } from 'next/font/google';

import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function CalcLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} relative`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
