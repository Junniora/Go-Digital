<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useTheme } from 'src/composables/useTheme';
import { useLanguage } from 'src/composables/useLanguage';
import { useQuasar } from 'quasar';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const { initTheme } = useTheme();
const { initLanguage } = useLanguage();
const $q = useQuasar();

const isDark = computed(() => $q.dark.isActive);
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);

const emailError = computed(() => {
  if (!email.value) return '';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.value) ? '' : t('invalidEmail');
});

async function handleLogin() {
  if (!email.value || !password.value) return;
  loading.value = true;
  const success = await authStore.login({ email: email.value, password: password.value });
  loading.value = false;
  if (success) {
    void router.push('/');
  }
}

onMounted(() => {
  initTheme();
  initLanguage();
});
</script>

<template>
  <q-page class="flex flex-center" style="min-height: 100vh;">
    <div class="login-wrapper">
      <!-- Brand -->
      <div class="text-center q-mb-xl">
        <q-icon name="rocket_launch" size="48px" color="primary" class="q-mb-sm" />
        <h1 class="gradient-text q-mb-none" style="font-size: 2rem; font-weight: 800; letter-spacing: -0.03em;">
          Go Digital
        </h1>
      </div>

      <!-- Login Card -->
      <q-card class="login-card glass-card-static q-pa-xl" flat>
        <div class="text-center q-mb-lg">
          <h2 class="q-mb-xs" style="font-size: 1.5rem; font-weight: 700; margin: 0;">{{ t('loginTitle') }}</h2>
          <p style="opacity: 0.6; font-size: 0.9rem; margin: 0;">{{ t('loginSubtitle') }}</p>
        </div>

        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input v-model="email" :label="t('email')" type="email" outlined
            :rules="[(v: string) => !!v || t('emailRequired')]"
            :error="!!emailError" :error-message="emailError"
            lazy-rules
          >
            <template v-slot:prepend><q-icon name="mail" /></template>
          </q-input>

          <q-input v-model="password" :label="t('password')"
            :type="showPassword ? 'text' : 'password'" outlined
            :rules="[(v: string) => !!v || t('passwordRequired')]"
            lazy-rules
          >
            <template v-slot:prepend><q-icon name="lock" /></template>
            <template v-slot:append>
              <q-icon :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer" @click="showPassword = !showPassword" />
            </template>
          </q-input>

          <!-- Error message -->
          <q-banner v-if="authStore.error" dense class="q-mb-sm" rounded
            style="background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2);">
            <template v-slot:avatar><q-icon name="error" color="negative" /></template>
            {{ authStore.error }}
          </q-banner>

          <q-btn type="submit" :loading="loading" no-caps unelevated class="full-width btn-gradient"
            size="lg" :label="t('loginButton')"
            :disable="!email || !password || !!emailError"
            style="border-radius: 12px; margin-top: 8px;" />
        </q-form>
      </q-card>

      <!-- Dark mode toggle -->
      <div class="text-center q-mt-lg">
        <q-btn flat round :icon="isDark ? 'light_mode' : 'dark_mode'"
          @click="$q.dark.toggle()" size="sm" style="opacity: 0.5;" />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.login-wrapper { width: 100%; max-width: 420px; padding: 16px; }
.login-card { border-radius: 20px !important; }
</style>
