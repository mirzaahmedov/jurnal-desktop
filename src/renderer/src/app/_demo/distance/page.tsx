import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@/common/components/editable-table'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import { Table, TableBody, TableHeader } from '@/common/components/ui/table'
import { useConstantsStore } from '@/common/features/constants/store'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { DistanceQueryKeys } from './config'
import { DistanceService } from './service'

const DistancePage = () => {
  const setLayout = useLayout()
  const pagination = usePagination()

  const [fromRegionId, setFromRegionId] = useState<number>()
  const [toRegionId, setToRegionId] = useState<number>()
  const [search] = useSearchFilter()

  const { districts, regions } = useConstantsStore()

  const fromDistricts = districts.filter((district) => district.region_id === fromRegionId)
  const toDistricts = districts.filter((district) => district.region_id === toRegionId)

  const { t } = useTranslation(['app'])

  const { data: distances, isFetching } = useQuery({
    queryKey: [
      DistanceQueryKeys.GetAll,
      {
        ...pagination,
        from_region_id: undefined,
        to_region_id: undefined,
        search
      }
    ],
    queryFn: DistanceService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.distance'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.admin')
        },
        {
          title: t('pages.spravochnik')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header>
        <div className="flex items-center gap-5">
          <JollyComboBox
            defaultItems={regions}
            selectedKey={fromRegionId || null}
            onSelectionChange={(value) => setFromRegionId(value as number)}
            menuTrigger="focus"
            placeholder={t('region')}
            className="gap-0"
            name="from_region_id"
          >
            {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
          </JollyComboBox>
          <JollyComboBox
            defaultItems={regions}
            selectedKey={toRegionId || null}
            onSelectionChange={(value) => setToRegionId(value as number)}
            menuTrigger="focus"
            placeholder={t('region')}
            className="gap-0"
            name="to_region_id"
          >
            {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
          </JollyComboBox>
        </div>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <Table>
          <TableHeader>
            <EditableTableRow>
              <EditableTableHead>№</EditableTableHead>
              <EditableTableHead>{t('district')}</EditableTableHead>
              {toDistricts.map((district) => (
                <EditableTableHead key={district.id}>{district.name}</EditableTableHead>
              ))}
            </EditableTableRow>
          </TableHeader>
          <TableBody>
            {fromDistricts.map((district, index) => (
              <EditableTableRow key={district.id}>
                <EditableTableHead>{index + 1}</EditableTableHead>
                <EditableTableHead>{district.name}</EditableTableHead>
                {toDistricts.map((district) => (
                  <EditableTableCell key={district.id}>{district.name}</EditableTableCell>
                ))}
              </EditableTableRow>
            ))}
          </TableBody>
        </Table>
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={distances?.meta?.pageCount ?? 0}
          count={distances?.meta?.count ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default DistancePage
