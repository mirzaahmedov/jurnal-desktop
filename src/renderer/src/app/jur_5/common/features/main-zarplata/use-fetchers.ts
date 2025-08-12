import { useQuery } from '@tanstack/react-query'

import { MainZarplataService } from '@/common/features/main-zarplata/service'

export interface UseMainZarplataListArgs {
  vacantId?: number
  ostanovit?: boolean
}
export const useMainZarplataList = ({ vacantId, ostanovit }: UseMainZarplataListArgs) => {
  return useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetByVacantId,
      {
        vacantId: vacantId ?? 0,
        ostanovit
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!vacantId
  })
}
