import type { Zarplata } from '@/common/models'

import { forwardRef, useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { SelectField, type SelectFieldProps } from '@/common/components'
import { useEventCallback } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

import { ZarplataSpravochnikService } from './service'

const { queryKeys } = ZarplataSpravochnikService

interface SpravochnikTypeSelectProps
  extends Omit<
    SelectFieldProps<Zarplata.Spravochnik>,
    'value' | 'onChange' | 'options' | 'getOptionValue' | 'getOptionLabel'
  > {
  value?: number
  onChange?: (value: number) => void
}
export const SpravochnikTypeSelect = forwardRef<HTMLSpanElement, SpravochnikTypeSelectProps>(
  ({ value, onChange, triggerClassName, ...props }, ref) => {
    const { data: options, isFetching } = useQuery({
      queryKey: [queryKeys.getTypes],
      queryFn: ZarplataSpravochnikService.getTypes,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
    })

    const onChangeEvent = useEventCallback(onChange!)

    useEffect(() => {
      if (!Array.isArray(options?.data) || !options.data.length) {
        return
      }
      onChangeEvent(options.data[0]?.typeCode)
    }, [options])

    return (
      <SelectField
        ref={ref}
        disabled={isFetching}
        value={value ? value.toString() : ''}
        onValueChange={(value) => onChange?.(Number(value))}
        options={Array.isArray(options?.data) ? options?.data : []}
        getOptionLabel={(o) => o.name}
        getOptionValue={(o) => o.typeCode}
        triggerClassName={cn('max-w-sm', triggerClassName)}
        {...props}
      />
    )
  }
)
