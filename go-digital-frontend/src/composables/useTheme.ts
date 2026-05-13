import { useQuasar } from 'quasar';

export function useTheme() {
  const $q = useQuasar();

  const toggleDark = () => {
    $q.dark.set(!$q.dark.isActive);
    localStorage.setItem('dark', JSON.stringify($q.dark.isActive));
  };

  const initTheme = () => {
    const saved = localStorage.getItem('dark');
    if (saved) {
      $q.dark.set(JSON.parse(saved));
    }
  };

  return { toggleDark, initTheme };
}
