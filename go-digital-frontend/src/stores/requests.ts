import { defineStore } from 'pinia';
import { ref } from 'vue';
import { requestService } from 'src/services/requestService';
import { useAuthStore } from 'src/stores/auth';
import type { DxRequest, RequestFilters, Comment, CreateCommentPayload } from 'src/interfaces';

export const useRequestsStore = defineStore('requests', () => {
  // ─── State ───
  const requests = ref<DxRequest[]>([]);
  const currentRequest = ref<DxRequest | null>(null);
  const loading = ref(false);
  const detailLoading = ref(false);
  const creating = ref(false);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const totalPages = ref(1);
  const filters = ref<RequestFilters>({});

  // ─── Actions ───
  async function fetchRequests(filterOverrides?: RequestFilters) {
    loading.value = true;
    try {
      const params = { ...filters.value, ...filterOverrides, page: page.value, limit: limit.value };
      const response = await requestService.getRequests(params);
      if (response.success) {
        requests.value = response.data.items;
        total.value = response.data.total;
        totalPages.value = response.data.totalPages;
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchRequestById(id: number) {
    detailLoading.value = true;
    try {
      const response = await requestService.getRequestById(id);
      if (response.success) {
        currentRequest.value = response.data;
      }
    } catch (err) {
      console.error('Failed to fetch request detail:', err);
    } finally {
      detailLoading.value = false;
    }
  }

  async function createRequest(formData: FormData): Promise<boolean> {
    creating.value = true;
    try {
      const authStore = useAuthStore();
      const userId = authStore.user?.id ?? 1;
      const response = await requestService.createRequest(formData, userId);
      if (response.success) {
        // After creating, upload any attached files
        const files = formData.getAll('attachments') as File[];
        if (files.length > 0) {
          await requestService.uploadAttachments(response.data.id, files);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to create request:', err);
      return false;
    } finally {
      creating.value = false;
    }
  }

  async function uploadAttachments(requestId: number, files: File[]): Promise<boolean> {
    try {
      const response = await requestService.uploadAttachments(requestId, files);
      if (response.success && currentRequest.value) {
        currentRequest.value.attachments.push(...response.data);
      }
      return response.success;
    } catch (err) {
      console.error('Failed to upload attachments:', err);
      return false;
    }
  }

  async function addComment(payload: CreateCommentPayload): Promise<Comment | null> {
    try {
      const response = await requestService.addComment(payload.requestId, payload.content);
      if (response.success && currentRequest.value) {
        currentRequest.value.comments.push(response.data);
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to add comment:', err);
      return null;
    }
  }

  function setFilters(newFilters: RequestFilters) {
    filters.value = { ...filters.value, ...newFilters };
    page.value = 1;
  }

  function clearFilters() {
    filters.value = {};
    page.value = 1;
  }

  async function updateRequestStatus(requestId: number, statusId: number): Promise<boolean> {
    try {
      const authStore = useAuthStore();
      const userId = authStore.user?.id ?? 1;
      const response = await requestService.updateStatus(requestId, statusId, userId);
      if (response.success) {
        // Refresh the current request to get updated status and history
        await fetchRequestById(requestId);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update request status:', err);
      return false;
    }
  }

  function setPage(newPage: number) {
    page.value = newPage;
  }

  return {
    requests,
    currentRequest,
    loading,
    detailLoading,
    creating,
    total,
    page,
    limit,
    totalPages,
    filters,
    fetchRequests,
    fetchRequestById,
    createRequest,
    uploadAttachments,
    addComment,
    updateRequestStatus,
    setFilters,
    clearFilters,
    setPage,
  };
});
