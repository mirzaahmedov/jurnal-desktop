import { useQuery } from '@tanstack/react-query'

import { PodpisQueryKeys } from '@/app/region-spravochnik/podpis/config'
import { PodpisService } from '@/app/region-spravochnik/podpis/service'

export const usePodpis = (type: string, enabled: boolean = true) => {
  const { data: podpis } = useQuery({
    queryKey: [
      PodpisQueryKeys.getAll,
      {
        type
      }
    ],
    queryFn: PodpisService.getAll,
    enabled
  })

  if (!Array.isArray(podpis?.data)) {
    return []
  }
  return podpis.data
}
