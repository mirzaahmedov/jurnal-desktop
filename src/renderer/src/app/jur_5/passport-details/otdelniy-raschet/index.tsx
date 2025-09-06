import type { MainZarplata } from '@/common/models'

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
import { OtdelniyRaschetDialog } from './otdelniy-raschet-dialog'
import { type OtdelniyRaschet, OtdelniyRaschetService } from './service'

interface OtdelniyRaschetContainerProps {
  mainZarplata: MainZarplata
}
export const OtdelniyRaschetContainer = ({ mainZarplata }: OtdelniyRaschetContainerProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const dopOplataQuery = useQuery({
    queryKey: [OtdelniyRaschetService.QueryKeys.GetByMainZarplataId, mainZarplata.id],
    queryFn: OtdelniyRaschetService.getAll
  })

  const dopOplataDeleteMutation = useMutation({
    mutationFn: OtdelniyRaschetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OtdelniyRaschetService.QueryKeys.GetByMainZarplataId]
      })
      toast.success(t('delete_success'))
    }
  })

  const handleDopOplataDelete = (row: OtdelniyRaschet) => {
    confirm({
      onConfirm() {
        dopOplataDeleteMutation.mutate(row.id)
      }
    })
  }

  const handleDopOplataCreate = () => {
    dialogToggle.open()
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
        />
      </ListView.Content>

      <OtdelniyRaschetDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        mainZarplata={mainZarplata}
      />
    </ListView>
  )
}
