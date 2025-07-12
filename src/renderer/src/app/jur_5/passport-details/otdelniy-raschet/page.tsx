import type { MainZarplata } from '@/common/models'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { usePagination, useToggle } from '@/common/hooks'
import { ListView } from '@/common/views'

import { useConfirm } from '../../../../common/features/confirm'
import { OtdelniyRaschetColumnDefs } from './columns'
import { OtdelniyRaschetDialog } from './dialog'
import { OtdelniyRaschetService } from './service'

export interface OtdelniyRaschetProps {
  mainZarplata: MainZarplata
}
export const OtdelniyRaschets = ({ mainZarplata }: OtdelniyRaschetProps) => {
  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const { confirm } = useConfirm()
  const { t } = useTranslation()

  const [selectedRaschet, setSelectedRaschet] = useState<OtdelniyRaschet>()

  const { data: raschets, isFetching } = useQuery({
    queryKey: [
      OtdelniyRaschetService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: OtdelniyRaschetService.getAll
  })

  const { mutate: deleteRaschet } = useMutation({
    mutationFn: OtdelniyRaschetService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      dialogToggle.close()
      queryClient.invalidateQueries({
        queryKey: [OtdelniyRaschetService.QueryKeys.GetAll]
      })
    }
  })

  const handleRaschetCreate = () => {
    dialogToggle.setOpen(true)
    setSelectedRaschet(undefined)
  }
  const handleRaschetEdit = (raschet: OtdelniyRaschet) => {
    dialogToggle.setOpen(true)
    setSelectedRaschet(raschet)
  }

  const handleRaschetDelete = (raschet: OtdelniyRaschet) => {
    confirm({
      onConfirm: () => deleteRaschet(raschet.id)
    })
  }

  return (
    <ListView>
      <ListView.Header className="justify-end">
        <Button onClick={handleRaschetCreate}>
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={raschets?.data ?? []}
          columnDefs={OtdelniyRaschetColumnDefs}
          onEdit={handleRaschetEdit}
          onDelete={handleRaschetDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={raschets?.meta?.pageCount ?? 0}
          count={raschets?.meta?.count ?? 0}
        />
      </ListView.Footer>

      <OtdelniyRaschetDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        mainZarplata={mainZarplata}
        selectedRaschet={selectedRaschet}
      />
    </ListView>
  )
}
