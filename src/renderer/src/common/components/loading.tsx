import { cn } from '@/common/lib/utils'

export const Spinner = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        'size-8 border-4 text-brand border-current border-r-transparent rounded-full animate-spin',
        props.className
      )}
    ></div>
  )
}
