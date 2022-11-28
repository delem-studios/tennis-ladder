import { produce } from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import {
  MiscellaneousCreate,
  MiscellaneousType,
  Miscellaneouss,
} from '@/features/miscellaneouss';
import { uuid } from '@/lib/uuid';

export interface MiscellaneousStore {
  miscellaneouss: Miscellaneouss;
  addMiscellaneous: (newMiscellaneous: MiscellaneousCreate) => void;
  editMiscellaneous: (updatedMiscellaneous: MiscellaneousType) => void;
  deleteMiscellaneous: (miscellaneousToDelete: MiscellaneousType) => void;
}

export const useMiscellaneouss = create<MiscellaneousStore>(
  persist(
    (set) => ({
      miscellaneouss: {},
      addMiscellaneous: (newMiscellaneous) =>
        set(
          produce((state) => {
            const miscellaneousId = uuid();
            state.miscellaneouss[miscellaneousId] = {
              ...newMiscellaneous,
              id: miscellaneousId,
            };
          })
        ),
      editMiscellaneous: (updatedMiscellaneous) =>
        set(
          produce((state) => {
            state.miscellaneouss[updatedMiscellaneous.id] = updatedMiscellaneous;
          })
        ),
      deleteMiscellaneous: (miscellaneous) =>
        set(
          produce((state) => {
            delete state.miscellaneouss[miscellaneous.id];
          })
        ),
    }),
    {
      name: 'miscellaneouss',
    }
  )
);
