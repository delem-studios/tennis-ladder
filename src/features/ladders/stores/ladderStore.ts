import create from 'zustand';

export interface LadderStore {
  ladderId: string | null;
  myParticipantId: string | null;
  myParticipantRank: number | null;
  acceptDate: string;
  score: Array<Array<string>>;

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
};

export const useLadderStore = create<LadderStore>((set) => ({
  ...defaultState,
  setField: (field, value) => set({ [field]: value }),
  setFields: (newStore) => set(newStore),
  reset: () => set(defaultState),
}));
