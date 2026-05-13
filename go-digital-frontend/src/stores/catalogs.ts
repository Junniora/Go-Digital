import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { catalogService } from 'src/services/catalogService';
import type { CatalogItem } from 'src/interfaces';

export const useCatalogsStore = defineStore('catalogs', () => {
  // ─── State ───
  const statuses = ref<CatalogItem[]>([]);
  const departments = ref<CatalogItem[]>([]);
  const priorities = ref<CatalogItem[]>([]);
  const categories = ref<CatalogItem[]>([]);
  const loaded = ref(false);
  const loading = ref(false);

  // ─── Getters ───
  const statusOptions = computed(() => statuses.value.map((s) => ({ label: s.label, value: s.value })));
  const departmentOptions = computed(() => departments.value.map((d) => ({ label: d.label, value: d.value })));
  const priorityOptions = computed(() => priorities.value.map((p) => ({ label: p.label, value: p.value })));
  const categoryOptions = computed(() => categories.value.map((c) => ({ label: c.label, value: c.value })));

  function getStatusColor(value: string): string {
    return statuses.value.find((s) => s.value === value)?.color || '#6366f1';
  }

  function getPriorityColor(value: string): string {
    const colorMap: Record<string, string> = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#eab308',
      low: '#22c55e',
    };
    return priorities.value.find((p) => p.value === value)?.color || colorMap[value] || '#6366f1';
  }

  function getStatusLabel(value: string): string {
    return statuses.value.find((s) => s.value === value)?.label || value;
  }

  function getPriorityLabel(value: string): string {
    return priorities.value.find((p) => p.value === value)?.label || value;
  }

  // ─── Actions ───
  async function fetchCatalogs() {
    if (loaded.value) return;
    loading.value = true;
    try {
      const response = await catalogService.getCatalogs();
      if (response.success) {
        statuses.value = response.data.statuses;
        departments.value = response.data.departments;
        priorities.value = response.data.priorities;
        categories.value = response.data.categories || [];
        loaded.value = true;
      }
    } catch (err) {
      console.error('Failed to fetch catalogs:', err);
      // Fallback defaults so UI isn't empty
      statuses.value = [
        { id: 1, label: 'Pending', value: 'pending', color: '#f59e0b' },
        { id: 2, label: 'In Review', value: 'in_review', color: '#6366f1' },
        { id: 3, label: 'In Progress', value: 'in_progress', color: '#3b82f6' },
        { id: 4, label: 'Completed', value: 'completed', color: '#22c55e' },
        { id: 5, label: 'Rejected', value: 'rejected', color: '#ef4444' },
      ];
      departments.value = [
        { id: 1, label: 'Operations', value: 'operations' },
        { id: 2, label: 'Finance', value: 'finance' },
        { id: 3, label: 'Human Resources', value: 'hr' },
        { id: 4, label: 'Sales', value: 'sales' },
        { id: 5, label: 'IT', value: 'it' },
        { id: 6, label: 'Quality', value: 'quality' },
      ];
      priorities.value = [
        { id: 1, label: 'Critical', value: 'critical', color: '#ef4444' },
        { id: 2, label: 'High', value: 'high', color: '#f97316' },
        { id: 3, label: 'Medium', value: 'medium', color: '#eab308' },
        { id: 4, label: 'Low', value: 'low', color: '#22c55e' },
      ];
      categories.value = [
        { id: 1, label: 'Process Automation', value: 'automation' },
        { id: 2, label: 'Data Analytics', value: 'analytics' },
        { id: 3, label: 'Digital Forms', value: 'forms' },
        { id: 4, label: 'System Integration', value: 'integration' },
        { id: 5, label: 'Reporting', value: 'reporting' },
      ];
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  return {
    statuses,
    departments,
    priorities,
    categories,
    loaded,
    loading,
    statusOptions,
    departmentOptions,
    priorityOptions,
    categoryOptions,
    getStatusColor,
    getPriorityColor,
    getStatusLabel,
    getPriorityLabel,
    fetchCatalogs,
  };
});
