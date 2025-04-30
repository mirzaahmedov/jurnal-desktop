import type { InputHTMLAttributes } from 'react'
import type { FieldError } from 'react-hook-form'

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
  const { data: schetOptions, isFetching: isFetchingSchetOptions } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getSchetOptions,
      {
        type_schet: TypeSchetOperatsii.JUR3
      }
    ],
    queryFn: OperatsiiService.getSchetOptions
  })
  const filteredSchetOptions =
    schetOptions?.data?.filter((o) => o.schet?.includes((value as string) ?? '')) ?? []

  return (
    <AutoComplete
      autoSelectSingleResult={false}
      isFetching={isFetchingSchetOptions}
      options={filteredSchetOptions}
      getOptionLabel={(option) => option.schet}
      getOptionValue={(option) => option.schet}
      onSelect={(option) => {
        onChange?.(option.schet)
      }}
      className="border-r"
      popoverProps={{
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
          onFocus={open}
          onBlur={close}
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              close()
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={inputVariants({ editor })}
          {...inputProps}
        />
      )}
    </AutoComplete>
  )
}
