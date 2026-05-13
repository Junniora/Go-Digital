import { defineBoot } from '#q-app/wrappers';
import axios from 'axios';
import { Notify } from 'quasar';

export default defineBoot(({ router }) => {
  // Global response error handler with Quasar Notify
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      if (status === 401) {
        Notify.create({
          type: 'negative',
          message: 'Session expired. Please log in again.',
          icon: 'lock',
          position: 'top',
          timeout: 3000,
        });
        void router.push('/login');
      } else if (status === 403) {
        Notify.create({
          type: 'warning',
          message: 'You do not have permission to perform this action.',
          icon: 'warning',
          position: 'top',
          timeout: 3000,
        });
      } else if (status === 500) {
        Notify.create({
          type: 'negative',
          message: 'Server error. Please try again later.',
          icon: 'error',
          position: 'top',
          timeout: 4000,
        });
      } else if (!error.response) {
        Notify.create({
          type: 'negative',
          message: 'Network error. Check your connection.',
          icon: 'wifi_off',
          position: 'top',
          timeout: 4000,
        });
      } else {
        Notify.create({
          type: 'negative',
          message: message || 'An unexpected error occurred.',
          icon: 'error_outline',
          position: 'top',
          timeout: 3000,
        });
      }

      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    },
  );
});
