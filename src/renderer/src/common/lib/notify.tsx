import type { ToastContentProps } from 'react-toastify'

import { useState } from 'react'

import { ClipboardCheck, ClipboardPlus, Send, X } from 'lucide-react'
import { toast } from 'react-toastify'

import { Button } from '@/common/components/ui/button'

import { useFeedbackModalState } from '../features/feedback/store'

export interface NotifyOptions {
  title: string
  variant?: 'error' | 'success' | 'info'
  refetch?: VoidFunction
  details?: string
}
export const notify = ({ variant = 'info', title, refetch, details }: NotifyOptions) => {
  switch (variant) {
    case 'info':
      toast.info(title)
      break
    case 'success':
      toast.success(title)
      break
    case 'error':
      toast.error(ErrorToastContent, {
        closeButton: false,
        data: {
          title,
          refetch,
          details
        }
      })
      break
    default:
      toast(title)
  }
}

interface ErrorToastContentOptions {
  title: string
  refetch?: VoidFunction
  details?: string
}
export const ErrorToastContent = ({
  closeToast,
  data
}: ToastContentProps<ErrorToastContentOptions>) => {
  const { title, details } = data ?? {}

  return (
    <div className="w-full flex items-center justify-between gap-2">
      <div className="flex-1">
        <h1 className="text-sm text-slate-500 font-medium">{title}</h1>
      </div>
      <div className="flex gap-1 text-slate-500">
        {details ? <CopyButton details={details} /> : null}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            useFeedbackModalState.getState().open(details || '{}')
          }}
        >
          <Send className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => closeToast()}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}

const CopyButton = ({ details }: { details: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    window.navigator.clipboard.writeText(details!)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
    >
      {copied ? (
        <ClipboardCheck className="size-5 text-brand" />
      ) : (
        <ClipboardPlus className="size-5" />
      )}
    </Button>
  )
}
