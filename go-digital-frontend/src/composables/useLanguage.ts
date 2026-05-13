import { useI18n } from 'vue-i18n';

export function useLanguage() {
  const { locale } = useI18n();

  const setLanguage = (lang: string) => {
    locale.value = lang;
    localStorage.setItem('lang', lang);
  };

  const initLanguage = () => {
    const saved = localStorage.getItem('lang');
    if (saved) {
      locale.value = saved;
    } else {
      locale.value = 'en-US';
    }
  };
  return { setLanguage, initLanguage, locale };
}
