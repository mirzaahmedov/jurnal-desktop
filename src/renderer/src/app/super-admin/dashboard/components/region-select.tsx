import type { Region } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { RegionQueryKeys, RegionService } from '@/app/super-admin/region'
import { JollySelect, type JollySelectProps, SelectItem } from '@/common/components/jolly/select'

export interface RegionSelectProps extends Omit<JollySelectProps<Region>, 'children'> {
  withFirstOptionSelected?: boolean
}
export const RegionSelect = ({ withFirstOptionSelected = false, ...props }: RegionSelectProps) => {
  const { t } = useTranslation()

  const regionsQuery = useQuery({
    queryKey: [RegionQueryKeys.getAll],
    queryFn: RegionService.getAll
  })

  useEffect(() => {
    if (withFirstOptionSelected && regionsQuery.data?.data?.length) {
      props.onSelectionChange?.(regionsQuery.data?.data[0].id)
    }
  }, [regionsQuery.data?.data, withFirstOptionSelected])

  return (
    <JollySelect
      isDisabled={regionsQuery.isFetching}
      items={regionsQuery.data?.data ?? []}
      className="w-64"
      placeholder={t('region')}
      {...props}
    >
      {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
    </JollySelect>
  )
}
