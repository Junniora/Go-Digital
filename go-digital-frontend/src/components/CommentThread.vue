<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import type { Comment } from 'src/interfaces';

const props = defineProps<{
  comments: Comment[];
  currentUserRole?: 'user' | 'dx_team';
}>();

const scrollRef = ref<HTMLElement | null>(null);

function scrollToBottom() {
  void nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
    }
  });
}

watch(() => props.comments.length, () => {
  scrollToBottom();
});

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getInitials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}
</script>

<template>
  <div ref="scrollRef" class="comment-thread" style="max-height: 400px; overflow-y: auto;">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="comment-bubble-wrapper q-mb-md"
      :class="{
        'comment-right': comment.authorRole === 'dx_team',
        'comment-left': comment.authorRole !== 'dx_team',
      }"
    >
      <div class="row items-start no-wrap" :class="{ 'reverse': comment.authorRole === 'dx_team' }">
        <!-- Avatar -->
        <q-avatar
          size="36px"
          :color="comment.authorRole === 'dx_team' ? 'positive' : 'primary'"
          text-color="white"
          class="text-weight-bold"
          :class="comment.authorRole === 'dx_team' ? 'q-ml-sm' : 'q-mr-sm'"
          style="font-size: 0.7rem; flex-shrink: 0;"
        >
          {{ getInitials(comment.author) }}
        </q-avatar>

        <!-- Bubble -->
        <div
          class="comment-bubble q-pa-sm q-px-md"
          :class="{
            'bubble-dx': comment.authorRole === 'dx_team',
            'bubble-user': comment.authorRole !== 'dx_team',
          }"
        >
          <div class="row items-center justify-between q-mb-xs">
            <span class="text-weight-bold" style="font-size: 0.8rem;">{{ comment.author }}</span>
            <q-badge
              v-if="comment.authorRole === 'dx_team'"
              label="DX"
              color="positive"
              text-color="white"
              class="q-ml-sm"
              style="font-size: 0.6rem; border-radius: 4px;"
            />
          </div>
          <div style="font-size: 0.88rem; line-height: 1.5;">{{ comment.content }}</div>
          <div class="text-right q-mt-xs" style="font-size: 0.7rem; opacity: 0.5;">
            {{ formatDate(comment.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-bubble-wrapper {
  display: flex;
}

.comment-left {
  justify-content: flex-start;
}

.comment-right {
  justify-content: flex-end;
}

.comment-bubble {
  max-width: 75%;
  border-radius: 14px;
  transition: all 0.2s ease;
}

.bubble-user {
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-bottom-left-radius: 4px;
}

.bubble-dx {
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.12);
  border-bottom-right-radius: 4px;
}

body.body--dark {
  .bubble-user {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.2);
  }
  .bubble-dx {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.2);
  }
}
</style>
