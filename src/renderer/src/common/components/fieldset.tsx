import { cn } from '@/common/lib/utils'

export type FieldsetProps = React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  name: string
}
export const Fieldset = ({ name, className, children, ...props }: FieldsetProps) => {
  return (
    <fieldset className={cn('flex flex-col gap-5 p-5 pb-7', className)} {...props}>
      <legend className="float-left text-xs font-bold text-slate-400">{name}</legend>
      {children}
    </fieldset>
  )
}
