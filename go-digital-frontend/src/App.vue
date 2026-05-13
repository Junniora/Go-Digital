<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from './composables/useTheme';
import { useLanguage } from './composables/useLanguage';

const { initTheme } = useTheme();
const { initLanguage } = useLanguage();

onMounted(() => {
  initTheme();
  initLanguage();
});
</script>

<template>
  <router-view></router-view>
</template>
