import type { FieldError } from 'react-hook-form'

import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useFilter } from 'react-aria-components'

import { OperatsiiService, operatsiiQueryKeys } from '@/app/super-admin/operatsii'
import { cn } from '@/common/lib/utils'
import { type Operatsii, TypeSchetOperatsii } from '@/common/models'

import { ComboboxItem, JollyComboBox, type JollyComboBoxProps } from '../../jolly/combobox'

export const SubSchetEditor = ({
  tabIndex,
  error,
  editor = true,
  schet,
  value,
  onChange,
  className,
  ...props
}: {
  tabIndex: number
  error?: FieldError
  editor?: boolean
  schet: string
  value: string
  onChange: (value: string) => void
} & Omit<JollyComboBoxProps<Operatsii>, 'children' | 'error'>) => {
  const [inputValue, setInputValue] = useState(value)

  const { startsWith } = useFilter({
    sensitivity: 'base'
  })

  const { data: schetOptions, isFetching } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getAll,
      {
        type_schet: TypeSchetOperatsii.JUR7,
        schet
      }
    ],
    queryFn: OperatsiiService.getAll,
    enabled: !!schet
  })

  const options = schetOptions?.data ?? []
  const filteredOptions = useMemo(() => {
    return options.filter((option) => startsWith(option.schet, inputValue))
  }, [options, inputValue, startsWith])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <JollyComboBox
      items={filteredOptions}
      isDisabled={isFetching}
      className={cn('gap-0 w-32', className)}
      tabIndex={tabIndex}
      selectedKey={value}
      onSelectionChange={(key) => {
        onChange((key as string) || '')
        setInputValue((key as string) || '')
      }}
      editor={editor}
      error={!!error?.message}
      inputValue={inputValue}
      onInputChange={setInputValue}
      {...props}
    >
      {(item) => <ComboboxItem id={item.sub_schet}>{item.sub_schet}</ComboboxItem>}
    </JollyComboBox>
  )
}
