<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCatalogsStore } from 'src/stores/catalogs';
import { useRequestsStore } from 'src/stores/requests';
import { useNotify } from 'src/composables/useNotify';

const { t } = useI18n();
const router = useRouter();
const catalogsStore = useCatalogsStore();
const requestsStore = useRequestsStore();
const notify = useNotify();

const currentStep = ref(1);

// Form fields
const title = ref('');
const department = ref('');
const requester = ref('');
const category = ref('');
const currentProcess = ref('');
const problemOpportunity = ref('');
const expectedImpact = ref('');
const priority = ref('');
const files = ref<File[]>([]);

const step1Valid = ref(false);
const step2Valid = ref(false);
const step3Valid = ref(false);

function onFilePick(fileList: readonly File[]) {
  files.value = [...fileList];
}

function removeFile(index: number) {
  files.value.splice(index, 1);
}

async function handleSubmit() {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('department', department.value);
  formData.append('departmentId', department.value); // department value is the ID string
  formData.append('requester', requester.value);
  formData.append('category', category.value);
  formData.append('currentProcess', currentProcess.value);
  formData.append('problemOpportunity', problemOpportunity.value);
  formData.append('expectedImpact', expectedImpact.value);
  formData.append('priority', priority.value);
  files.value.forEach((f) => formData.append('attachments', f));

  const success = await requestsStore.createRequest(formData);
  if (success) {
    notify.success(t('requestCreated'));
    void router.push('/requests');
  } else {
    notify.error(t('requestCreateError'));
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

onMounted(() => {
  void catalogsStore.fetchCatalogs();
});
</script>

<template>
  <q-page class="q-pa-md">
    <div class="container-narrow">
      <!-- Header -->
      <div class="q-mb-lg">
        <q-btn flat no-caps icon="arrow_back" :label="t('back')" color="grey-7"
          @click="router.back()" class="q-mb-sm" />
        <h1 class="section-title q-mb-xs">{{ t('createRequestTitle') }}</h1>
        <p class="section-subtitle">{{ t('createRequestSubtitle') }}</p>
      </div>

      <!-- Stepper -->
      <q-stepper v-model="currentStep" color="primary" animated flat
        class="glass-card-static" style="border-radius: 16px;">

        <!-- Step 1: Basic Info -->
        <q-step :name="1" :title="t('basicInfo')" icon="info" :done="currentStep > 1">
          <q-form ref="formStep1" @validation-success="step1Valid = true" @validation-error="step1Valid = false">
            <div class="q-gutter-md">
              <q-input v-model="title" :label="t('requestTitle')" outlined
                :rules="[(v: string) => !!v || t('titleRequired')]" lazy-rules
                :placeholder="t('titlePlaceholder')">
                <template v-slot:prepend><q-icon name="title" /></template>
              </q-input>

              <div class="row q-gutter-md">
                <q-select v-model="department" :label="t('department')" outlined
                  :options="catalogsStore.departmentOptions" emit-value map-options
                  :rules="[(v: string) => !!v || t('departmentRequired')]" lazy-rules
                  class="col">
                  <template v-slot:prepend><q-icon name="business" /></template>
                </q-select>

                <q-input v-model="requester" :label="t('requester')" outlined
                  :rules="[(v: string) => !!v || t('requesterRequired')]" lazy-rules
                  :placeholder="t('requesterPlaceholder')" class="col">
                  <template v-slot:prepend><q-icon name="person" /></template>
                </q-input>
              </div>

              <q-select v-model="category" :label="t('category')" outlined
                :options="catalogsStore.categoryOptions" emit-value map-options
                :rules="[(v: string) => !!v || t('categoryRequired')]" lazy-rules>
                <template v-slot:prepend><q-icon name="category" /></template>
              </q-select>
            </div>
          </q-form>

          <q-stepper-navigation>
            <q-btn unelevated no-caps color="primary" :label="t('submit')" icon-right="arrow_forward"
              @click="currentStep = 2" style="border-radius: 10px;" />
          </q-stepper-navigation>
        </q-step>

        <!-- Step 2: Process Details -->
        <q-step :name="2" :title="t('processDetails')" icon="description" :done="currentStep > 2">
          <q-form ref="formStep2" @validation-success="step2Valid = true" @validation-error="step2Valid = false">
            <div class="q-gutter-md">
              <q-input v-model="currentProcess" :label="t('currentProcess')" outlined type="textarea"
                :rules="[(v: string) => !!v || t('processRequired')]" lazy-rules
                :placeholder="t('currentProcessPlaceholder')" autogrow :min-rows="3">
                <template v-slot:prepend><q-icon name="article" /></template>
              </q-input>

              <q-input v-model="problemOpportunity" :label="t('problemOpportunity')" outlined type="textarea"
                :rules="[(v: string) => !!v || t('problemRequired')]" lazy-rules
                :placeholder="t('problemPlaceholder')" autogrow :min-rows="3">
                <template v-slot:prepend><q-icon name="lightbulb" /></template>
              </q-input>
            </div>
          </q-form>

          <q-stepper-navigation>
            <q-btn unelevated no-caps color="primary" :label="t('submit')" icon-right="arrow_forward"
              @click="currentStep = 3" style="border-radius: 10px;" />
            <q-btn flat no-caps color="grey-7" :label="t('back')" icon="arrow_back"
              @click="currentStep = 1" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>

        <!-- Step 3: Impact & Priority + Attachments -->
        <q-step :name="3" :title="t('impactAndPriority')" icon="trending_up">
          <q-form ref="formStep3" @validation-success="step3Valid = true" @validation-error="step3Valid = false"
            @submit.prevent="handleSubmit">
            <div class="q-gutter-md">
              <q-input v-model="expectedImpact" :label="t('expectedImpact')" outlined type="textarea"
                :rules="[(v: string) => !!v || t('impactRequired')]" lazy-rules
                :placeholder="t('impactPlaceholder')" autogrow :min-rows="2">
                <template v-slot:prepend><q-icon name="insights" /></template>
              </q-input>

              <q-select v-model="priority" :label="t('priority')" outlined
                :options="catalogsStore.priorityOptions" emit-value map-options
                :rules="[(v: string) => !!v || t('priorityRequired')]" lazy-rules>
                <template v-slot:prepend><q-icon name="flag" /></template>
              </q-select>

              <!-- File Upload -->
              <div>
                <div class="text-weight-medium q-mb-sm">{{ t('filesSection') }}</div>
                <q-file v-model="files" outlined multiple :label="t('dragDropFiles')"
                  @update:model-value="onFilePick" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  :max-file-size="10485760" counter>
                  <template v-slot:prepend><q-icon name="cloud_upload" /></template>
                  <template v-slot:hint>{{ t('maxFileSize') }}</template>
                </q-file>

                <!-- File list -->
                <q-list dense class="q-mt-sm" v-if="files.length">
                  <q-item v-for="(file, idx) in files" :key="idx" class="q-px-none">
                    <q-item-section avatar><q-icon name="attach_file" color="primary" /></q-item-section>
                    <q-item-section>
                      <q-item-label>{{ file.name }}</q-item-label>
                      <q-item-label caption>{{ formatFileSize(file.size) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn flat round dense icon="close" size="sm" @click="removeFile(idx)" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-form>

          <q-stepper-navigation>
            <q-btn unelevated no-caps class="btn-gradient" :label="t('submit')" icon="send"
              :loading="requestsStore.creating" @click="handleSubmit"
              style="border-radius: 10px;" />
            <q-btn flat no-caps color="grey-7" :label="t('back')" icon="arrow_back"
              @click="currentStep = 2" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>
