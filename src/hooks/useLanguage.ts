import { useCallback } from 'react';
import { useAppStore } from './useStore';
import { translations, formatCurrency, formatDate, formatDateTime, formatRelativeTime } from '@/lib/i18n';
import { Language } from '@/types';

type TranslationKey = keyof typeof translations.es;

export function useLanguage() {
  const { language, setLanguage, currentTenant } = useAppStore();

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[language][key] || key;
    },
    [language]
  );

  const currency = useCallback(
    (amount: number): string => {
      return formatCurrency(amount, currentTenant?.currency || 'COP');
    },
    [currentTenant?.currency]
  );

  const date = useCallback(
    (dateValue: Date): string => {
      return formatDate(dateValue, language);
    },
    [language]
  );

  const dateTime = useCallback(
    (dateValue: Date): string => {
      return formatDateTime(dateValue, language);
    },
    [language]
  );

  const relativeTime = useCallback(
    (dateValue: Date): string => {
      return formatRelativeTime(dateValue, language);
    },
    [language]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'es' ? 'en' : 'es');
  }, [language, setLanguage]);

  const changeLanguage = useCallback(
    (newLanguage: Language) => {
      setLanguage(newLanguage);
    },
    [setLanguage]
  );

  return {
    language,
    t,
    currency,
    date,
    dateTime,
    relativeTime,
    toggleLanguage,
    changeLanguage,
  };
}
