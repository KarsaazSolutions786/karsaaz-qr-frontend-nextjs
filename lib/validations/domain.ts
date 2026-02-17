import { z } from 'zod'

// Add domain schema
export const addDomainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .regex(
      /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i,
      'Invalid domain format (e.g., qr.example.com)'
    ),
})

export type AddDomainFormData = z.infer<typeof addDomainSchema>

// Set default domain schema
export const setDefaultDomainSchema = z.object({
  domainId: z.string().uuid('Invalid domain ID'),
})

export type SetDefaultDomainFormData = z.infer<typeof setDefaultDomainSchema>
