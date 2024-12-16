import type { FieldsetProps } from '@/common/components'
import type { PropsWithChildren } from 'react'
import { Fieldset } from '@/common/components'

type SpravochnikFieldsProps = PropsWithChildren<
  {
    name: string
  } & Omit<FieldsetProps, 'name'>
>
const SpravochnikFields = ({ name, children, ...props }: SpravochnikFieldsProps) => {
  return (
    <Fieldset {...props} name={name}>
      {children}
    </Fieldset>
  )
}

export { SpravochnikFields }
