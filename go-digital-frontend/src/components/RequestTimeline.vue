<script setup lang="ts">
import type { HistoryEntry } from 'src/interfaces';
import { useI18n } from 'vue-i18n';

defineProps<{
  entries: HistoryEntry[];
}>();

const { t } = useI18n();

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getActionIcon(action: string): string {
  const iconMap: Record<string, string> = {
    created: 'add_circle',
    status_changed: 'swap_horiz',
    commented: 'chat',
    assigned: 'person_add',
    updated: 'edit',
    attachment_added: 'attach_file',
    completed: 'check_circle',
    rejected: 'cancel',
  };
  return iconMap[action] || 'info';
}

function getActionColor(action: string): string {
  const colorMap: Record<string, string> = {
    created: 'primary',
    status_changed: 'info',
    commented: 'secondary',
    assigned: 'accent',
    updated: 'warning',
    attachment_added: 'grey',
    completed: 'positive',
    rejected: 'negative',
  };
  return colorMap[action] || 'primary';
}
</script>

<template>
  <q-timeline color="primary" layout="dense" v-if="entries.length">
    <q-timeline-entry
      v-for="entry in entries"
      :key="entry.id"
      :icon="getActionIcon(entry.action)"
      :color="getActionColor(entry.action)"
    >
      <template v-slot:subtitle>
        <span style="font-size: 0.75rem; opacity: 0.6;">{{ formatDate(entry.createdAt) }}</span>
      </template>
      <div>
        <div class="text-weight-medium" style="font-size: 0.88rem;">{{ entry.description }}</div>
        <div class="text-caption q-mt-xs" style="opacity: 0.5;">{{ entry.user }}</div>
      </div>
    </q-timeline-entry>
  </q-timeline>

  <div v-else class="text-center q-pa-lg" style="opacity: 0.5;">
    <q-icon name="history" size="48px" class="q-mb-sm" />
    <div>{{ t('noHistory') }}</div>
  </div>
</template>
