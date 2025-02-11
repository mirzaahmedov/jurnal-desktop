import type { ToastContentProps } from 'react-toastify'

import { Button } from '@renderer/common/components/ui/button'
import { Clipboard, Repeat, X } from 'lucide-react'
import { toast } from 'react-toastify'

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
  const { title, refetch, details } = data ?? {}

  return (
    <div className="flex items-center">
      <div>
        <h1 className="text-sm text-slate-500 font-medium">{title}</h1>
      </div>
      <div className="flex gap-1 text-slate-500">
        {details ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              window.navigator.clipboard.writeText(details)
            }}
          >
            <Clipboard className="size-4" />
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          onClick={refetch}
        >
          <Repeat className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeToast}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
