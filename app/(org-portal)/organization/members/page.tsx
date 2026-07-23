'use client'

import React, { useEffect, useState } from 'react'
import { useOrganization } from '@/lib/context/OrganizationContext'
import api from '@/lib/api/client'
import { toast } from 'sonner'
import { UserPlusIcon } from '@heroicons/react/20/solid'

export default function OrganizationMembers() {
  const { activeOrganization } = useOrganization()
  const [memberships, setMemberships] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)

  const fetchMembers = async () => {
    if (!activeOrganization) return
    try {
      setIsLoading(true)
      const res = await api.get(`/organizations/${activeOrganization.slug}/members`)
      setMemberships(res.data.memberships?.data || [])
    } catch (error) {
      toast.error('Failed to load members')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [activeOrganization])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail || !activeOrganization) return

    setIsInviting(true)
    try {
      // Role ID 3 = Viewer (assuming 1=Owner, 2=Admin, 3=Viewer/Member)
      await api.post(`/organizations/${activeOrganization.slug}/members`, {
        email: inviteEmail,
        role_id: 3 
      })
      toast.success('Invitation sent successfully')
      setInviteEmail('')
      fetchMembers()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send invitation')
    } finally {
      setIsInviting(false)
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Members</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your organization including their name, title, email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="block w-64 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              disabled={isInviting}
              className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              <UserPlusIcon className="h-5 w-5 inline-block mr-1" />
              Invite
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                        Loading members...
                      </td>
                    </tr>
                  ) : memberships.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-gray-500">
                        No members found
                      </td>
                    </tr>
                  ) : (
                    memberships.map((membership) => (
                      <tr key={membership.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {membership.user?.name || 'Pending Invite'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {membership.user?.email || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {membership.role?.name || 'Unknown'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            membership.status === 'active' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                          }`}>
                            {membership.status}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-blue-600 hover:text-blue-900">
                            Edit<span className="sr-only">, {membership.user?.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
