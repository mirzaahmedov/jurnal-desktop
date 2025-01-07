import { podpisQueryKeys } from '@renderer/app/region-spravochnik/podpis/constants'
import { podpisService } from '@renderer/app/region-spravochnik/podpis/service'
import { useQuery } from '@tanstack/react-query'

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
