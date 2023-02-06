import { ClientResponseError } from 'pocketbase';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  Challenge,
  ExpandedChallenge,
  ExpandedLeaderboard,
  ExpandedMatch,
  ExpandedParticipant,
  ExpandedRegistration,
  Ladder,
  Leaderboard,
  Match,
  Participant,
  Registration,
  Rules,
} from '@/features/ladders';
import { client } from '@/libs/client';

export const useMyLadders = () => {
  return useQuery('my-ladders', async () =>
    client.collection('ladders').getList<Ladder>()
  );
};

export const useLadderBySlug = (slug?: string) => {
  return useQuery<Ladder, ClientResponseError>(
    ['ladders', slug],
    async () => client.send(`/api/ladders/${slug}`, {}),
    {
      enabled: Boolean(slug),
    }
  );
};

export const useParticipants = (ladderId: string) => {
  return useQuery(['ladders', ladderId, 'participants'], async () =>
    client.collection('participants').getFullList<ExpandedParticipant>(200, {
      filter: `ladder="${ladderId}"`,
      expand: 'primaryPlayer,secondaryPlayer',
    })
  );
};

export const useRegisterForLadder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Registration,
    ClientResponseError,
    Pick<Registration, 'ladder' | 'primaryPlayer' | 'secondaryPlayer'> & {
      registrationCode: string;
    }
  >(async (data) => client.collection('registrations').create(data), {
    onSuccess: (_, context) => {
      void queryClient.invalidateQueries([
        'ladders',
        context.ladder,
        'registrations',
      ]);
      void queryClient.invalidateQueries(['registrations']);
    },
  });
};

export const useRegistrations = ({
  ladderId,
  page,
  perPage,
}: {
  ladderId: string;
  page: number;
  perPage: number;
}) => {
  return useQuery(['ladders', ladderId, 'registrations'], async () =>
    client
      .collection('registrations')
      .getList<ExpandedRegistration>(page, perPage, {
        filter: `ladder="${ladderId}"`,
        expand: 'primaryPlayer,secondaryPlayer',
      })
  );
};

export const useRegistrationById = ({
  ladderId,
  userId,
}: {
  ladderId?: string;
  userId?: string;
}) => {
  return useQuery(
    ['registrations', ladderId, userId],
    async () =>
      client
        .collection('registrations')
        .getFirstListItem<ExpandedRegistration>(
          `ladder="${ladderId}"&&primaryPlayer="${userId}"`,
          {
            expand: 'primaryPlayer,secondaryPlayer',
          }
        ),
    {
      enabled: Boolean(userId) && Boolean(ladderId),
    }
  );
};

export const useUpdateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Registration,
    ClientResponseError,
    {
      ladderId: string;
      registration: Registration;
    }
  >(
    async ({ ladderId, registration }) => {
      if (registration.status === 'accepted') {
        await client.collection('participants').create({
          ladder: ladderId,
          primaryPlayer: registration.primaryPlayer,
        });
      }

      if (registration.status === 'rejected') {
        const participant = await client
          .collection('participants')
          .getFirstListItem<Participant>(
            `primaryPlayer="${registration.primaryPlayer}"`
          );
        await client.collection('participants').delete(participant.id);
      }

      return await client
        .collection('registrations')
        .update(registration.id, registration);
    },
    {
      onSuccess: (_, params) => {
        void queryClient.invalidateQueries(['ladders', params.ladderId]);
        void queryClient.invalidateQueries(['registrations']);
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

export const useUpdateRules = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (updatedRules: Rules) =>
      client.collection('rules').update(updatedRules.id, updatedRules),
    {
      onSuccess: (updatedLeaderboard) => {
        void queryClient.invalidateQueries([
          'ladders',
          updatedLeaderboard.ladder,
          'rules',
        ]);
      },
    }
  );
};

export const useLeaderboard = (ladderId?: string) => {
  return useQuery(['ladders', ladderId, 'leaderboard'], async () =>
    client
      .collection('leaderboards')
      .getFirstListItem<ExpandedLeaderboard>(`ladder="${ladderId}"`, {
        expand:
          'leaderboard,leaderboard.primaryPlayer,leaderboard.secondaryPlayer',
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
          'challenger,challengee,challenger.primaryPlayer,challengee.primaryPlayer,challenger.secondaryPlayer,challengee.secondaryPlayer',
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
        'challenger,challengee,challenger.primaryPlayer,challengee.primaryPlayer,challenger.secondaryPlayer,challengee.secondaryPlayer',
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
          'challenger,challengee,challenger.primaryPlayer,challengee.primaryPlayer,challenger.secondaryPlayer,challengee.secondaryPlayer',
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
          'winner,loser,winner.primaryPlayer,loser.primaryPlayer,winner.secondaryPlayer,loser.secondaryPlayer,challenge',
      }),
    {
      enabled: Boolean(ladderId),
    }
  );
};
