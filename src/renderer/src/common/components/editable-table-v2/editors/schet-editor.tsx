import type { FieldError } from 'react-hook-form'

import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useFilter } from 'react-aria-components'

import {
  type OperatsiiSchetOption,
  OperatsiiService,
  operatsiiQueryKeys
} from '@/app/super-admin/operatsii'
import { AutoComplete } from '@/common/components/auto-complete'
import { ComboboxItem, type JollyComboBoxProps } from '@/common/components/jolly/combobox'
import { useEventCallback } from '@/common/hooks'
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
  const [inputValue, setInputValue] = useState(value)

  const { startsWith } = useFilter({
    sensitivity: 'base'
  })

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

  const onChangeEvent = useEventCallback(onChange)
  const filteredOptions = useMemo(() => {
    return options.filter((option) => startsWith(option.schet, inputValue))
  }, [options, inputValue, startsWith])

  useEffect(() => {
    if (isFetching) {
      return
    }
    setInputValue(value ?? '')
    onChangeEvent(value ?? '')
  }, [value, isFetching, options])

  return (
    <AutoComplete
      items={filteredOptions}
      isDisabled={isFetching}
      className={cn('gap-0 w-32', className)}
      tabIndex={tabIndex}
      selectedKey={value}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSelectionChange={(key) => {
        onChange((key as string) || '')
      }}
      editor={editor}
      error={!!error?.message}
      {...props}
    >
      {(item) => (
        <ComboboxItem id={item.schet}>
          {item.schet} ({item.schet6})
        </ComboboxItem>
      )}
    </AutoComplete>
  )
}
