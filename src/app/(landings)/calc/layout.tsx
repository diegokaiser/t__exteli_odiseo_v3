import { I18nProvider } from '@/i18n/i18n';

export default function CalcLayout({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
