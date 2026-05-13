<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRequestsStore } from 'src/stores/requests';
import { useCatalogsStore } from 'src/stores/catalogs';
import HeroSection from 'src/components/HeroSection.vue';
import StatsCard from 'src/components/StatsCard.vue';

const { t } = useI18n();
const requestsStore = useRequestsStore();
const catalogsStore = useCatalogsStore();

// ─── Computed stats from real data ───
const totalRequests = computed(() => requestsStore.requests.length);

const inProgressCount = computed(() =>
  requestsStore.requests.filter((r) =>
    ['En desarrollo', 'En backlog', 'in_progress'].includes(r.status),
  ).length,
);

const completedCount = computed(() =>
  requestsStore.requests.filter((r) =>
    ['Entregado', 'Cerrado', 'completed'].includes(r.status),
  ).length,
);

const pendingCount = computed(() =>
  requestsStore.requests.filter((r) =>
    ['Nuevo', 'En revisión DX', 'En pruebas', 'pending', 'in_review'].includes(r.status),
  ).length,
);

const stats = computed(() => [
  { icon: 'assignment', label: 'totalRequests', value: totalRequests.value, color: '#6366f1' },
  { icon: 'autorenew', label: 'inProgress', value: inProgressCount.value, color: '#3b82f6' },
  { icon: 'check_circle', label: 'completed', value: completedCount.value, color: '#22c55e' },
  { icon: 'schedule', label: 'pending', value: pendingCount.value, color: '#f59e0b' },
]);

const steps = [
  { icon: 'edit_note', color: '#6366f1', titleKey: 'step1Title', descKey: 'step1Desc', num: '01' },
  { icon: 'analytics', color: '#8b5cf6', titleKey: 'step2Title', descKey: 'step2Desc', num: '02' },
  { icon: 'rocket_launch', color: '#06b6d4', titleKey: 'step3Title', descKey: 'step3Desc', num: '03' },
];

onMounted(() => {
  void catalogsStore.fetchCatalogs();
  void requestsStore.fetchRequests();
});
</script>

<template>
  <q-page>
    <!-- Hero -->
    <hero-section />

    <!-- Stats -->
    <section class="container-wide q-mb-xl">
      <div class="row q-gutter-md">
        <div v-for="stat in stats" :key="stat.label" class="col-12 col-sm-6 col-md">
          <stats-card :icon="stat.icon" :label="t(stat.label)" :value="stat.value" :color="stat.color" />
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="container-wide q-mb-xl">
      <div class="text-center q-mb-xl">
        <h2 class="section-title">{{ t('howItWorks') }}</h2>
        <p class="section-subtitle">{{ t('howItWorksSubtitle') }}</p>
      </div>
      <div class="row q-gutter-md justify-center">
        <div v-for="step in steps" :key="step.num" class="col-12 col-sm-6 col-md-3">
          <q-card flat class="glass-card q-pa-lg text-center hover-lift" style="height: 100%;">
            <div class="step-num" :style="{ color: step.color }">{{ step.num }}</div>
            <div class="q-my-md">
              <q-icon :name="step.icon" size="42px" :style="{ color: step.color }" />
            </div>
            <div class="text-weight-bold q-mb-sm" style="font-size: 1.05rem;">{{ t(step.titleKey) }}</div>
            <div style="opacity: 0.6; font-size: 0.88rem; line-height: 1.6;">{{ t(step.descKey) }}</div>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Bottom spacer -->
    <div style="height: 40px;"></div>
  </q-page>
</template>

<style lang="scss" scoped>
.step-num {
  font-size: 2.5rem;
  font-weight: 800;
  opacity: 0.15;
  line-height: 1;
}
</style>
