/**
 * React hooks for JSON-RPC 2.0 calls via TanStack Query.
 *
 * These hooks combine the RPC client with React Query for caching,
 * deduplication, background refetching, and optimistic updates.
 *
 * Usage:
 *   // Query (read)
 *   const { data: user } = useRpcQuery<UserProfile>('user.profile');
 *   const { data } = useRpcQuery<QRList>('qrcode.list', { page: 1, perPage: 15 });
 *
 *   // Composite query (server-side aggregation)
 *   const { data: dashboard } = useRpcComposite<DashboardData>('dashboard');
 *
 *   // Batch query (multiple methods in one HTTP call)
 *   const { data } = useRpcBatch([
 *     { method: 'qrcode.count' },
 *     { method: 'qrcode.scanCount' },
 *   ]);
 *
 *   // Mutation (write)
 *   const deleteMutation = useRpcMutation('qrcode.delete');
 *   deleteMutation.mutate({ id: 123 });
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import { rpc, rpcBatch, rpcComposite, RpcError, type RpcCallDef, type RpcResult } from '@/lib/api/rpc'

// ─── Query Key Factory ───────────────────────────────────────────────────────

export const rpcKeys = {
  all: ['rpc'] as const,
  method: (method: string) => ['rpc', method] as const,
  methodWithParams: (method: string, params?: Record<string, unknown>) =>
    ['rpc', method, params ?? {}] as const,
  composite: (name: string, params?: Record<string, unknown>) =>
    ['rpc', 'compose', name, params ?? {}] as const,
  batch: (methods: string[]) => ['rpc', 'batch', methods.sort().join(',')] as const,
}

// ─── useRpcQuery ─────────────────────────────────────────────────────────────

/**
 * Execute a single RPC method as a TanStack query.
 * Automatically caches, deduplicates, and refetches.
 */
export function useRpcQuery<T = unknown>(
  method: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<T, RpcError>, 'queryKey' | 'queryFn'> & {
    /** Use the public (no-auth) endpoint */
    public?: boolean
  }
) {
  const { public: isPublic, ...queryOptions } = options ?? {}

  return useQuery<T, RpcError>({
    queryKey: rpcKeys.methodWithParams(method, params),
    queryFn: ({ signal }) =>
      rpc<T>(method, params ?? {}, {
        public: isPublic,
        skipDedup: true, // React Query handles dedup
        signal,
      }),
    ...queryOptions,
  })
}

// ─── useRpcComposite ─────────────────────────────────────────────────────────

/**
 * Execute a composite RPC method (server-side aggregation).
 * e.g., useRpcComposite('dashboard') → compose.dashboard
 */
export function useRpcComposite<T = unknown>(
  name: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<T, RpcError>, 'queryKey' | 'queryFn'> & {
    public?: boolean
  }
) {
  const { public: isPublic, ...queryOptions } = options ?? {}

  return useQuery<T, RpcError>({
    queryKey: rpcKeys.composite(name, params),
    queryFn: ({ signal }) =>
      rpcComposite<T>(name, params ?? {}, {
        public: isPublic,
        signal,
      }),
    ...queryOptions,
  })
}

// ─── useRpcBatch ─────────────────────────────────────────────────────────────

/**
 * Execute multiple RPC calls in a single HTTP request.
 * Returns a Map<method, RpcResult> so each result can be accessed by method name.
 */
export function useRpcBatch(
  calls: RpcCallDef[],
  options?: Omit<UseQueryOptions<Map<string, RpcResult>, RpcError>, 'queryKey' | 'queryFn'> & {
    public?: boolean
  }
) {
  const { public: isPublic, ...queryOptions } = options ?? {}
  const methods = calls.map(c => c.method)

  return useQuery<Map<string, RpcResult>, RpcError>({
    queryKey: rpcKeys.batch(methods),
    queryFn: ({ signal }) =>
      rpcBatch(calls, { public: isPublic, signal }),
    ...queryOptions,
  })
}

// ─── useRpcMutation ──────────────────────────────────────────────────────────

/**
 * Execute an RPC method as a mutation (for write operations).
 *
 * Usage:
 *   const del = useRpcMutation('qrcode.delete', {
 *     onSuccess: () => queryClient.invalidateQueries({ queryKey: rpcKeys.method('qrcode.list') }),
 *   });
 *   del.mutate({ id: 123 });
 */
export function useRpcMutation<TResult = unknown, TParams = Record<string, unknown>>(
  method: string,
  options?: Omit<UseMutationOptions<TResult, RpcError, TParams>, 'mutationFn'> & {
    /** Invalidate these RPC method caches on success */
    invalidates?: string[]
  }
) {
  const queryClient = useQueryClient()
  const { invalidates, ...mutationOptions } = options ?? {}

  return useMutation<TResult, RpcError, TParams>({
    mutationFn: (params) =>
      rpc<TResult>(method, params as Record<string, unknown>),
    ...mutationOptions,
    onSuccess: (data, variables, context) => {
      // Auto-invalidate related queries
      if (invalidates?.length) {
        for (const m of invalidates) {
          queryClient.invalidateQueries({ queryKey: rpcKeys.method(m) })
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mutationOptions?.onSuccess as ((...args: any[]) => unknown) | undefined)?.(data, variables, context)
    },
  })
}

// ─── Utility: Invalidate all RPC queries ─────────────────────────────────────

/**
 * Invalidate all RPC query caches. Call on logout or user switch.
 */
export function useRpcInvalidateAll() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: rpcKeys.all })
}
