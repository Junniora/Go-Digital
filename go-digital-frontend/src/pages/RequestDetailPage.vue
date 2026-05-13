<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useRequestsStore } from 'src/stores/requests';
import { useAuthStore } from 'src/stores/auth';
import { useCatalogsStore } from 'src/stores/catalogs';
import { useNotify } from 'src/composables/useNotify';
import StatusBadge from 'src/components/StatusBadge.vue';
import PriorityBadge from 'src/components/PriorityBadge.vue';
import CommentThread from 'src/components/CommentThread.vue';
import CommentInput from 'src/components/CommentInput.vue';
import RequestTimeline from 'src/components/RequestTimeline.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const requestsStore = useRequestsStore();
const authStore = useAuthStore();
const catalogsStore = useCatalogsStore();
const notify = useNotify();
const commentLoading = ref(false);
const statusUpdating = ref(false);
const selectedStatusId = ref<number | null>(null);

const requestId = Number(route.params.id);

// ─── Role-based permissions ───
const canManageStatus = computed(() => {
  const role = authStore.userRole;
  return role === 'dx_team' || role === 'admin';
});

// ─── Status workflow ───
const statusOptions = computed(() => {
  return catalogsStore.statuses.map((s) => ({
    label: s.label,
    value: s.id,
  }));
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

async function handleSendComment(content: string) {
  commentLoading.value = true;
  const result = await requestsStore.addComment({ requestId, content });
  commentLoading.value = false;
  if (result) {
    notify.success(t('comments') + ' ✓');
  } else {
    notify.error('Failed to add comment');
  }
}

async function handleStatusChange() {
  if (!selectedStatusId.value) return;
  statusUpdating.value = true;
  const success = await requestsStore.updateRequestStatus(requestId, selectedStatusId.value);
  statusUpdating.value = false;
  if (success) {
    notify.success('Status actualizado ✓');
    // Update the selected status to reflect current
    if (requestsStore.currentRequest) {
      selectedStatusId.value = requestsStore.currentRequest.statusId;
    }
  } else {
    notify.error('Error al actualizar status');
  }
}

onMounted(async () => {
  await catalogsStore.fetchCatalogs();
  await requestsStore.fetchRequestById(requestId);
  if (requestsStore.currentRequest) {
    selectedStatusId.value = requestsStore.currentRequest.statusId;
  }
});
</script>

<template>
  <q-page class="q-pa-md">
    <div class="container-wide">
      <!-- Back button -->
      <q-btn flat no-caps icon="arrow_back" :label="t('back')" color="grey-7"
        @click="router.push('/requests')" class="q-mb-md" />

      <!-- Loading -->
      <div v-if="requestsStore.detailLoading" class="text-center q-pa-xl">
        <q-spinner-orbit size="60px" color="primary" />
        <div class="q-mt-md" style="opacity: 0.6;">{{ t('loading') }}</div>
      </div>

      <!-- Content -->
      <template v-else-if="requestsStore.currentRequest">
        <!-- Header Card -->
        <q-card flat class="glass-card-static q-pa-lg q-mb-md" style="border-radius: 16px;">
          <div class="row items-start justify-between">
            <div>
              <div class="row items-center q-gutter-sm q-mb-sm">
                <status-badge :status="requestsStore.currentRequest.status" />
                <priority-badge :priority="requestsStore.currentRequest.priority" />
                <q-badge outline color="grey-6" :label="'#' + requestsStore.currentRequest.id" />
              </div>
              <h1 style="font-size: 1.6rem; font-weight: 700; margin: 0; letter-spacing: -0.02em;">
                {{ requestsStore.currentRequest.title }}
              </h1>
            </div>
            <div class="text-right" style="opacity: 0.5; font-size: 0.85rem;">
              <div>{{ t('dateCreated') }}: {{ formatDate(requestsStore.currentRequest.createdAt) }}</div>
              <div>{{ t('lastUpdated') }}: {{ formatDate(requestsStore.currentRequest.updatedAt) }}</div>
            </div>
          </div>
        </q-card>

        <!-- ═══════════════════════════════════════ -->
        <!-- DX TEAM / ADMIN: Management Panel      -->
        <!-- ═══════════════════════════════════════ -->
        <q-card v-if="canManageStatus" flat class="dx-panel q-pa-lg q-mb-md" style="border-radius: 16px;">
          <div class="row items-center q-gutter-md">
            <div class="row items-center q-gutter-sm">
              <q-icon name="admin_panel_settings" size="28px" color="primary" />
              <div>
                <div class="text-weight-bold" style="font-size: 1rem;">Panel de Gestión DX</div>
                <div style="font-size: 0.8rem; opacity: 0.6;">Administra el avance de este request</div>
              </div>
            </div>

            <q-space />

            <!-- Status Change -->
            <div class="row items-center q-gutter-sm">
              <q-select
                v-model="selectedStatusId"
                :options="statusOptions"
                emit-value
                map-options
                dense
                outlined
                label="Cambiar Status"
                style="min-width: 220px;"
                class="status-select"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon name="circle" size="12px"
                        :style="{ color: catalogsStore.getStatusColor(
                          catalogsStore.statuses.find(s => s.id === scope.opt.value)?.value ?? ''
                        )}" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-btn
                unelevated
                no-caps
                color="primary"
                icon="check"
                label="Aplicar"
                :loading="statusUpdating"
                :disable="!selectedStatusId || selectedStatusId === requestsStore.currentRequest.statusId"
                @click="handleStatusChange"
                style="border-radius: 10px;"
              />
            </div>
          </div>
        </q-card>

        <div class="row q-gutter-md">
          <!-- Left Column: Info -->
          <div class="col-12 col-md-7">
            <!-- Info Grid -->
            <q-card flat class="glass-card-static q-pa-lg q-mb-md" style="border-radius: 16px;">
              <div class="text-weight-bold q-mb-md" style="font-size: 1.05rem;">
                <q-icon name="info" color="primary" class="q-mr-sm" />{{ t('requestInfo') }}
              </div>
              <div class="row q-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-uppercase" style="opacity: 0.5; letter-spacing: 0.05em;">{{ t('department') }}</div>
                  <div class="text-weight-medium">{{ requestsStore.currentRequest.department }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-uppercase" style="opacity: 0.5; letter-spacing: 0.05em;">{{ t('requester') }}</div>
                  <div class="text-weight-medium">{{ requestsStore.currentRequest.requester }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-uppercase" style="opacity: 0.5; letter-spacing: 0.05em;">{{ t('category') }}</div>
                  <div class="text-weight-medium">{{ requestsStore.currentRequest.category || '—' }}</div>
                </div>
              </div>
            </q-card>

            <!-- Process Description -->
            <q-card flat class="glass-card-static q-pa-lg q-mb-md" style="border-radius: 16px;">
              <q-expansion-item default-opened dense-toggle
                icon="article" :label="t('currentProcess')" header-class="text-weight-bold">
                <div class="q-pa-md" style="line-height: 1.7; opacity: 0.8;">
                  {{ requestsStore.currentRequest.currentProcess }}
                </div>
              </q-expansion-item>

              <q-separator class="q-my-sm" />

              <q-expansion-item default-opened dense-toggle
                icon="lightbulb" :label="t('problemOpportunity')" header-class="text-weight-bold">
                <div class="q-pa-md" style="line-height: 1.7; opacity: 0.8;">
                  {{ requestsStore.currentRequest.problemOpportunity }}
                </div>
              </q-expansion-item>

              <q-separator class="q-my-sm" />

              <q-expansion-item default-opened dense-toggle
                icon="insights" :label="t('expectedImpact')" header-class="text-weight-bold">
                <div class="q-pa-md" style="line-height: 1.7; opacity: 0.8;">
                  {{ requestsStore.currentRequest.expectedImpact }}
                </div>
              </q-expansion-item>
            </q-card>

            <!-- Attachments -->
            <q-card v-if="requestsStore.currentRequest.attachments?.length"
              flat class="glass-card-static q-pa-lg q-mb-md" style="border-radius: 16px;">
              <div class="text-weight-bold q-mb-md">
                <q-icon name="attach_file" color="primary" class="q-mr-sm" />{{ t('attachments') }}
              </div>
              <q-list dense>
                <q-item v-for="att in requestsStore.currentRequest.attachments" :key="att.id"
                  clickable tag="a" :href="att.url" target="_blank">
                  <q-item-section avatar><q-icon name="insert_drive_file" color="primary" /></q-item-section>
                  <q-item-section>
                    <q-item-label>{{ att.name }}</q-item-label>
                    <q-item-label caption>{{ (att.size / 1024).toFixed(1) }} KB</q-item-label>
                  </q-item-section>
                  <q-item-section side><q-icon name="download" /></q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- Right Column: Timeline + Comments -->
          <div class="col-12 col-md">
            <!-- Timeline -->
            <q-card flat class="glass-card-static q-pa-lg q-mb-md" style="border-radius: 16px;">
              <div class="text-weight-bold q-mb-md">
                <q-icon name="history" color="primary" class="q-mr-sm" />{{ t('changeHistory') }}
              </div>
              <request-timeline :entries="requestsStore.currentRequest.history || []" />
            </q-card>

            <!-- Comments -->
            <q-card flat class="glass-card-static q-pa-lg" style="border-radius: 16px;">
              <div class="text-weight-bold q-mb-md">
                <q-icon name="chat" color="primary" class="q-mr-sm" />{{ t('comments') }}
                <q-badge v-if="requestsStore.currentRequest.comments?.length" color="primary" floating>
                  {{ requestsStore.currentRequest.comments.length }}
                </q-badge>
              </div>

              <div v-if="!requestsStore.currentRequest.comments?.length" class="text-center q-pa-md" style="opacity: 0.5;">
                <q-icon name="chat_bubble_outline" size="40px" class="q-mb-sm" />
                <div>{{ t('noComments') }}</div>
              </div>

              <comment-thread v-else
                :comments="requestsStore.currentRequest.comments"
                :current-user-role="(authStore.userRole as ('user' | 'dx_team'))" />

              <comment-input :loading="commentLoading" @send="handleSendComment" />
            </q-card>
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.dx-panel {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.06));
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.status-select {
  :deep(.q-field__control) {
    border-radius: 10px;
  }
}
</style>
