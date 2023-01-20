import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Challenge,
  ExpandedChallenge,
  ExpandedLeaderboard,
  ExpandedMatch,
  Ladder,
  Leaderboard,
  Match,
  Participant,
  Rules,
} from '@/features/ladders';
import { client } from '@/libs/client';
import { Expand, User } from '@/types';

export const useMyLadders = () => {
  return useQuery('my-ladders', async () =>
    client.collection('ladders').getList<Ladder>()
  );
};

export const useLadderBySlug = (slug?: string) => {
  return useQuery(
    ['ladders', slug],
    async () =>
      client.collection('ladders').getFirstListItem<Ladder>(`slug="${slug}"`),
    {
      enabled: Boolean(slug),
    }
  );
};

export const useParticipants = (ladderId: string) => {
  return useQuery(['ladders', ladderId, 'participants'], async () =>
    client
      .collection('participants')
      .getFullList<Expand<Participant, { primaryPlayer: User }>>(200, {
        filter: `ladder="${ladderId}"`,
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

export const useDeleteLadder = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (ladderId: string) => client.collection('ladders').delete(ladderId),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(['ladders']);
      },
    }
  );
};

export const useRules = (ladderId: string) => {
  return useQuery(['ladders', ladderId, 'rules'], async () =>
    client.collection('rules').getFirstListItem<Rules>(`ladder="${ladderId}"`)
  );
};

export const useLeaderboard = (ladderId?: string) => {
  return useQuery(['ladders', ladderId, 'leaderboard'], async () =>
    client
      .collection('leaderboards')
      .getFirstListItem<ExpandedLeaderboard>(`ladder="${ladderId}"`, {
        expand: 'leaderboard,leaderboard.primaryPlayer',
      })
  );
};

export const useUpdateLeaderboard = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updatedLeaderboard: Leaderboard) =>
      client
        .collection('leaderboards')
        .update(updatedLeaderboard.id, updatedLeaderboard),
    {
      onSuccess: (updatedLeaderboard) => {
        void queryClient.invalidateQueries([
          'ladders',
          updatedLeaderboard.ladder,
          'leaderboard',
        ]);
      },
    }
  );
};

export const useChallengeById = ({
  challengeId,
}: {
  challengeId?: string | null;
}) => {
  return useQuery(
    ['challenges', challengeId],
    async () =>
      client.collection('challenges').getOne<ExpandedChallenge>(challengeId!, {
        expand:
          'challenger,challengee,challenger.primaryPlayer,challengee.primaryPlayer',
      }),
    { enabled: Boolean(challengeId) }
  );
};

export const useChallenges = ({
  ladderId,
  page,
  perPage,
}: {
  ladderId: string;
  page: number;
  perPage: number;
}) => {
  return useQuery(['ladders', ladderId, 'challenges'], async () =>
    client.collection('challenges').getList<ExpandedChallenge>(page, perPage, {
      filter: `ladder="${ladderId}"`,
      expand:
        'challenger,challengee,challenger.primaryPlayer,challengee.primaryPlayer',
    })
  );
};

export const useMyChallenges = ({
  ladderId,
  myParticipantId,
}: {
  ladderId: string;
  myParticipantId?: string | null;
}) => {
  return useQuery(
    ['ladders', ladderId, 'challenges', 'mine'],
    async () =>
      client.collection('challenges').getFullList<ExpandedChallenge>(200, {
        filter: `ladder="${ladderId}" && (challenger="${myParticipantId}" || challengee="${myParticipantId}") && status != "completed"`,
        expand:
          'challenger,challengee,challenger.primaryPlayer,challengee.primaryPlayer',
      }),
    {
      enabled: Boolean(myParticipantId),
    }
  );
};

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (
      data: Pick<
        Challenge,
        'ladder' | 'challenger' | 'challengee' | 'proposedDates'
      >
    ) => client.collection('challenges').create(data),
    {
      onSuccess: (updatedLeaderboard) => {
        void queryClient.invalidateQueries([
          'ladders',
          updatedLeaderboard.ladder,
          'challenges',
        ]);
      },
    }
  );
};

export const useUpdateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updatedChallenge: Challenge) =>
      client
        .collection('challenges')
        .update(updatedChallenge.id, updatedChallenge),
    {
      onSuccess: (updatedChallenge) => {
        void queryClient.invalidateQueries(['challenges', updatedChallenge.id]);
      },
    }
  );
};

export const useDeleteChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (challengeId: string) =>
      client.collection('challenges').delete(challengeId),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(['ladders']);
        void queryClient.invalidateQueries(['challenges']);
      },
    }
  );
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (
      data: Pick<
        Match,
        | 'ladder'
        | 'winner'
        | 'loser'
        | 'score'
        | 'challenge'
        | 'date'
        | 'isForfeit'
      >
    ) => client.collection('matches').create(data),
    {
      onSuccess: (updatedLeaderboard) => {
        void queryClient.invalidateQueries([
          'ladders',
          updatedLeaderboard.ladder,
        ]);
      },
    }
  );
};

export const useMatches = ({
  ladderId,
  page,
  perPage,
}: {
  ladderId?: string;
  page: number;
  perPage: number;
}) => {
  return useQuery(
    ['ladders', ladderId, 'matches', { page, perPage }],
    async () =>
      client.collection('matches').getList<ExpandedMatch>(page, perPage, {
        filter: `ladder="${ladderId}"`,
        expand:
          'winner,loser,winner.primaryPlayer,loser.primaryPlayer,challenge',
      }),
    {
      enabled: Boolean(ladderId),
    }
  );
};
