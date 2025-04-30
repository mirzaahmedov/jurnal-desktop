import type { InputHTMLAttributes } from 'react'
import type { FieldError } from 'react-hook-form'

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
  const filteredSubSchetOptions =
    subSchetOptions?.data?.filter((o) => o.sub_schet?.includes(value ?? '')) ?? []

  return (
    <AutoComplete
      autoSelectSingleResult={false}
      isFetching={isFetchingSubSchetOptions}
      options={filteredSubSchetOptions}
      getOptionLabel={(option) => option.sub_schet}
      getOptionValue={(option) => option.sub_schet}
      onSelect={(option) => {
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
          className={inputVariants({ editor, error: !!error })}
          {...inputProps}
        />
      )}
    </AutoComplete>
  )
}
