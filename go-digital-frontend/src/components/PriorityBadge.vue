<script setup lang="ts">
import { useCatalogsStore } from 'src/stores/catalogs';

const props = defineProps<{
  priority: string;
}>();

const catalogsStore = useCatalogsStore();
</script>

<template>
  <q-badge
    :label="catalogsStore.getPriorityLabel(props.priority)"
    :style="{
      backgroundColor: catalogsStore.getPriorityColor(props.priority) + '18',
      color: catalogsStore.getPriorityColor(props.priority),
      border: `1px solid ${catalogsStore.getPriorityColor(props.priority)}30`,
    }"
    class="priority-chip"
  />
</template>

<style lang="scss" scoped>
.priority-chip {
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  border-radius: 8px;
  padding: 4px 12px;
}
</style>
