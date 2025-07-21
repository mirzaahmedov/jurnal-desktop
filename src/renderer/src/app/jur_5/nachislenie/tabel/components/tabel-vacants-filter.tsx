import type { VacantTreeNode } from '@/app/region-admin/vacant/vacant-tree'
import type { MainZarplata } from '@/common/models'

import { useTranslation } from 'react-i18next'

import { cn } from '@/common/lib/utils'
import { getVacantRayon } from '@/common/utils/zarplata'

interface TabelVacantsFilterProps {
  selectedVacants: (VacantTreeNode & { _selectedCount: number })[]
  selectedMainZarplata: MainZarplata[]
  visibleVacant: number | null
  setVisibleVacant: (vacantId: number | null) => void
}
export const TabelVacantsFilter = ({
  selectedVacants,
  selectedMainZarplata,
  visibleVacant,
  setVisibleVacant
}: TabelVacantsFilterProps) => {
  const { t } = useTranslation(['app'])
  return (
    <div>
      <ul className="flex items-center flex-wrap gap-5">
        <li
          className={cn(
            'flex items-center gap-2 font-semibold text-gray-500 hover:text-gray-700 cursor-pointer',
            !visibleVacant && 'font-semibold hover:text-blue-500 text-blue-500'
          )}
          onClick={() => {
            setVisibleVacant(null)
          }}
        >
          <span className="text-xs">{t('all')}</span>
          <span className="text-xs">({selectedMainZarplata.length})</span>
        </li>
        {selectedVacants.map((vacant) => (
          <li
            key={vacant.id}
            className={cn(
              'flex items-center gap-2 font-semibold text-gray-500 hover:text-gray-700 cursor-pointer',
              visibleVacant === vacant.id && 'font-semibold hover:text-blue-500 text-blue-500'
            )}
            onClick={() => {
              setVisibleVacant(vacant.id)
            }}
          >
            <span className="text-xs">{getVacantRayon(vacant)}</span>
            <span className="text-xs">({vacant._selectedCount})</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
