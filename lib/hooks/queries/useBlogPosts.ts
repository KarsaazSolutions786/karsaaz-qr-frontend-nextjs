import { useQuery } from '@tanstack/react-query'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'
import { queryKeys } from '@/lib/query/keys'

// Get all blog posts
/**
 * Purpose: Executes useBlogPosts functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useBlogPosts(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: queryKeys.blogPosts.list(params),
    queryFn: () => blogPostsAPI.getAll(params),
    staleTime: 30000,
  })
}

// Get single blog post
/**
 * Purpose: Executes useBlogPost functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function useBlogPost(id: number) {
  return useQuery({
    queryKey: queryKeys.blogPosts.detail(id),
    queryFn: () => blogPostsAPI.getById(id),
    enabled: !!id,
  })
}
