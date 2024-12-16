import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

import { cn } from '@/common/lib/utils'
import { CircleCheck } from 'lucide-react'
import { Button } from '@/common/components/ui/button'
import { LoadingSpinner } from '@/common/components'

type DetailsPageProps = HTMLAttributes<HTMLElement> & {
  loading: boolean
}
const DetailsPage = ({ children, className, loading, ...props }: DetailsPageProps) => {
  return (
    <div {...props} className={cn('h-full relative flex flex-col', className)}>
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="h-full pb-20">{children}</div>
      )}
    </div>
  )
}

const DetailsPageFooter = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      {...props}
      className={cn('w-full fixed bottom-0 p-5 z-10 border-t border-slate-200 bg-white', className)}
    >
      {children}
    </div>
  )
}

const DetailsPageCreateBtn = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button {...props}>
      <CircleCheck className="btn-icon icon-start" /> Сохранить
    </Button>
  )
}

export { DetailsPage, DetailsPageFooter, DetailsPageCreateBtn }
