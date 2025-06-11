import { ConstantService } from './service'
import { PodpisQueryKeys } from '@/app/region-spravochnik/podpis/config'
import { PodpisService } from '@/app/region-spravochnik/podpis/service'
import { useConstantsStore } from './store'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

export const ConstantsProvider = () => {
  const setConstants = useConstantsStore((store) => store.setConstants)

  const { data: podpisTypes } = useQuery({
    queryKey: [PodpisQueryKeys.getPodpisTypes],
    queryFn: PodpisService.getPodpisTypes
  })

  const { data: regions } = useQuery({
    queryKey: [ConstantService.QueryKeys.GetRegions],
    queryFn: ConstantService.getRegions
  })

  const { data: districts } = useQuery({
    queryKey: [ConstantService.QueryKeys.GetDistricts],
    queryFn: ConstantService.getDistricts
  })

  useEffect(() => {
    setConstants({
      podpisTypes: podpisTypes?.data || [],
      regions: regions?.data || [],
      districts: districts?.data || []
    })
  }, [podpisTypes, regions, districts])

  return null
}
