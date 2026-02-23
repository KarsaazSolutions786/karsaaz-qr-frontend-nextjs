'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  auth: boolean
}

interface ApiResource {
  name: string
  endpoints: ApiEndpoint[]
}

const methodColors: Record<string, string> = {
  GET: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  POST: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  PUT: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  DELETE: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
}

const apiResources: ApiResource[] = [
  {
    name: 'QR Codes',
    endpoints: [
      { method: 'GET', path: '/api/qrcodes', description: 'List all QR codes', auth: true },
      { method: 'GET', path: '/api/qrcodes/{id}', description: 'Get a single QR code', auth: true },
      { method: 'POST', path: '/api/qrcodes', description: 'Create a new QR code', auth: true },
      { method: 'PUT', path: '/api/qrcodes/{id}', description: 'Update a QR code', auth: true },
      { method: 'DELETE', path: '/api/qrcodes/{id}', description: 'Delete a QR code', auth: true },
      { method: 'GET', path: '/api/qrcodes/{id}/scans', description: 'Get scan analytics for a QR code', auth: true },
    ],
  },
  {
    name: 'Users',
    endpoints: [
      { method: 'GET', path: '/api/users', description: 'List all users (admin)', auth: true },
      { method: 'GET', path: '/api/users/{id}', description: 'Get user details', auth: true },
      { method: 'POST', path: '/api/users', description: 'Create a new user (admin)', auth: true },
      { method: 'PUT', path: '/api/users/{id}', description: 'Update a user', auth: true },
      { method: 'DELETE', path: '/api/users/{id}', description: 'Delete a user (admin)', auth: true },
      { method: 'GET', path: '/api/myself', description: 'Get current authenticated user', auth: true },
    ],
  },
  {
    name: 'Plans & Subscriptions',
    endpoints: [
      { method: 'GET', path: '/api/plans', description: 'List available subscription plans', auth: false },
      { method: 'GET', path: '/api/plans/{id}', description: 'Get plan details', auth: false },
      { method: 'POST', path: '/api/subscriptions', description: 'Create a subscription', auth: true },
      { method: 'PUT', path: '/api/subscriptions/{id}', description: 'Update a subscription', auth: true },
      { method: 'DELETE', path: '/api/subscriptions/{id}', description: 'Cancel a subscription', auth: true },
    ],
  },
  {
    name: 'Authentication',
    endpoints: [
      { method: 'POST', path: '/api/login', description: 'Login and receive access token', auth: false },
      { method: 'POST', path: '/api/register', description: 'Register a new account', auth: false },
      { method: 'POST', path: '/api/logout', description: 'Logout and invalidate token', auth: true },
      { method: 'POST', path: '/api/forgot-password', description: 'Request password reset email', auth: false },
      { method: 'POST', path: '/api/reset-password', description: 'Reset password with token', auth: false },
    ],
  },
  {
    name: 'Folders',
    endpoints: [
      { method: 'GET', path: '/api/folders', description: 'List all folders', auth: true },
      { method: 'POST', path: '/api/folders', description: 'Create a new folder', auth: true },
      { method: 'PUT', path: '/api/folders/{id}', description: 'Update a folder', auth: true },
      { method: 'DELETE', path: '/api/folders/{id}', description: 'Delete a folder', auth: true },
    ],
  },
  {
    name: 'System (Admin)',
    endpoints: [
      { method: 'GET', path: '/api/system/status', description: 'Get system health status', auth: true },
      { method: 'GET', path: '/api/system/configs', description: 'Get system configuration', auth: true },
      { method: 'POST', path: '/api/system/configs', description: 'Update system configuration', auth: true },
      { method: 'GET', path: '/api/system/logs', description: 'Get system logs', auth: true },
      { method: 'POST', path: '/api/system/cache/clear', description: 'Clear system cache', auth: true },
      { method: 'GET', path: '/api/system/email-templates', description: 'List email templates', auth: true },
      { method: 'PUT', path: '/api/system/email-templates/{id}', description: 'Update an email template', auth: true },
      { method: 'GET', path: '/api/system/webhooks', description: 'List webhooks', auth: true },
      { method: 'POST', path: '/api/system/webhooks', description: 'Create a webhook', auth: true },
      { method: 'GET', path: '/api/system/scheduled-tasks', description: 'List scheduled tasks', auth: true },
      { method: 'GET', path: '/api/system/queues/stats', description: 'Get queue statistics', auth: true },
      { method: 'GET', path: '/api/system/backups', description: 'List backups', auth: true },
      { method: 'POST', path: '/api/system/backups/create', description: 'Create a backup', auth: true },
    ],
  },
]

export default function ApiDocsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-gray-100">API Documentation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          REST API endpoint reference. All endpoints use JSON request/response bodies.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Base URL</h3>
          <code className="text-sm bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 font-mono text-gray-800 dark:text-gray-200">
            {typeof window !== 'undefined' ? window.location.origin : 'https://app.karsaazqr.com'}
          </code>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2">Authentication</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Include the access token in the <code className="bg-gray-100 dark:bg-gray-700 rounded px-1 font-mono text-xs">Authorization</code> header:
          </p>
          <code className="block mt-1 text-sm bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 font-mono text-gray-800 dark:text-gray-200">
            Authorization: Bearer {'<token>'}
          </code>
        </CardContent>
      </Card>

      {apiResources.map((resource) => (
        <Card key={resource.name}>
          <CardHeader>
            <CardTitle className="text-lg">{resource.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resource.endpoints.map((endpoint, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 dark:border-gray-700 px-3 py-2"
                >
                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${methodColors[endpoint.method]}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-gray-800 dark:text-gray-200 flex-1 min-w-0 truncate">
                    {endpoint.path}
                  </code>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block flex-shrink-0">
                    {endpoint.description}
                  </span>
                  {endpoint.auth && (
                    <Badge variant="outline" className="shrink-0 text-[10px]">Auth</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
