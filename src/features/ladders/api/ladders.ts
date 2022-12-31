import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Ladder, Participant, Rules } from '@/features/ladders';
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

export const useParticipants = (ladderId: string) => {
  return useQuery(['ladders', ladderId, 'participants'], async () =>
    client
      .collection('participants')
      .getFullList<Expand<Participant, { primaryPlayer: User }>>(200, {
        filter: `ladder = "${ladderId}"`,
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

export const useUpdateLadder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updatedLadder: Ladder) =>
      client.collection('ladders').update(updatedLadder.id, updatedLadder),
    {
      onSuccess: (updatedLadder) => {
        void queryClient.invalidateQueries(['ladders', updatedLadder.slug]);
      },
    }
  );
};

export const useRules = (ladderId: string) => {
  return useQuery(['ladders', ladderId, 'rules'], async () =>
    client.collection('rules').getFirstListItem<Rules>(`ladder="${ladderId}"`)
  );
};
