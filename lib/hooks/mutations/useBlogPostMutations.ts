import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'
import { queryKeys } from '@/lib/query/keys'
import type { CreateBlogPostRequest } from '@/types/entities/blog-post'

/**
 * Purpose: Executes useCreateBlogPost functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useCreateBlogPost() {
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBlogPostRequest) => blogPostsAPI.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all() })
      // Redirect to edit page so user can upload featured image (only available after first save)
      router.push(`/blog-posts/${result.id}`)
    },
  })
}

/**
 * Purpose: Executes useUpdateBlogPost functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
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

/**
 * Purpose: Executes useDeleteBlogPost functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useDeleteBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => blogPostsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts.all() })
    },
  })
}
