import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Ladder, Participant } from '@/features/ladders';
import { useToast } from '@/hooks';
import { client } from '@/libs/client';
import { Expand, User } from '@/types';

export const useMyLadders = () => {
  return useQuery('my-ladders', async () =>
    client.collection('ladders').getList<Ladder>()
  );
};

export const useLadderBySlug = (slug: string) => {
  return useQuery(['ladders', slug], async () =>
    client.collection('ladders').getFirstListItem<Ladder>(`slug="${slug}"`)
  );
};

export const useParticipants = (slug: string) => {
  return useQuery(['ladders', slug, 'participants'], async () =>
    client
      .collection('participants')
      .getFullList<Expand<Participant, { primaryPlayer: User }>>(200, {
        'task.slug': slug,
        expand: 'primaryPlayer',
      })
  );
};

export const useRegisterForLadder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (ladderId: string) =>
      client.collection('participants').create({
        ladder: ladderId,
        primaryPlayer: client.authStore.model?.id,
      }),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(['ladders']);
      },
    }
  );
};
