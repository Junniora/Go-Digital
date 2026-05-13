<script setup lang="ts">
defineProps<{
  type?: 'card' | 'table' | 'text';
  count?: number;
}>();
</script>

<template>
  <!-- Card skeleton -->
  <div v-if="type === 'card'" class="row q-gutter-md">
    <div v-for="i in (count || 4)" :key="i" class="col-12 col-sm-6 col-md-3">
      <q-card flat class="glass-card-static q-pa-lg">
        <q-skeleton type="rect" height="40px" width="40px" class="q-mb-md" style="border-radius: 12px;" />
        <q-skeleton type="text" width="60%" class="q-mb-xs" />
        <q-skeleton type="text" width="40%" />
      </q-card>
    </div>
  </div>

  <!-- Table skeleton -->
  <div v-else-if="type === 'table'">
    <div v-for="i in (count || 5)" :key="i" class="row q-py-sm q-px-md items-center q-gutter-sm" style="border-bottom: 1px solid rgba(0,0,0,0.05);">
      <q-skeleton type="text" width="5%" />
      <q-skeleton type="text" width="25%" />
      <q-skeleton type="text" width="15%" />
      <q-skeleton type="text" width="12%" />
      <q-skeleton type="QBadge" width="10%" />
      <q-skeleton type="QBadge" width="10%" />
    </div>
  </div>

  <!-- Text skeleton -->
  <div v-else>
    <q-skeleton v-for="i in (count || 3)" :key="i" type="text" class="q-mb-sm" :width="i % 2 === 0 ? '80%' : '100%'" />
  </div>
</template>
