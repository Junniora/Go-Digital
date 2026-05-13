<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (e: 'send', content: string): void;
}>();

defineProps<{
  loading?: boolean;
}>();

const { t } = useI18n();
const commentText = ref('');

function handleSend() {
  const text = commentText.value.trim();
  if (!text) return;
  emit('send', text);
  commentText.value = '';
}
</script>

<template>
  <div class="comment-input-wrapper">
    <q-input
      v-model="commentText"
      :placeholder="t('commentPlaceholder')"
      outlined
      dense
      autogrow
      :maxlength="1000"
      class="q-mr-sm"
      style="flex: 1;"
      @keyup.enter.exact="handleSend"
    >
      <template v-slot:append>
        <q-btn
          flat
          round
          dense
          icon="send"
          color="primary"
          :loading="loading"
          :disable="!commentText.trim()"
          @click="handleSend"
        >
          <q-tooltip>{{ t('sendComment') }}</q-tooltip>
        </q-btn>
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
.comment-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 0 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

body.body--dark .comment-input-wrapper {
  border-top-color: rgba(255, 255, 255, 0.06);
}
</style>
