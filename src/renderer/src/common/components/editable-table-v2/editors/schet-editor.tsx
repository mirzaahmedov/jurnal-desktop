import type { FieldError } from 'react-hook-form'

import { type InputHTMLAttributes, useRef } from 'react'

import { useQuery } from '@tanstack/react-query'

import { OperatsiiService, operatsiiQueryKeys } from '@/app/super-admin/operatsii'
import { AutoComplete } from '@/common/components'
import { Input } from '@/common/components/ui/input'
import { inputVariants } from '@/common/features/spravochnik'
import { TypeSchetOperatsii } from '@/common/models'

export const SchetEditor = ({
  tabIndex,
  error,
  value,
  editor = true,
  onChange,
  inputProps
}: {
  tabIndex: number
  error?: FieldError
  value: string
  editor?: boolean
  onChange: (value: string) => void
  inputProps?: InputHTMLAttributes<HTMLInputElement>
}) => {
  const changed = useRef(false)

  const { data: schetOptions, isFetching: isFetchingSchetOptions } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getSchetOptions,
      {
        type_schet: TypeSchetOperatsii.JUR7
      }
    ],
    queryFn: OperatsiiService.getSchetOptions
  })

  const options = schetOptions?.data ?? []
  const filteredOptions = options.filter((o) => o.schet?.includes((value as string) ?? '')) ?? []

  return (
    <AutoComplete
      autoSelectSingleResult={false}
      isFetching={isFetchingSchetOptions}
      options={filteredOptions}
      getOptionLabel={(option) => option.schet}
      getOptionValue={(option) => option.schet}
      onSelect={(option) => {
        changed.current = true
        onChange?.(option.schet)
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
            const exists = options.find((o) => o.schet === value)
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
