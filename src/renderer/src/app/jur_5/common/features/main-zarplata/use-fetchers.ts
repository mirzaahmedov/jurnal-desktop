import { useQuery } from '@tanstack/react-query'

import { MainZarplataService } from '@/common/features/main-zarplata/service'

export interface UseMainZarplataListArgs {
  vacantId?: number
  ostanovit?: boolean
  year?: number
  month?: number
}
export const useMainZarplataList = ({
  vacantId,
  ostanovit,
  year,
  month
}: UseMainZarplataListArgs) => {
  return useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetByVacantId,
      {
        vacantId: vacantId ?? 0,
        ostanovit,
        year,
        month
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!vacantId
  })
}
