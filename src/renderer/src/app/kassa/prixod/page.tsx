import type { KassaPrixodType } from '@/common/models'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePagination, useRangeDate } from '@/common/hooks'
import { ListView } from '@/common/views'
import { columns } from './columns'
import { formatNumber } from '@/common/lib/format'
import { kassaPrixodService } from './service'
import { queryKeys } from './constants'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

const KassaPrixodPage = () => {
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const dates = useRangeDate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { data: prixodList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: kassaPrixodService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: kassaPrixodService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: KassaPrixodType) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: KassaPrixodType) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useLayout({
    title: `${t('pages.kassa')} · ${t('pages.prixod-docs')}`,
    onCreate() {
      navigate('create')
    }
  })

  const columnDefs = useMemo(() => {
    return columns.map((column) => {
      if (typeof column.header !== 'string') {
        return column
      }
      return {
        ...column,
        header: t(column.header)
      }
    })
  }, [t])

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={prixodList?.data ?? []}
          columnDefs={columnDefs}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <FooterRow>
              <FooterCell
                title="Итого"
                content={formatNumber(prixodList?.meta?.summa ?? 0)}
                colSpan={4}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={prixodList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaPrixodPage
