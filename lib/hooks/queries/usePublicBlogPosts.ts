import { useQuery } from '@tanstack/react-query'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'

/**
 * Purpose: T241: Query hook for fetching public (published) blog posts. Used on the public-facing blog landing page.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function usePublicBlogPosts(params?: { page?: number }) {
  return useQuery({
    queryKey: ['public-blog-posts', params],
    queryFn: () => blogPostsAPI.getAll(params),
    staleTime: 60000, // 1 minute — public content can be cached longer
  })
}
