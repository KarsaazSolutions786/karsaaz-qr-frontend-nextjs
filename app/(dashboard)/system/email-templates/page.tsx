'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { emailTemplatesAPI, EmailTemplate } from '@/lib/api/endpoints/email-templates'

export default function EmailTemplatesPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')
  const [previewMode, setPreviewMode] = useState(false)

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['system', 'email-templates'],
    queryFn: emailTemplatesAPI.list,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EmailTemplate> }) =>
      emailTemplatesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'email-templates'] })
      setEditingId(null)
    },
  })

  const startEditing = (template: EmailTemplate) => {
    setEditingId(template.id)
    setEditSubject(template.subject)
    setEditBody(template.html_body)
    setPreviewMode(false)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-gray-100">Email Templates</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold dark:text-gray-100 mb-4">Email Templates</h1>
        <Card>
          <CardContent className="p-6 text-center text-red-600 dark:text-red-400">
            Failed to load email templates. Please try again.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-gray-100">Email Templates</h1>
        <Badge variant="secondary">{templates?.length || 0} templates</Badge>
      </div>

      {(!templates || templates.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500 dark:text-gray-400">
            No email templates found.
          </CardContent>
        </Card>
      )}

      {editingId !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Edit Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm dark:text-gray-100"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HTML Body</label>
                <Button size="sm" variant="ghost" onClick={() => setPreviewMode(!previewMode)}>
                  {previewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
              {previewMode ? (
                <div
                  className="w-full min-h-[200px] rounded-md border border-gray-300 dark:border-gray-600 bg-white p-4 text-sm"
                  dangerouslySetInnerHTML={{ __html: editBody }}
                />
              ) : (
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={10}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm font-mono dark:text-gray-100"
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => updateMutation.mutate({ id: editingId, data: { subject: editSubject, html_body: editBody } })}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{template.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Subject: {template.subject}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Last modified: {new Date(template.updated_at).toLocaleDateString()}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => startEditing(template)}>
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
