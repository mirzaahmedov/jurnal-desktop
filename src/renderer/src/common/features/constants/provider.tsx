import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { PodpisQueryKeys } from '@/app/region-spravochnik/podpis/config'
import { PodpisService } from '@/app/region-spravochnik/podpis/service'

import { useConstantsStore } from './store'

export const ConstantsProvider = () => {
  const setConstants = useConstantsStore((store) => store.setConstants)

  const { data: podpisTypes } = useQuery({
    queryKey: [PodpisQueryKeys.getPodpisTypes],
    queryFn: PodpisService.getPodpisTypes
  })

  useEffect(() => {
    if (podpisTypes?.data) {
      setConstants({ podpisTypes: podpisTypes?.data })
    } else {
      setConstants({ podpisTypes: [] })
    }
  }, [podpisTypes])

  return null
}
