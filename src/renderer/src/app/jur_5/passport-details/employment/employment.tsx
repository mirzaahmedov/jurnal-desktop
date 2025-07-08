import type { MainZarplata } from '@/common/models'
import type { Employment } from '@/common/models/employment'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks'
import { ListView } from '@/common/views'

import { EmploymentColumnDefs } from './columns'
import { EmploymentDialog } from './employment-dialog'
import { EmploymentService } from './service'

interface EmploymentProps {
  mainZarplata: MainZarplata
}
export const Employments = ({ mainZarplata }: EmploymentProps) => {
  const { confirm } = useConfirm()
  const { t } = useTranslation()

  const [selectedEmployment, setSelectedEmployment] = useState<Employment>()

  const queryClient = useQueryClient()
  const dialogToggle = useToggle()

  const { data: employment, isFetching } = useQuery({
    queryKey: [EmploymentService.QueryKeys.getByMainZarplataId, mainZarplata.id],
    queryFn: EmploymentService.getByMainZarplataId
  })

  const { mutate: deleteEmployment, isPending } = useMutation({
    mutationFn: EmploymentService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [EmploymentService.QueryKeys.getByMainZarplataId, mainZarplata.id]
      })
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const handleEmploymentCreate = () => {
    setSelectedEmployment(undefined)
    dialogToggle.open()
  }
  const handleEmploymentEdit = (row: Employment) => {
    setSelectedEmployment(row)
    dialogToggle.open()
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
      <ListView.Header className="justify-end">
        <Button onPress={handleEmploymentCreate}>
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </ListView.Header>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          columnDefs={EmploymentColumnDefs}
          data={employment ?? []}
          onEdit={handleEmploymentEdit}
          onDelete={handleEmploymentDelete}
          className="table-generic-xs"
        />

        <EmploymentDialog
          isOpen={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
          employment={selectedEmployment}
          mainZarplata={mainZarplata}
        />
      </ListView.Content>
    </ListView>
  )
}
