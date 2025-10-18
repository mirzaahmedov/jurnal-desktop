import type { Nachislenie } from '@/common/models'

import { useQuery } from '@tanstack/react-query'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useAuthStore } from '@/common/features/auth'

import { nachieslenieColumns } from './columns'
import { NachislenieQueryKeys } from './config'
import { NachislenieService } from './service'

export interface NachislenieTableProps {
  rayon?: string
  onSelect: (selected: Nachislenie) => void
}
export const NachislenieTable = ({ rayon, onSelect }: NachislenieTableProps) => {
  const userOwnId = useAuthStore((store) => store.user?.id)

  const { data: nachislenie, isFetching: isFetchingNachislenie } = useQuery({
    queryKey: [NachislenieQueryKeys.getAll, { userId: userOwnId!, rayon: rayon! }],
    queryFn: NachislenieService.getElementsByRayon,
    enabled: !!userOwnId && !!rayon
  })
  return (
    <div className="relative flex-1 overflow-auto scrollbar">
      {isFetchingNachislenie ? <LoadingOverlay /> : null}
      <GenericTable
        columnDefs={nachieslenieColumns}
        data={nachislenie ?? []}
        className="table-generic-xs"
        onClickRow={(row) => {
          onSelect(row)
        }}
      />
    </div>
  )
}
