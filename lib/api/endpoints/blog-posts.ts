import apiClient from '../client'
import type {
  BlogPost,
  BlogPostListResponse,
  CreateBlogPostRequest,
} from '@/types/entities/blog-post'

export const blogPostsAPI = {
  // Get all blog posts
  getAll: async (params?: { page?: number; search?: string }) => {
    const response = await apiClient.get<BlogPostListResponse>('/blog-posts', { params })
    return response.data
  },

  // Get single blog post
  getById: async (id: number) => {
    const response = await apiClient.get<BlogPost>(`/blog-posts/${id}`)
    return response.data
  },

  // Create new blog post
  create: async (data: CreateBlogPostRequest) => {
    const response = await apiClient.post<BlogPost>('/blog-posts', data)
    return response.data
  },

  // Update blog post
  update: async (id: number, data: Partial<CreateBlogPostRequest>) => {
    const response = await apiClient.put<BlogPost>(`/blog-posts/${id}`, data)
    return response.data
  },

  // Delete blog post
  delete: async (id: number) => {
    await apiClient.delete(`/blog-posts/${id}`)
  },

  // Upload featured image
  uploadImage: async (id: number, file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    const response = await apiClient.post<BlogPost>(
      `/blog-posts/${id}/upload-featured-image`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },
}
