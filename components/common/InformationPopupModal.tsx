'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

interface InformationPopupModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  linkUrl?: string
  linkText?: string
}

export function InformationPopupModal({
  isOpen,
  onClose,
  title,
  message,
  linkUrl,
  linkText,
}: InformationPopupModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <InformationCircleIcon className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center">
          {linkUrl && (
            <Button asChild variant="outline">
              <a href={linkUrl} target="_blank" rel="noopener noreferrer">
                {linkText || 'Learn More'}
              </a>
            </Button>
          )}
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
