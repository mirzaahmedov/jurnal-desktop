import { useQuery } from '@tanstack/react-query'

import { MainZarplataService } from '@/common/features/main-zarplata/service'

export interface UseMainZarplataListArgs {
  vacantId?: number
}
export const useMainZarplataList = ({ vacantId }: UseMainZarplataListArgs) => {
  return useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetByVacantId,
      {
        vacantId: vacantId ?? 0
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!vacantId
  })
}
