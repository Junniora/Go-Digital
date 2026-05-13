<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useCatalogsStore } from 'src/stores/catalogs';

defineProps<{
  status?: string | undefined;
  department?: string | undefined;
  priority?: string | undefined;
  search?: string | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:status', value: string | undefined): void;
  (e: 'update:department', value: string | undefined): void;
  (e: 'update:priority', value: string | undefined): void;
  (e: 'update:search', value: string): void;
  (e: 'clear'): void;
}>();

const { t } = useI18n();
const catalogsStore = useCatalogsStore();
</script>

<template>
  <div class="filter-bar glass-card-static q-pa-md">
    <div class="row items-center q-gutter-sm">
      <!-- Search -->
      <q-input
        :model-value="search"
        @update:model-value="(val: string | number | null) => emit('update:search', String(val ?? ''))"
        dense
        outlined
        :placeholder="t('search')"
        class="col-12 col-sm-4 col-md-3"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Status Filter -->
      <q-select
        :model-value="status"
        @update:model-value="(val: string) => emit('update:status', val || undefined)"
        :options="[{ label: t('filterByStatus'), value: '' }, ...catalogsStore.statusOptions]"
        emit-value
        map-options
        dense
        outlined
        class="col-12 col-sm col-md-2"
        :label="t('status')"
      />

      <!-- Department Filter -->
      <q-select
        :model-value="department"
        @update:model-value="(val: string) => emit('update:department', val || undefined)"
        :options="[{ label: t('filterByDepartment'), value: '' }, ...catalogsStore.departmentOptions]"
        emit-value
        map-options
        dense
        outlined
        class="col-12 col-sm col-md-2"
        :label="t('department')"
      />

      <!-- Priority Filter -->
      <q-select
        :model-value="priority"
        @update:model-value="(val: string) => emit('update:priority', val || undefined)"
        :options="[{ label: t('filterByPriority'), value: '' }, ...catalogsStore.priorityOptions]"
        emit-value
        map-options
        dense
        outlined
        class="col-12 col-sm col-md-2"
        :label="t('priority')"
      />

      <!-- Clear Filters -->
      <q-btn
        flat
        no-caps
        dense
        icon="filter_list_off"
        :label="t('clearFilters')"
        color="grey-7"
        @click="emit('clear')"
        class="q-ml-auto"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-bar {
  border-radius: 14px;
}
</style>
