import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Organization } from '@/lib/api/endpoints/organization'

interface OrgState {
  selectedOrg: Organization | null
  setSelectedOrg: (org: Organization | null) => void
}

export const useOrgStore = create<OrgState>()(
  persist(
    set => ({
      selectedOrg: null,
      setSelectedOrg: org => set({ selectedOrg: org }),
    }),
    {
      name: 'org-storage', // Key used in localStorage
    }
  )
)
