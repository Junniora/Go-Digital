<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const $q = useQuasar();
const isDark = computed(() => $q.dark.isActive);
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <!-- Animated gradient background -->
      <div class="auth-background" :class="{ 'auth-bg-dark': isDark }">
        <div class="auth-orb auth-orb-1"></div>
        <div class="auth-orb auth-orb-2"></div>
        <div class="auth-orb auth-orb-3"></div>
      </div>
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.auth-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecf9 50%, #dbeafe 100%);
  overflow: hidden;
}

.auth-bg-dark {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
}

.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.auth-orb-1 {
  width: 500px;
  height: 500px;
  background: #6366f1;
  top: -150px;
  right: -100px;
  animation: floatAuth 18s ease-in-out infinite;
}

.auth-orb-2 {
  width: 400px;
  height: 400px;
  background: #8b5cf6;
  bottom: -100px;
  left: -100px;
  animation: floatAuth 22s ease-in-out infinite reverse;
}

.auth-orb-3 {
  width: 300px;
  height: 300px;
  background: #06b6d4;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: floatAuth 20s ease-in-out infinite 2s;
}

@keyframes floatAuth {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -50px) scale(1.05); }
  50% { transform: translate(-20px, 30px) scale(0.95); }
  75% { transform: translate(50px, 20px) scale(1.08); }
}

.auth-bg-dark .auth-orb {
  opacity: 0.2;
}
</style>
