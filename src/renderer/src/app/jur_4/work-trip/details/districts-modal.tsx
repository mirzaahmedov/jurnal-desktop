import type { Constant } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { CollapsibleTable } from '@/common/components/collapsible-table'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { SearchInput } from '@/common/components/search-input'
import { useConstantsStore } from '@/common/features/constants/store'

export interface DistrictsModalProps extends Omit<DialogTriggerProps, 'children'> {
  onSelect: (district: Constant.District) => void
}
export const DistrictsModal = ({ onSelect, ...props }: DistrictsModalProps) => {
  const [search, setSearch] = useState({
    region: '',
    district: ''
  })
  const [openRows, setOpenRows] = useState<number[]>([])

  const { t } = useTranslation()
  const { regions, districts } = useConstantsStore()

  const filteredDistricts = useMemo(
    () =>
      districts.filter((district) =>
        district.name.toLowerCase().includes(search.district.toLowerCase())
      ),
    [districts, search.district]
  )
  const filteredRegions = useMemo(
    () =>
      regions.filter(
        (region) =>
          region.name.toLowerCase().includes(search.region.toLowerCase()) &&
          filteredDistricts.some((district) => district.region_id === region.id)
      ),
    [regions, search.region, filteredDistricts]
  )

  useEffect(() => {
    if (search.district) {
      setOpenRows(filteredRegions.map((region) => region.id))
    }
  }, [filteredDistricts])

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>{t('district')}</DialogTitle>
            <div className="flex items-center gap-2 pt-2.5">
              <SearchInput
                value={search.region}
                onChange={(e) => setSearch({ ...search, region: e.target.value })}
                containerProps={{
                  className: 'w-auto'
                }}
                placeholder={t('search_by...', { field: t('region').toLowerCase() })}
              />
              <SearchInput
                value={search.district}
                onChange={(e) => {
                  setSearch({ ...search, district: e.target.value })
                }}
                containerProps={{
                  className: 'w-auto'
                }}
                hotKey="]"
                placeholder={t('search_by...', { field: t('district').toLowerCase() })}
              />
            </div>
          </DialogHeader>
          <div className="h-[600px] overflow-y-auto scrollbar">
            <CollapsibleTable
              data={filteredRegions}
              columnDefs={[
                {
                  key: 'name'
                }
              ]}
              getRowId={(row) => row.id}
              className="table-generic-xs"
              classNames={{
                header: 'z-100'
              }}
              openRows={openRows}
              onOpenRowsChange={(openRows) => setOpenRows(openRows as number[])}
            >
              {({ row }) => (
                <div
                  ref={(ref) => ref?.focus()}
                  className="pl-10"
                >
                  <GenericTable
                    data={filteredDistricts.filter((district) => district.region_id === row.id)}
                    columnDefs={[
                      {
                        key: 'name'
                      }
                    ]}
                    onClickRow={onSelect}
                  />
                </div>
              )}
            </CollapsibleTable>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
