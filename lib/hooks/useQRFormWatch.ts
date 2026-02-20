/**
 * useQRFormWatch
 *
 * Wraps react-hook-form's `watch` to emit real-time data changes to a parent
 * callback. All QR data-entry forms use this hook so the wizard always has
 * the latest field values for the live preview — without requiring an explicit
 * form submission.
 *
 * Usage:
 *   const form = useQRFormWatch({ schema, defaultValues, onChange })
 *   // Use form.register, form.formState, etc. as normal.
 *   // onChange is called instantly on every field change.
 */

import { useEffect } from 'react'
import {
  useForm,
  UseFormProps,
  FieldValues,
  DefaultValues,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodType } from 'zod'

interface UseQRFormWatchOptions<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<T, any, any>
  defaultValues?: DefaultValues<T>
  onChange?: (data: Partial<T>) => void
  formOptions?: Omit<UseFormProps<T>, 'resolver' | 'defaultValues'>
}

export function useQRFormWatch<T extends FieldValues>({
  schema,
  defaultValues,
  onChange,
  formOptions = {},
}: UseQRFormWatchOptions<T>) {
  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: 'onChange',
    ...formOptions,
  })

  useEffect(() => {
    // Emit defaultValues on mount so parent has initial state
    if (onChange && defaultValues) {
      onChange(defaultValues as Partial<T>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!onChange) return

    const subscription = form.watch((values) => {
      onChange(values as Partial<T>)
    })

    return () => subscription.unsubscribe()
  }, [form, onChange])

  return form
}
