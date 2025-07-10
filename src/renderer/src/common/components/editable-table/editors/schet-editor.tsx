import type { FieldError } from 'react-hook-form'

import { useQuery } from '@tanstack/react-query'

import {
  type OperatsiiSchetOption,
  OperatsiiService,
  operatsiiQueryKeys
} from '@/app/super-admin/operatsii'
import {
  ComboboxItem,
  JollyComboBox,
  type JollyComboBoxProps
} from '@/common/components/jolly/combobox'
import { cn } from '@/common/lib/utils'
import { TypeSchetOperatsii } from '@/common/models'

export interface SchetEditorProps
  extends Omit<JollyComboBoxProps<OperatsiiSchetOption>, 'children' | 'error'> {
  tabIndex: number
  value: string
  error: FieldError | undefined
  onChange: (value: string) => void
}
export const SchetEditor = ({
  tabIndex,
  error,
  value,
  editor = true,
  className,
  onChange,
  ...props
}: SchetEditorProps) => {
  const { data: schetOptions, isFetching } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getSchetOptions,
      {
        type_schet: TypeSchetOperatsii.JUR7
      }
    ],
    queryFn: OperatsiiService.getSchetOptions
  })

  const options = schetOptions?.data ?? []

  return (
    <JollyComboBox
      defaultItems={options}
      isDisabled={isFetching}
      menuTrigger="focus"
      className={cn('gap-0', className)}
      tabIndex={tabIndex}
      selectedKey={value}
      onSelectionChange={(key) => onChange((key as string) || '')}
      editor={editor}
      error={!!error?.message}
      {...props}
    >
      {(item) => (
        <ComboboxItem id={item.schet}>
          {item.schet} ({item.schet6})
        </ComboboxItem>
      )}
    </JollyComboBox>
  )
}
