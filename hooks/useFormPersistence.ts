'use client'

import { useEffect, useCallback, useRef } from 'react'
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form'

interface UseFormPersistenceOptions<T extends FieldValues> {
  /** Unique key for localStorage (e.g., 'create-qr-form') */
  formKey: string
  /** react-hook-form methods object */
  methods: UseFormReturn<T>
  /** Fields to exclude from persistence (e.g., passwords) */
  exclude?: Path<T>[]
  /** Debounce delay in ms (default: 500) */
  debounceMs?: number
}

/**
 * Persist form state to localStorage so in-progress forms survive page reloads.
 * Automatically restores on mount and clears on successful submit.
 *
 * @example
 * const methods = useForm<CreateQRForm>()
 * const { clear } = useFormPersistence({ formKey: 'create-qr', methods })
 * // Call clear() after successful submission
 */
export function useFormPersistence<T extends FieldValues>({
  formKey,
  methods,
  exclude = [],
  debounceMs = 500,
}: UseFormPersistenceOptions<T>) {
  const storageKey = `form-persist:${formKey}`
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Restore on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      const parsed = JSON.parse(saved) as Partial<T>
      const excludeSet = new Set(exclude as string[])

      for (const [key, value] of Object.entries(parsed)) {
        if (!excludeSet.has(key)) {
          methods.setValue(key as Path<T>, value as any, { shouldValidate: false })
        }
      }
    } catch {
      // Corrupted data — clear it
      localStorage.removeItem(storageKey)
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  // Watch and persist with debounce
  useEffect(() => {
    const subscription = methods.watch(values => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        try {
          const excludeSet = new Set(exclude as string[])
          const filtered = Object.fromEntries(
            Object.entries(values).filter(([key]) => !excludeSet.has(key))
          )
          localStorage.setItem(storageKey, JSON.stringify(filtered))
        } catch {
          // localStorage full or unavailable — ignore
        }
      }, debounceMs)
    })

    return () => {
      subscription.unsubscribe()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [methods, storageKey, exclude, debounceMs])

  /** Clear persisted data (call after successful submit) */
  const clear = useCallback(() => {
    localStorage.removeItem(storageKey)
  }, [storageKey])

  return { clear }
}

export default useFormPersistence
