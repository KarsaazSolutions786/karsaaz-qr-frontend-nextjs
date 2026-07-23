'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useOrganization } from '@/lib/context/OrganizationContext'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, BuildingOfficeIcon, UserIcon } from '@heroicons/react/20/solid'

export function OrganizationSwitcher() {
  const router = useRouter()
  const { activeOrganization, organizations, setActiveOrganization } = useOrganization()

  const handleSwitchToPersonal = () => {
    router.push('/qrcodes/new')
    setTimeout(() => {
      setActiveOrganization(null)
    }, 150)
  }

  const handleSwitchToOrganization = (org: any) => {
    setActiveOrganization(org)
    router.push('/organization/dashboard')
  }

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {activeOrganization ? (
            <>
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              {activeOrganization.name}
            </>
          ) : (
            <>
              <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              Personal Workspace
            </>
          )}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSwitchToPersonal}
                  className={`
                    ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                    ${!activeOrganization ? 'bg-blue-50 text-blue-700' : ''}
                    group flex w-full items-center px-4 py-2 text-sm
                  `}
                >
                  <UserIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Personal Workspace
                </button>
              )}
            </Menu.Item>

            {organizations.length > 0 && (
              <div className="border-t border-gray-100 my-1 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Organizations
              </div>
            )}

            {organizations.map((org) => (
              <Menu.Item key={org.id}>
                {({ active }) => (
                  <button
                    onClick={() => handleSwitchToOrganization(org)}
                    className={`
                      ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                      ${activeOrganization?.id === org.id ? 'bg-blue-50 text-blue-700' : ''}
                      group flex w-full items-center px-4 py-2 text-sm
                    `}
                  >
                    <BuildingOfficeIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                    {org.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
