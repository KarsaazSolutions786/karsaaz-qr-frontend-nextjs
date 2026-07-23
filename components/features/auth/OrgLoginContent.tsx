'use client'

import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useLogin } from '@/lib/hooks/mutations/useLogin'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'
import Image from 'next/image'

const orgLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type OrgLoginFormData = z.infer<typeof orgLoginSchema>

export function OrgLoginContent() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrgLoginFormData>({
    resolver: zodResolver(orgLoginSchema),
  })

  const loginMutation = useLogin()

  const onSubmit = (data: OrgLoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div
      className="flex w-full flex-col rounded-[24px] bg-white/30 shadow-[0px_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-[12px] border border-white/20"
      style={{ padding: '48px 32px 32px', maxWidth: '440px' }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex items-center justify-center">
          <Image
            src="/images/auth/karsaaz-logo.svg"
            alt="Karsaaz QR"
            width={160}
            height={36}
            priority
          />
        </div>
        <h2 className="text-[28px] font-bold text-white tracking-tight">{t('Organization Portal')}</h2>
        <p className="mt-2 text-sm text-white/80">{t('Sign in to manage your API access')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-white">{t('Portal Email')}</label>
          <Input
            type="email"
            placeholder={t('admin@admin.com')}
            className={`h-12 rounded-xl border-0 bg-white/90 px-4 text-[15px] font-medium text-black placeholder:text-[#888] focus-visible:ring-2 focus-visible:ring-purple-300 ${
              errors.email ? 'ring-2 ring-red-500' : ''
            }`}
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-white">{t('Password')}</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`h-12 rounded-xl border-0 bg-white/90 px-4 pr-12 text-[15px] font-medium text-black placeholder:text-[#888] focus-visible:ring-2 focus-visible:ring-purple-300 ${
                errors.password ? 'ring-2 ring-red-500' : ''
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-sm text-[#505F79] hover:text-[#172B4D]"
            >
              {showPassword ? t('Hide') : t('Show')}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="h-12 w-full rounded-full bg-[#8A51D1] text-[16px] font-semibold text-white transition-all hover:bg-[#723fb3] hover:shadow-lg disabled:opacity-70 mt-8"
        >
          {loginMutation.isPending ? t('Signing in...') : t('Sign in')}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-white/90">
          {t('Don\'t have an organization yet? ')}
          <Link
            href="/signup?intent=organization"
            className="font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white transition-all"
          >
            {t('Create one')}
          </Link>
        </p>
      </div>
    </div>
  )
}
