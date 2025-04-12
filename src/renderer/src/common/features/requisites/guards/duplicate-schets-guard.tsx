import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Outlet, useNavigate } from 'react-router-dom'

import { LoadingOverlay } from '@/common/components'

import { RequisitesQueryKeys } from '../config'
import { checkSchetsDuplicateQuery } from '../service'
import { useRequisitesStore } from '../store'

export const DuplicateSchetsGuard = () => {
  const navigate = useNavigate()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const { data: duplicates, isFetching } = useQuery({
    queryKey: [
      RequisitesQueryKeys.duplicates,
      {
        budjet_id: budjet_id!
      }
    ],
    queryFn: checkSchetsDuplicateQuery,
    placeholderData: () => undefined,
    gcTime: 0,
    refetchOnMount: true,
    staleTime: 0
  })

  useEffect(() => {
    if (duplicates?.data?.length && !isFetching) {
      navigate('/spravochnik/main-schet')
    }
  }, [duplicates, isFetching])

  if (isFetching) {
    return <LoadingOverlay />
  }

  return <Outlet />
}
