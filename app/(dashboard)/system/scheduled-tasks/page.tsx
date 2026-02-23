'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { scheduledTasksAPI } from '@/lib/api/endpoints/scheduled-tasks'

const statusColors: Record<string, string> = {
  idle: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  running: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  failed: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
}

export default function ScheduledTasksPage() {
  const queryClient = useQueryClient()

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['system', 'scheduled-tasks'],
    queryFn: scheduledTasksAPI.list,
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_enabled }: { id: number; is_enabled: boolean }) =>
      scheduledTasksAPI.update(id, { is_enabled }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system', 'scheduled-tasks'] }),
  })

  const runMutation = useMutation({
    mutationFn: scheduledTasksAPI.run,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['system', 'scheduled-tasks'] }),
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-gray-100">Scheduled Tasks</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold dark:text-gray-100 mb-4">Scheduled Tasks</h1>
        <Card>
          <CardContent className="p-6 text-center text-red-600 dark:text-red-400">
            Failed to load scheduled tasks. Please try again.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-gray-100">Scheduled Tasks</h1>
        <Badge variant="secondary">{tasks?.length || 0} tasks</Badge>
      </div>

      {(!tasks || tasks.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500 dark:text-gray-400">
            No scheduled tasks found.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {tasks?.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{task.name}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{task.schedule}</p>
                  <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500 mt-1">
                    <span>Last run: {task.last_run_at ? new Date(task.last_run_at).toLocaleString() : 'Never'}</span>
                    <span>Next run: {task.next_run_at ? new Date(task.next_run_at).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Switch
                    checked={task.is_enabled}
                    onCheckedChange={(checked) => toggleMutation.mutate({ id: task.id, is_enabled: checked })}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runMutation.mutate(task.id)}
                    disabled={runMutation.isPending || task.status === 'running'}
                  >
                    {runMutation.isPending ? 'Running...' : 'Run Now'}
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
