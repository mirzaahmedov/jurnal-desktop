import { useQuery } from '@tanstack/react-query'

import { useRequisitesStore } from '@/common/features/requisites'

import { MainSchetQueryKeys } from './config'
import { MainSchetService } from './service'

export const useMainSchetQuery = () => {
  const mainSchetId = useRequisitesStore((store) => store.main_schet_id)
  const mainSchetQuery = useQuery({
    queryKey: [MainSchetQueryKeys.getById, mainSchetId],
    queryFn: MainSchetService.getById,
    enabled: !!mainSchetId
  })

  return mainSchetQuery
}
