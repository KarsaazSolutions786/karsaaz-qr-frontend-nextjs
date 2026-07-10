import { useQuery } from '@tanstack/react-query'
import { blogPostsAPI } from '@/lib/api/endpoints/blog-posts'


export function usePublicBlogPosts(params?: { page?: number }) {
  return useQuery({
    queryKey: ['public-blog-posts', params],
    queryFn: () => blogPostsAPI.getAll(params),
    staleTime: 60000, // 1 minute — public content can be cached longer
  })
}
