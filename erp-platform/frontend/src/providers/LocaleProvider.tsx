import { useEffect, useMemo } from 'react';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import trTR from 'antd/locale/tr_TR';
import deDE from 'antd/locale/de_DE';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useUIStore } from '@/store/uiStore';

const antdLocales: Record<string, typeof enUS> = {
  en: enUS,
  tr: trTR,
  de: deDE,
};

void i18n.use(initReactI18next).init({
  resources: {},
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'translation',
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useUIStore();

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const resources = await import(`../../public/locales/${language}/translation.json`);
        i18n.addResourceBundle(language, 'translation', resources, true, true);
        await i18n.changeLanguage(language);
      } catch {
        const fallback = await import(`../../public/locales/en/translation.json`);
        i18n.addResourceBundle('en', 'translation', fallback, true, true);
        await i18n.changeLanguage('en');
      }
    };
    loadLocale();
  }, [language]);

  const antdLocale = useMemo(() => antdLocales[language] || enUS, [language]);

  return (
    <ConfigProvider locale={antdLocale}>
      {children}
    </ConfigProvider>
  );
}
