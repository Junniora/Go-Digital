<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  icon: string;
  label: string;
  value: number;
  color?: string;
  gradient?: string;
}>();

const displayValue = ref(0);

function animateCounter(target: number) {
  const duration = 1200;
  const startTime = Date.now();
  const startValue = displayValue.value;

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    displayValue.value = Math.round(startValue + (target - startValue) * eased);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

onMounted(() => {
  animateCounter(props.value);
});

watch(() => props.value, (newVal) => {
  animateCounter(newVal);
});
</script>

<template>
  <div class="stats-card glass-card hover-lift q-pa-lg">
    <div class="row items-center justify-between q-mb-md">
      <div
        class="stats-icon-wrapper"
        :style="{
          background: gradient || `linear-gradient(135deg, ${color || '#6366f1'}33, ${color || '#6366f1'}11)`,
        }"
      >
        <q-icon
          :name="icon"
          size="28px"
          :style="{ color: color || '#6366f1' }"
        />
      </div>
    </div>

    <div class="stats-value count-animated" style="font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1;">
      {{ displayValue.toLocaleString() }}
    </div>

    <div class="stats-label q-mt-xs" style="font-size: 0.85rem; opacity: 0.6; font-weight: 500;">
      {{ label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stats-card {
  min-width: 180px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.03;
    transform: translate(20px, -20px);
  }
}

.stats-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
