import type { Zarplata } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { JollySelect, type JollySelectProps, SelectItem } from '@/common/components/jolly/select'
import { useEventCallback } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

import { ZarplataSpravochnikService } from './service'

const { QueryKeys: queryKeys } = ZarplataSpravochnikService

interface SpravochnikTypeSelectProps
  extends Omit<JollySelectProps<Zarplata.SpravochnikType>, 'children'> {}
export const SpravochnikTypeSelect = ({ className, ...props }: SpravochnikTypeSelectProps) => {
  const { data: options, isFetching } = useQuery({
    queryKey: [queryKeys.GetTypes],
    queryFn: ZarplataSpravochnikService.getTypes,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  const onChangeEvent = useEventCallback(props.onSelectionChange)

  useEffect(() => {
    if (!Array.isArray(options?.data) || !options.data.length) {
      return
    }
    onChangeEvent?.(options.data[0]?.typeCode)
  }, [options])

  return (
    <JollySelect
      isDisabled={isFetching}
      items={Array.isArray(options?.data) ? options?.data : []}
      className={cn('w-80', className)}
      {...props}
    >
      {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
    </JollySelect>
  )
}
