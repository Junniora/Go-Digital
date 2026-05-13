<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
</script>

<template>
  <section class="hero-section">
    <div class="hero-content container-wide">
      <div class="row items-center" style="min-height: 420px;">
        <div class="col-12 col-md-7">
          <div class="hero-badge q-mb-lg">
            <q-icon name="auto_awesome" size="16px" color="primary" class="q-mr-xs" />
            <span>Go Digital Platform</span>
          </div>
          <h1 class="hero-title q-mb-sm">
            {{ t('heroTitle') }}<br />
            <span class="gradient-text">{{ t('heroTitleAccent') }}</span>
          </h1>
          <p class="hero-subtitle q-mb-xl" style="max-width: 520px;">
            {{ t('heroSubtitle') }}
          </p>
          <div class="row q-gutter-md">
            <q-btn unelevated no-caps size="lg" class="btn-gradient" icon="add_circle_outline"
              :label="t('getStarted')" @click="router.push('/requests/new')"
              style="border-radius: 14px; padding: 10px 28px;" />
            <q-btn outline no-caps size="lg" color="primary" icon="list_alt"
              :label="t('viewRequests')" @click="router.push('/requests')"
              style="border-radius: 14px; padding: 10px 28px;" />
          </div>
        </div>
        <div class="col-12 col-md-5 gt-sm">
          <div class="hero-illustration">
            <div class="hero-float-card glass-card q-pa-md">
              <q-icon name="description" size="32px" color="primary" />
              <div class="q-mt-sm text-weight-bold">12</div>
              <div class="text-caption" style="opacity: 0.6;">Active Requests</div>
            </div>
            <div class="hero-float-card glass-card q-pa-md" style="left: 60%; top: 20%; animation-delay: 2s;">
              <q-icon name="trending_up" size="32px" color="positive" />
              <div class="q-mt-sm text-weight-bold">89%</div>
              <div class="text-caption" style="opacity: 0.6;">Completion Rate</div>
            </div>
            <div class="hero-float-card glass-card q-pa-md" style="left: 25%; top: 65%; animation-delay: 4s;">
              <q-icon name="speed" size="32px" color="accent" />
              <div class="q-mt-sm text-weight-bold">3.2d</div>
              <div class="text-caption" style="opacity: 0.6;">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero-section { padding: 40px 0 60px; }
.hero-badge {
  display: inline-flex; align-items: center;
  background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15);
  border-radius: 24px; padding: 6px 16px; font-size: 0.8rem; font-weight: 600; color: #6366f1;
}
.hero-title { font-size: 3.2rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; margin: 0; }
.hero-subtitle { font-size: 1.1rem; line-height: 1.7; opacity: 0.65; }
.hero-illustration { position: relative; width: 100%; height: 350px; }
.hero-float-card {
  position: absolute; min-width: 140px; text-align: center;
  animation: heroFloat 6s ease-in-out infinite;
}
@keyframes heroFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@media (max-width: 768px) { .hero-title { font-size: 2.2rem; } .hero-section { padding: 24px 0 40px; } }
</style>
