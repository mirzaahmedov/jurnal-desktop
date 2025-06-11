import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'

import { ArrowRightLeft } from 'lucide-react'
import { Button } from '@/common/components/jolly/button'
import { useConstantsStore } from '@/common/features/constants/store'
import { useLocationState } from '@/common/hooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const useFromDistrictFilter = () => {
  return useLocationState<number | undefined>('from_district_id')
}

export const useToDistrictFilter = () => {
  return useLocationState<number | undefined>('to_district_id')
}

export const DistrictFilter = () => {
  const [fromRegionId, setFromRegionId] = useState<number>()
  const [fromDistrictId, setFromDistrictId] = useFromDistrictFilter()

  const [toRegionId, setToRegionId] = useState<number>()
  const [toDistrictId, setToDistrictId] = useToDistrictFilter()

  const { t } = useTranslation()
  const { regions, districts } = useConstantsStore()

  const handleSwap = () => {
    setFromRegionId(toRegionId)
    setFromDistrictId(toDistrictId)
    setToRegionId(fromRegionId)
    setToDistrictId(fromDistrictId)
  }

  return (
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
        defaultItems={
          fromRegionId
            ? districts.filter((district) => district.region_id === fromRegionId)
            : districts
        }
        selectedKey={fromDistrictId || null}
        onSelectionChange={(value) => setFromDistrictId(value as number)}
        menuTrigger="focus"
        className="gap-0"
        placeholder={t('from_where')}
        name="from_district_id"
      >
        {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
      </JollyComboBox>

      <Button
        variant="ghost"
        size="icon"
        onPress={handleSwap}
      >
        <ArrowRightLeft />
      </Button>

      <JollyComboBox
        defaultItems={regions}
        selectedKey={toRegionId || null}
        onSelectionChange={(value) => setToRegionId(value as number)}
        menuTrigger="focus"
        className="gap-0"
        placeholder={t('region')}
        name="to_region_id"
      >
        {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
      </JollyComboBox>
      <JollyComboBox
        defaultItems={
          toRegionId ? districts.filter((district) => district.region_id === toRegionId) : districts
        }
        selectedKey={toDistrictId || null}
        onSelectionChange={(value) => setToDistrictId(value as number)}
        menuTrigger="focus"
        className="gap-0"
        placeholder={t('to_where')}
        name="to_district_id"
      >
        {(item) => <ComboboxItem id={item.id}>{item.name}</ComboboxItem>}
      </JollyComboBox>
    </div>
  )
}
