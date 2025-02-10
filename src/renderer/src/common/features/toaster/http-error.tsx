import type { ToastContentProps } from 'react-toastify'

import { Button } from '@renderer/common/components/ui/button'
import { Clipboard, Repeat, X } from 'lucide-react'

interface HttpErrorToastOptions {
  title: string
  refetch: VoidFunction
  details?: string
}
export const HttpErrorToast = ({ closeToast, data }: ToastContentProps<HttpErrorToastOptions>) => {
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
            <Clipboard className="btn-icon !mx-auto" />
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          onClick={refetch}
        >
          <Repeat className="btn-icon !mx-auto" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeToast}
        >
          <X className="btn-icon !mx-auto" />
        </Button>
      </div>
    </div>
  )
}
