<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
</script>

<template>
  <q-page class="flex flex-center" style="min-height: 100vh;">
    <div class="text-center q-pa-lg" style="max-width: 480px;">
      <!-- Animated 404 -->
      <div class="error-number gradient-text q-mb-md">404</div>

      <h1 style="font-size: 1.5rem; font-weight: 700; margin: 0 0 8px;">
        {{ t('notFound') }}
      </h1>

      <p style="opacity: 0.6; font-size: 0.95rem; line-height: 1.6; margin-bottom: 32px;">
        {{ t('notFoundDesc') }}
      </p>

      <q-btn
        unelevated
        no-caps
        class="btn-gradient"
        icon="home"
        :label="t('goHome')"
        @click="router.push('/')"
        style="border-radius: 12px; padding: 10px 28px;"
      />
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.error-number {
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.05em;
  animation: float404 3s ease-in-out infinite;
}

@keyframes float404 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
</style>
