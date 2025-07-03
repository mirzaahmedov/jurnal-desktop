import { useQuery } from '@tanstack/react-query'

import { GenericTable } from '@/common/components'

import { EmploymentService } from './service'

interface EmploymentProps {
  mainZarplataId: number
}
export const Employment = ({ mainZarplataId }: EmploymentProps) => {
  const { data: employment } = useQuery({
    queryKey: [EmploymentService.QueryKeys.getByMainZarplataId, mainZarplataId],
    queryFn: EmploymentService.getByMainZarplataId
  })

  console.log('employment', employment)

  return (
    <GenericTable
      columnDefs={[]}
      data={employment ?? []}
    />
  )
}
