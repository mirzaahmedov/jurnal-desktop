import { useQuery } from '@tanstack/react-query'

import { podpisQueryKeys } from '@/app/region-spravochnik/podpis/config'
import { podpisService } from '@/app/region-spravochnik/podpis/service'

export const usePodpis = (type: string, enabled: boolean = true) => {
  const { data: podpis } = useQuery({
    queryKey: [
      podpisQueryKeys.getAll,
      {
        type
      }
    ],
    queryFn: podpisService.getAll,
    enabled
  })

  if (!Array.isArray(podpis?.data)) {
    return []
  }
  return podpis.data
}
