import { useMutation, useQuery, useQueryClient } from 'react-query';

import { CommentType, ExpandedComment } from '@/features/comments';
import { client } from '@/libs/client';

export const useComments = (threadId: string) => {
  return useQuery(['comments', threadId], async () =>
    client.collection('comments').getFullList<ExpandedComment>(999, {
      filter: `thread="${threadId}"`,
      expand: 'owner',
    })
  );
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: Pick<CommentType, 'thread' | 'message' | 'owner'>) =>
      client.collection('comments').create(data),
    {
      onSuccess: (createdComment) => {
        void queryClient.invalidateQueries(['comments', createdComment.thread]);
      },
    }
  );
};
