<script setup lang="ts">
import { useCatalogsStore } from 'src/stores/catalogs';

const props = defineProps<{
  status: string;
}>();

const catalogsStore = useCatalogsStore();
</script>

<template>
  <q-badge
    :label="catalogsStore.getStatusLabel(props.status)"
    :style="{
      backgroundColor: catalogsStore.getStatusColor(props.status) + '18',
      color: catalogsStore.getStatusColor(props.status),
      border: `1px solid ${catalogsStore.getStatusColor(props.status)}30`,
    }"
    class="status-chip"
  />
</template>

<style lang="scss" scoped>
.status-chip {
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  border-radius: 8px;
  padding: 4px 12px;
}
</style>
