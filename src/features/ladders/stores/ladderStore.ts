import { produce } from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import {
  LadderCreate,
  LadderType,
  Ladders,
} from '@/features/ladders';
import { uuid } from '@/lib/uuid';

export interface LadderStore {
  ladders: Ladders;
  addLadder: (newLadder: LadderCreate) => void;
  editLadder: (updatedLadder: LadderType) => void;
  deleteLadder: (ladderToDelete: LadderType) => void;
}

export const useLadders = create<LadderStore>(
  persist(
    (set) => ({
      ladders: {},
      addLadder: (newLadder) =>
        set(
          produce((state) => {
            const ladderId = uuid();
            state.ladders[ladderId] = {
              ...newLadder,
              id: ladderId,
            };
          })
        ),
      editLadder: (updatedLadder) =>
        set(
          produce((state) => {
            state.ladders[updatedLadder.id] = updatedLadder;
          })
        ),
      deleteLadder: (ladder) =>
        set(
          produce((state) => {
            delete state.ladders[ladder.id];
          })
        ),
    }),
    {
      name: 'ladders',
    }
  )
);
