<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useRequestsStore } from 'src/stores/requests';
import { useCatalogsStore } from 'src/stores/catalogs';
import StatusBadge from 'src/components/StatusBadge.vue';
import PriorityBadge from 'src/components/PriorityBadge.vue';
import FilterBar from 'src/components/FilterBar.vue';
import LoadingSkeleton from 'src/components/LoadingSkeleton.vue';

const { t } = useI18n();
const router = useRouter();
const requestsStore = useRequestsStore();
const catalogsStore = useCatalogsStore();

const searchText = ref('');
const filterStatus = ref<string | undefined>(undefined);
const filterDepartment = ref<string | undefined>(undefined);
const filterPriority = ref<string | undefined>(undefined);

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left' as const,
    sortable: true,
    style: 'width: 60px',
  },
  { name: 'title', label: 'requestTitle', field: 'title', align: 'left' as const, sortable: true },
  {
    name: 'department',
    label: 'department',
    field: 'department',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'requester', label: 'requester', field: 'requester', align: 'left' as const },
  { name: 'priority', label: 'priority', field: 'priority', align: 'center' as const },
  { name: 'status', label: 'status', field: 'status', align: 'center' as const },
  {
    name: 'createdAt',
    label: 'dateCreated',
    field: 'createdAt',
    align: 'left' as const,
    sortable: true,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function onRowClick(row: { id: number }) {
  void router.push(`/requests/${row.id}`);
}

function applyFilters() {
  // Map string values to IDs for the backend
  const statusItem = filterStatus.value
    ? catalogsStore.statuses.find((s) => s.value === filterStatus.value)
    : undefined;
  const departmentId = filterDepartment.value
    ? parseInt(filterDepartment.value)
    : undefined;

  requestsStore.setFilters({
    status: filterStatus.value,
    statusId: statusItem?.id,
    department: filterDepartment.value,
    departmentId: departmentId,
    priority: filterPriority.value,
    search: searchText.value || undefined,
  });
  void requestsStore.fetchRequests();
}

function clearFilters() {
  searchText.value = '';
  filterStatus.value = undefined;
  filterDepartment.value = undefined;
  filterPriority.value = undefined;
  requestsStore.clearFilters();
  void requestsStore.fetchRequests();
}

watch(
  [searchText, filterStatus, filterDepartment, filterPriority],
  () => {
    applyFilters();
  },
  { debounce: 300 } as never,
);

onMounted(() => {
  void catalogsStore.fetchCatalogs();
  void requestsStore.fetchRequests();
});
</script>

<template>
  <q-page class="q-pa-md">
    <div class="container-wide">
      <!-- Header -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h1 class="section-title q-mb-xs">{{ t('requestsList') }}</h1>
          <p class="section-subtitle">
            {{ requestsStore.total }} {{ t('totalRequests').toLowerCase() }}
          </p>
        </div>
        <q-btn
          unelevated
          no-caps
          class="btn-gradient"
          icon="add"
          :label="t('createRequest')"
          @click="router.push('/requests/new')"
          style="border-radius: 12px"
        />
      </div>

      <!-- Filters -->
      <filter-bar
        v-model:status="filterStatus"
        v-model:department="filterDepartment"
        v-model:priority="filterPriority"
        v-model:search="searchText"
        @clear="clearFilters"
        class="q-mb-md"
      />

      <!-- Loading -->
      <loading-skeleton v-if="requestsStore.loading" type="table" :count="8" />

      <!-- Table -->
      <q-table
        v-else
        flat
        :rows="requestsStore.requests"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[10, 25, 50]"
        class="glass-card-static"
        style="border-radius: 14px"
        @row-click="(_evt: Event, row: { id: number }) => onRowClick(row)"
      >
        <!-- Header labels translated -->
        <template v-slot:header-cell="props">
          <q-th :props="props">{{ t(props.col.label) }}</q-th>
        </template>

        <!-- Title column -->
        <template v-slot:body-cell-title="props">
          <q-td :props="props">
            <span class="text-weight-medium cursor-pointer" style="color: #6366f1">
              {{ props.row.title }}
            </span>
          </q-td>
        </template>

        <!-- Priority column -->
        <template v-slot:body-cell-priority="props">
          <q-td :props="props">
            <priority-badge :priority="props.row.priority" />
          </q-td>
        </template>

        <!-- Status column -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <status-badge :status="props.row.status" />
          </q-td>
        </template>

        <!-- Date column -->
        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <!-- No data -->
        <template v-slot:no-data>
          <div class="full-width text-center q-pa-xl">
            <q-icon name="inbox" size="64px" color="grey-5" class="q-mb-md" />
            <div class="text-h6 text-grey-7">{{ t('noResults') }}</div>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
