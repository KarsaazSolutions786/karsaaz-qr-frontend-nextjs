import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'
import { queryKeys } from '@/lib/query/keys'
import type { CreateBlogPostRequest } from '@/types/entities/blog-post'

export function useCreateBlogPost() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBlogPostRequest) => blogPostsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all() })
      router.push('/blog-posts')
    },
  })
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateBlogPostRequest> }) =>
      blogPostsAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.detail(variables.id) })
    },
  })
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => blogPostsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all() })
    },
  })
}
