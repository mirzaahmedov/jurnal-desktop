import type { CalculateParams } from '@/common/models/calculate-params'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useZarplataStore } from '@/common/features/zarplata/store'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { columnDefs } from './colums'
import { CalculateParamsDialog } from './dialog'
import { CalculateParamsService } from './service'

const CalculateParamsPage = () => {
  const pagination = usePagination()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<CalculateParams>()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { calculateParamsId: calcParamsId, setCalculateParamsId: setCalcParamsId } =
    useZarplataStore()

  const { data: calcParameters, isFetching } = useQuery({
    queryKey: [
      CalculateParamsService.QueryKeys.GetAll,
      {
        PageIndex: pagination.page,
        PageSize: pagination.limit
      }
    ],
    queryFn: CalculateParamsService.getCalcParameters
  })
  const { mutate: deleteParams, isPending: isDeleting } = useMutation({
    mutationFn: CalculateParamsService.deleteCalcParams,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [CalculateParamsService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('delete_failed'))
    }
  })

  const handleEdit = (row: CalculateParams) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleDelete = (row: CalculateParams) => {
    confirm({
      onConfirm: () => {
        deleteParams(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      breadcrumbs: [
        {
          title: t('zarplata')
        }
      ],
      title: t('pages.calc_parameters'),
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const count = calcParameters?.totalCount ?? 0
  const pageCount = Math.ceil(count / pagination.limit)

  return (
    <ListView>
      <ListView.Content loading={isFetching || isDeleting}>
        <GenericTable
          data={calcParameters?.data ?? []}
          columnDefs={columnDefs}
          onEdit={handleEdit}
          onDelete={handleDelete}
          selectedIds={calcParamsId ? [calcParamsId] : []}
          onDoubleClickRow={(row) => setCalcParamsId(row.id)}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={count}
          pageCount={pageCount}
        />
      </ListView.Footer>

      <CalculateParamsDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default CalculateParamsPage
