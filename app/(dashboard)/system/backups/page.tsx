'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { backupsAPI } from '@/lib/api/endpoints/backups'

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  in_progress: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  failed: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
}

export default function BackupsPage() {
  const queryClient = useQueryClient()

  const { data: backups, isLoading, error } = useQuery({
    queryKey: ['system', 'backups'],
    queryFn: backupsAPI.list,
  })

  const createMutation = useMutation({
    mutationFn: backupsAPI.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system', 'backups'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: backupsAPI.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system', 'backups'] }),
  })

  const downloadMutation = useMutation({
    mutationFn: backupsAPI.download,
    onSuccess: (url) => {
      window.open(url, '_blank')
    },
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-gray-100">Backup Management</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold dark:text-gray-100 mb-4">Backup Management</h1>
        <Card>
          <CardContent className="p-6 text-center text-red-600 dark:text-red-400">
            Failed to load backups. Please try again.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold dark:text-gray-100">Backup Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => createMutation.mutate('full')}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Full Backup'}
          </Button>
          <Button
            variant="outline"
            onClick={() => createMutation.mutate('db-only')}
            disabled={createMutation.isPending}
          >
            DB-Only Backup
          </Button>
        </div>
      </div>

      {(!backups || backups.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500 dark:text-gray-400">
            No backups found. Create your first backup.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {backups?.map((backup) => (
          <Card key={backup.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{backup.filename}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[backup.status]}`}>
                      {backup.status.replace('_', ' ')}
                    </span>
                    <Badge variant="outline">{backup.type}</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
                    <span>Size: {backup.size}</span>
                    <span>Created: {new Date(backup.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {backup.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadMutation.mutate(backup.id)}
                      disabled={downloadMutation.isPending}
                    >
                      Download
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => { if (confirm('Delete this backup?')) deleteMutation.mutate(backup.id) }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
