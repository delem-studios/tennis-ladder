import create from 'zustand';

export interface LadderStore {
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

  setField: <T extends keyof LadderStore>(
    field: T,
    value: LadderStore[T]
  ) => void;
  setFields: (newStore: Partial<LadderStore>) => void;
  reset: () => void;
}

const defaultState = {
  ladderId: null,
  myParticipantId: null,
  myParticipantRank: null,
  acceptDate: '',
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

export const useLadderStore = create<LadderStore>((set) => ({
  ...defaultState,
  setField: (field, value) => set({ [field]: value }),
  setFields: (newStore) => set(newStore),
  reset: () => set(defaultState),
}));
