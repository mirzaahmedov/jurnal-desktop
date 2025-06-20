import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { PodpisQueryKeys } from '@/app/region-spravochnik/podpis/config'
import { PodpisService } from '@/app/region-spravochnik/podpis/service'
import { PositionQueryKeys } from '@/app/super-admin/spravochnik/position/config'
import { PositionService } from '@/app/super-admin/spravochnik/position/service'

import { ConstantService } from './service'
import { useConstantsStore } from './store'

export const ConstantsProvider = () => {
  const setConstants = useConstantsStore((store) => store.setConstants)

  const { data: positions } = useQuery({
    queryKey: [PositionQueryKeys.getAll],
    queryFn: PositionService.getAll
  })

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
      positions: positions?.data || [],
      podpisTypes: podpisTypes?.data || [],
      regions: regions?.data || [],
      districts: districts?.data || []
    })
  }, [positions, podpisTypes, regions, districts])

  return null
}
