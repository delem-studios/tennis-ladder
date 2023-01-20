import create from 'zustand';

import { ExpandedChallenge, Ladder } from '@/features/ladders';

export interface LadderStore {
  ladder: Ladder | null;
  ladderId: string | null;
  myParticipantId: string | null;
  myParticipantRank: number | null;
  acceptDate: string;
  score: Array<Array<string>>;
  challengerSetsWon: number;
  challengeeSetsWon: number;
  retired: string | null;
  winner: string | null;
  loser: string | null;

  challengeModal: Ladder | null;
  pendingChallengeModal: {
    ladder: Ladder;
    challenge: ExpandedChallenge;
  } | null;

  setField: <T extends keyof LadderStore>(
    field: T,
    value: LadderStore[T]
  ) => void;
  setFields: (newStore: Partial<LadderStore>) => void;
  reset: () => void;
}

export const defaultChallengeViewModalState = {
  score: [
    ['', ''],
    ['', ''],
    ['', ''],
  ],
  challengerSetsWon: 0,
  challengeeSetsWon: 0,
  retired: null,
  loser: null,
  winner: null,
};

const defaultState = {
  ...defaultChallengeViewModalState,
  ladder: null,
  ladderId: null,
  myParticipantId: null,
  myParticipantRank: null,
  acceptDate: '',
  challengeModal: null,
  pendingChallengeModal: null,
};

export const useLadderStore = create<LadderStore>((set) => ({
  ...defaultState,
  setField: (field, value) => set({ [field]: value }),
  setFields: (newStore) => set(newStore),
  reset: () => set(defaultState),
}));
