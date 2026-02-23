'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { queuesAPI } from '@/lib/api/endpoints/queues'

export default function QueuesPage() {
  const queryClient = useQueryClient()
  const [autoRefresh, setAutoRefresh] = useState(false)

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['system', 'queues', 'stats'],
    queryFn: queuesAPI.stats,
    refetchInterval: autoRefresh ? 5000 : false,
  })

  const { data: failedJobs, isLoading: failedLoading } = useQuery({
    queryKey: ['system', 'queues', 'failed'],
    queryFn: queuesAPI.failed,
    refetchInterval: autoRefresh ? 5000 : false,
  })

  const retryMutation = useMutation({
    mutationFn: queuesAPI.retry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'queues'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: queuesAPI.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system', 'queues'] })
    },
  })

  if (statsLoading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold dark:text-gray-100">Queue Monitor</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold dark:text-gray-100 mb-4">Queue Monitor</h1>
        <Card>
          <CardContent className="p-6 text-center text-red-600 dark:text-red-400">
            Failed to load queue stats. Please try again.
          </CardContent>
        </Card>
      </div>
    )
  }

  const statCards = [
    { label: 'Pending', value: stats?.pending ?? 0, color: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Processing', value: stats?.processing ?? 0, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Failed', value: stats?.failed ?? 0, color: 'text-red-600 dark:text-red-400' },
    { label: 'Completed', value: stats?.completed ?? 0, color: 'text-green-600 dark:text-green-400' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-gray-100">Queue Monitor</h1>
        <div className="flex items-center gap-3">
          <Switch
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
            label="Auto-refresh"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Failed Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Failed Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {failedLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          )}
          {!failedLoading && (!failedJobs || failedJobs.length === 0) && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No failed jobs. Everything is running smoothly!
            </p>
          )}
          {failedJobs && failedJobs.length > 0 && (
            <div className="space-y-3">
              {failedJobs.map((job) => (
                <div key={job.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{job.queue}</Badge>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(job.failed_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 font-mono truncate">
                        {job.exception.split('\n')[0]}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryMutation.mutate(job.id)}
                        disabled={retryMutation.isPending}
                      >
                        Retry
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => { if (confirm('Delete this failed job?')) deleteMutation.mutate(job.id) }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
