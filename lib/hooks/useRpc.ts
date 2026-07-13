import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import { rpc, rpcBatch, rpcComposite, RpcError, type RpcCallDef, type RpcResult } from '@/lib/api/rpc'


export const rpcKeys = {
  all: ['rpc'] as const,
  method: (method: string) => ['rpc', method] as const,
  methodWithParams: (method: string, params?: Record<string, unknown>) =>
    ['rpc', method, params ?? {}] as const,
  composite: (name: string, params?: Record<string, unknown>) =>
    ['rpc', 'compose', name, params ?? {}] as const,
  batch: (methods: string[]) => ['rpc', 'batch', methods.sort().join(',')] as const,
}


export function useRpcQuery<T = unknown>(
  method: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<T, RpcError>, 'queryKey' | 'queryFn'> & {
    public?: boolean
  }
) {
  const { public: isPublic, ...queryOptions } = options ?? {}

  return useQuery<T, RpcError>({
    queryKey: rpcKeys.methodWithParams(method, params),
    queryFn: ({ signal }) =>
      rpc<T>(method, params ?? {}, {
        public: isPublic,
        skipDedup: true,
        signal,
      }),
    ...queryOptions,
  })
}

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


export function useRpcMutation<TResult = unknown, TParams = Record<string, unknown>>(
  method: string,
  options?: Omit<UseMutationOptions<TResult, RpcError, TParams>, 'mutationFn'> & {
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
      if (invalidates?.length) {
        for (const m of invalidates) {
          queryClient.invalidateQueries({ queryKey: rpcKeys.method(m) })
        }
      }
      ;(mutationOptions?.onSuccess as ((...args: any[]) => unknown) | undefined)?.(data, variables, context)
    },
  })
}

export function useRpcInvalidateAll() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: rpcKeys.all })
}
