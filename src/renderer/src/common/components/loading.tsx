import { cn } from '@/common/lib/utils'

export const LoadingSpinner = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        'size-8 border-4 border-brand border-r-transparent rounded-full animate-spin',
        props.className
      )}
    ></div>
  )
}
