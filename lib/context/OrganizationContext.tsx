'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api/client'
import { useAuth } from './AuthContext'

export interface Organization {
  id: number
  public_id: string
  name: string
  slug: string
  company_size?: string
  industry?: string
  branding_logo?: string
  branding_primary_color?: string
}

export interface OrganizationMembership {
  id: number
  organization_id: number
  organization_role_id: number
  status: string
  role?: {
    id: number
    name: string
    is_system: boolean
  }
}

interface OrganizationContextType {
  activeOrganization: Organization | null
  activeMembership: OrganizationMembership | null
  organizations: (Organization & { pivot: OrganizationMembership })[]
  isLoading: boolean
  setActiveOrganization: (org: Organization | null) => void
  refreshOrganizations: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState<(Organization & { pivot: OrganizationMembership })[]>([])
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null)
  const [activeMembership, setActiveMembership] = useState<OrganizationMembership | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchedUserId, setFetchedUserId] = useState<number | null>(null)

  const isActuallyLoading = isLoading || (user ? fetchedUserId !== user.id : false)

  const refreshOrganizations = async () => {
    if (!user) {
      setOrganizations([])
      setActiveOrganization(null)
      setActiveMembership(null)
      setFetchedUserId(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const res = await api.get('/organizations')
      const orgs = res.data?.organizations || []
      setOrganizations(orgs)

      // Automatically select the first active org if none is selected, or if the selected one is missing
      if (orgs.length > 0) {
        const storedSlug = localStorage.getItem('karsaaz_active_org_slug')
        const matched = orgs.find((o: any) => o.slug === storedSlug)
        
        if (matched) {
          setActiveOrganization(matched)
          setActiveMembership(matched.pivot)
        } else {
          setActiveOrganization(orgs[0])
          setActiveMembership(orgs[0].pivot)
          localStorage.setItem('karsaaz_active_org_slug', orgs[0].slug)
          localStorage.setItem('active_organization_id', String(orgs[0].id))
        }
      } else {
        setActiveOrganization(null)
        setActiveMembership(null)
        localStorage.removeItem('karsaaz_active_org_slug')
        localStorage.removeItem('active_organization_id')
      }
      
      setFetchedUserId(Number(user.id))
    } catch (error) {
      console.error('Failed to load organizations', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshOrganizations()
  }, [user])

  // Sync selection to localStorage
  useEffect(() => {
    if (activeOrganization) {
      localStorage.setItem('karsaaz_active_org_slug', activeOrganization.slug)
      localStorage.setItem('active_organization_id', String(activeOrganization.id))
    } else {
      localStorage.removeItem('karsaaz_active_org_slug')
      localStorage.removeItem('active_organization_id')
    }
  }, [activeOrganization])

  return (
    <OrganizationContext.Provider
      value={{
        activeOrganization,
        activeMembership,
        organizations,
        isLoading: isActuallyLoading,
        setActiveOrganization,
        refreshOrganizations,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
