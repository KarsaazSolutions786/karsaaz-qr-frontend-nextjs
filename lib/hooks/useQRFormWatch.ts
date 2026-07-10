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
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: 'onChange',
    ...formOptions,
  })

  useEffect(() => {
    if (onChange && defaultValues) {
      onChange(defaultValues as Partial<T>)
    }
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
