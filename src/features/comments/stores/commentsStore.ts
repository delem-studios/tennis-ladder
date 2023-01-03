import { produce } from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import {
  CommentsCreate,
  CommentsType,
  Commentss,
} from '@/features/commentss';
import { uuid } from '@/lib/uuid';

export interface CommentsStore {
  commentss: Commentss;
  addComments: (newComments: CommentsCreate) => void;
  editComments: (updatedComments: CommentsType) => void;
  deleteComments: (commentsToDelete: CommentsType) => void;
}

export const useCommentss = create<CommentsStore>(
  persist(
    (set) => ({
      commentss: {},
      addComments: (newComments) =>
        set(
          produce((state) => {
            const commentsId = uuid();
            state.commentss[commentsId] = {
              ...newComments,
              id: commentsId,
            };
          })
        ),
      editComments: (updatedComments) =>
        set(
          produce((state) => {
            state.commentss[updatedComments.id] = updatedComments;
          })
        ),
      deleteComments: (comments) =>
        set(
          produce((state) => {
            delete state.commentss[comments.id];
          })
        ),
    }),
    {
      name: 'commentss',
    }
  )
);
