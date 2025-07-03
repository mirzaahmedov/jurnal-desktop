import type { Employment } from '@/common/models/employment'

import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { ListView } from '@/common/views'

import { columnDefs } from './columns'
import { EmploymentDialog } from './employment-dialog'
import { EmploymentService } from './service'

interface EmploymentProps {
  mainZarplataId: number
}
export const Employments = ({ mainZarplataId }: EmploymentProps) => {
  const { confirm } = useConfirm()

  const [selectedEmployment, setSelectedEmployment] = useState<Employment>()

  const { data: employment, isFetching } = useQuery({
    queryKey: [EmploymentService.QueryKeys.getByMainZarplataId, mainZarplataId],
    queryFn: EmploymentService.getByMainZarplataId
  })

  const { mutate: deleteEmployment, isPending } = useMutation({
    mutationFn: EmploymentService.delete
  })

  const handleEmploymentEdit = (row: Employment) => {
    setSelectedEmployment(row)
  }
  const handleEmploymentDelete = (row: Employment) => {
    confirm({
      onConfirm: () => {
        deleteEmployment(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          columnDefs={columnDefs}
          data={employment ?? []}
          onEdit={handleEmploymentEdit}
          onDelete={handleEmploymentDelete}
          className="table-generic-xs"
        />

        <EmploymentDialog
          employment={selectedEmployment}
          mainZarplataId={mainZarplataId}
        />
      </ListView.Content>
    </ListView>
  )
}
