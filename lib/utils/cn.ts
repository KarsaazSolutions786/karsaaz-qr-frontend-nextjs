import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Purpose: Executes cn functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
