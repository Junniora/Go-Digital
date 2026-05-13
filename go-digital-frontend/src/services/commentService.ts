import { post } from './api';
import type { Comment, CreateCommentPayload, ApiResponse } from 'src/interfaces';

const DEV_MOCK = import.meta.env.VITE_DEV_MOCK === 'true';

async function mockPostComment(payload: CreateCommentPayload): Promise<ApiResponse<Comment>> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const newComment: Comment = {
    id: Date.now(),
    requestId: payload.requestId,
    content: payload.content,
    author: 'Current User',
    authorRole: 'user',
    createdAt: new Date().toISOString(),
  };
  return { success: true, data: newComment, message: 'Comment added' };
}

export const commentService = {
  async postComment(payload: CreateCommentPayload) {
    if (DEV_MOCK) return mockPostComment(payload);
    return post<Comment>('/comments', payload);
  },
};
