import type { FieldError } from 'react-hook-form'

import { type InputHTMLAttributes, useRef } from 'react'

import { useQuery } from '@tanstack/react-query'

import { OperatsiiService, operatsiiQueryKeys } from '@/app/super-admin/operatsii'
import { AutoComplete } from '@/common/components'
import { Input } from '@/common/components/ui/input'
import { inputVariants } from '@/common/features/spravochnik'
import { TypeSchetOperatsii } from '@/common/models'

export const SubSchetEditor = ({
  tabIndex,
  error,
  editor = true,
  schet,
  value,
  onChange,
  inputProps
}: {
  tabIndex: number
  error?: FieldError
  editor?: boolean
  schet: string
  value: string
  onChange: (value: string) => void
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}) => {
  const changed = useRef(false)

  const { data: subSchetOptions, isFetching: isFetchingSubSchetOptions } = useQuery({
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

  const options = subSchetOptions?.data ?? []
  const filteredOptions = options.filter((o) => o.sub_schet?.includes(value ?? '')) ?? []

  return (
    <AutoComplete
      autoSelectSingleResult={false}
      isFetching={isFetchingSubSchetOptions}
      options={filteredOptions}
      getOptionLabel={(option) => option.sub_schet}
      getOptionValue={(option) => option.sub_schet}
      onSelect={(option) => {
        changed.current = true
        onChange?.(option.sub_schet)
      }}
      className="border-r"
      popoverProps={{
        className: 'w-64',
        onOpenAutoFocus: (e) => e.preventDefault(),
        onCloseAutoFocus: (e) => e.preventDefault()
      }}
    >
      {({ open, close }) => (
        <Input
          type="text"
          tabIndex={tabIndex}
          error={!!error}
          name="kredit_schet"
          onFocus={() => {
            changed.current = false
            open()
          }}
          onBlur={() => {
            const exists = filteredOptions.find((o) => o.sub_schet === value)
            if (!exists && changed.current) {
              onChange?.('')
            }
            close()
          }}
          value={value}
          onChange={(e) => {
            changed.current = true
            onChange?.(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              close()
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={inputVariants({ editor, error: !!error })}
          {...inputProps}
        />
      )}
    </AutoComplete>
  )
}
