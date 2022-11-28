import { produce } from 'immer';
import create from 'zustand';
import { persist } from 'zustand/middleware';

import {
  OrganizationsCreate,
  OrganizationsType,
  Organizationss,
} from '@/features/organizationss';
import { uuid } from '@/lib/uuid';

export interface OrganizationsStore {
  organizationss: Organizationss;
  addOrganizations: (newOrganizations: OrganizationsCreate) => void;
  editOrganizations: (updatedOrganizations: OrganizationsType) => void;
  deleteOrganizations: (organizationsToDelete: OrganizationsType) => void;
}

export const useOrganizationss = create<OrganizationsStore>(
  persist(
    (set) => ({
      organizationss: {},
      addOrganizations: (newOrganizations) =>
        set(
          produce((state) => {
            const organizationsId = uuid();
            state.organizationss[organizationsId] = {
              ...newOrganizations,
              id: organizationsId,
            };
          })
        ),
      editOrganizations: (updatedOrganizations) =>
        set(
          produce((state) => {
            state.organizationss[updatedOrganizations.id] = updatedOrganizations;
          })
        ),
      deleteOrganizations: (organizations) =>
        set(
          produce((state) => {
            delete state.organizationss[organizations.id];
          })
        ),
    }),
    {
      name: 'organizationss',
    }
  )
);
