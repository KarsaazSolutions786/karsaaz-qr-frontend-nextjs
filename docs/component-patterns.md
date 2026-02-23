# Component Patterns & Conventions

This project uses **shadcn/ui** components (Radix UI primitives + Tailwind CSS) located in `components/ui/`.

## Directory Structure

```
components/
├── ui/             # Base UI primitives (shadcn/ui, custom)
├── common/         # Shared composed components (modals, forms, search)
├── features/       # Feature gates, upgrade prompts
├── layout/         # Banners, notices, guides
├── analytics/      # Charts, reports, metrics
├── designer/       # QR designer, AI generator
├── qr/             # QR-specific components
├── templates/      # Template management
├── wizard/         # Multi-step wizard flow
├── seo/            # SEO components (JSON-LD, etc.)
├── public/         # Public-facing components
└── subscription/   # Subscription/billing UI
```

## Naming Conventions

- **File names**: `kebab-case.tsx` (e.g., `color-picker.tsx`, `page-heading.tsx`)
- **Component names**: `PascalCase` (e.g., `ColorPicker`, `PageHeading`)
- **Exports**: Named exports preferred, default export for main component per file

## Usage Patterns

### Import Paths

Always use the `@/` alias:

```tsx
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

### Composing with `cn()`

Use the `cn()` utility (clsx + tailwind-merge) for conditional classes:

```tsx
import { cn } from '@/lib/utils'

function MyComponent({ className, variant }: Props) {
  return (
    <div
      className={cn(
        'base-classes here',
        variant === 'primary' && 'bg-primary text-white',
        className
      )}
    >
      ...
    </div>
  )
}
```

### Extending shadcn/ui Components

When wrapping a shadcn component, forward all props and allow className override:

```tsx
import { Button, type ButtonProps } from '@/components/ui/button'

interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean
}

export function SubmitButton({ isLoading, children, ...props }: SubmitButtonProps) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  )
}
```

### Form Pattern (react-hook-form + zod)

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = methods.handleSubmit(data => {
    // mutation.mutate(data)
  })

  return (
    <form onSubmit={onSubmit}>
      <Input {...methods.register('name')} />
      {methods.formState.errors.name && (
        <p className="text-sm text-red-600">{methods.formState.errors.name.message}</p>
      )}
    </form>
  )
}
```

### Data Fetching (React Query)

```tsx
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { listDataConfig } from '@/lib/query/cache-config'

function QRCodeList() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.qrcodes.list(),
    queryFn: () => qrcodesAPI.getAll(),
    ...listDataConfig,
  })
}
```

### Accessibility

- Use `PageHeading` for semantic heading hierarchy
- Use `SrOnly` for screen-reader-only text
- Use ARIA helpers from `lib/utils/aria-helpers.ts`
- All interactive elements must have visible focus indicators (built into `globals.css`)

### Image Optimization

Use `OptimizedImage` wrapper or `next/image` directly — avoid raw `<img>` tags:

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image'

;<OptimizedImage src="/hero.png" alt="Hero" width={800} height={400} />
```

## Color System

| Token         | Hex       | Usage                        |
| ------------- | --------- | ---------------------------- |
| `primary-500` | `#8368dc` | Primary actions, links       |
| `primary-600` | `#7050c4` | Hover states                 |
| `accent`      | `#b664c6` | Secondary accent             |
| Focus ring    | `#8368dc` | All focus-visible indicators |
