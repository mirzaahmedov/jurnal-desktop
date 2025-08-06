import type { Region } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { RegionQueryKeys, RegionService } from '@/app/super-admin/region'
import { JollySelect, type JollySelectProps, SelectItem } from '@/common/components/jolly/select'

export const RegionSelect = (props: Omit<JollySelectProps<Region>, 'children'>) => {
  const regionsQuery = useQuery({
    queryKey: [RegionQueryKeys.getAll],
    queryFn: RegionService.getAll
  })

  useEffect(() => {
    if (regionsQuery.data?.data?.length) {
      props.onSelectionChange?.(regionsQuery.data?.data[0].id)
    }
  }, [regionsQuery.data?.data])

  return (
    <JollySelect
      isDisabled={regionsQuery.isFetching}
      items={regionsQuery.data?.data ?? []}
      className="w-64"
      {...props}
    >
      {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
    </JollySelect>
  )
}
