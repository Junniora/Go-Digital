import { useQuasar } from 'quasar';

export function useNotify() {
  const $q = useQuasar();

  const success = (message: string) => {
    $q.notify({
      type: 'positive',
      message,
      icon: 'check_circle',
      position: 'top',
      timeout: 3000,
      progress: true,
    });
  };

  const error = (message: string) => {
    $q.notify({
      type: 'negative',
      message,
      icon: 'error',
      position: 'top',
      timeout: 4000,
      progress: true,
    });
  };

  const warning = (message: string) => {
    $q.notify({
      type: 'warning',
      message,
      icon: 'warning',
      position: 'top',
      timeout: 3500,
      progress: true,
    });
  };

  const info = (message: string) => {
    $q.notify({
      type: 'info',
      message,
      icon: 'info',
      position: 'top',
      timeout: 3000,
      progress: true,
    });
  };

  return { success, error, warning, info };
}
