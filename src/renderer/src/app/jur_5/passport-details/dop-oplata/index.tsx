import type { MainZarplata } from '@/common/models'
import type { DopOplata } from '@/common/models/dop-oplata'

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

import { DopOplataColumnDefs } from './columns'
import { DopOplataDialog } from './dop-oplata-dialog'
import { DopOplataService } from './service'

interface DopOplataContainerProps {
  mainZarplata: MainZarplata
}
export const DopOplataContainer = ({ mainZarplata }: DopOplataContainerProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState<DopOplata>()

  const dopOplataQuery = useQuery({
    queryKey: [DopOplataService.QueryKeys.GetByMainZarplataId, mainZarplata.id],
    queryFn: DopOplataService.getAll
  })

  const dopOplataDeleteMutation = useMutation({
    mutationFn: DopOplataService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DopOplataService.QueryKeys.GetByMainZarplataId]
      })
      toast.success(t('delete_success'))
    }
  })

  const handleDopOplataDelete = (row: DopOplata) => {
    confirm({
      onConfirm() {
        dopOplataDeleteMutation.mutate(row.id)
      }
    })
  }

  const handleDopOplataCreate = () => {
    dialogToggle.open()
    setSelected(undefined)
  }
  const handleDopOplataEdit = (row: DopOplata) => {
    dialogToggle.open()
    setSelected(row)
  }

  return (
    <ListView>
      <ListView.Header className="justify-end">
        <Button onClick={handleDopOplataCreate}>
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </ListView.Header>
      <ListView.Content isLoading={dopOplataQuery.isFetching}>
        <GenericTable
          columnDefs={DopOplataColumnDefs}
          data={dopOplataQuery.data ?? []}
          className="table-generic-xs"
          onDelete={handleDopOplataDelete}
          onEdit={handleDopOplataEdit}
        />
      </ListView.Content>

      <DopOplataDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
        mainZarplata={mainZarplata}
      />
    </ListView>
  )
}
