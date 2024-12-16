import type { Akt } from '@/common/models'

import { useNavigate } from 'react-router-dom'
import { DownloadDocumentButton, GenericTable } from '@/common/components'
import { columns } from './columns'
import { queryKeys } from './constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aktService } from './service'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { useConfirm } from '@/common/features/confirm'

import { ListView } from '@/common/views'
import { usePagination, useRangeDate } from '@/common/hooks'

const AktPage = () => {
  const { confirm } = useConfirm()

  const main_schet_id = useMainSchet((state) => state.main_schet?.id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const pagination = usePagination()
  const dates = useRangeDate()

  const { data: aktList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: aktService.getAll
  })
  const { mutate: deleteAkt, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: aktService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: Akt) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: Akt) => {
    confirm({
      onConfirm() {
        deleteAkt(row.id)
      }
    })
  }

  useLayout({
    title: 'Акт-приём пересдач',
    onCreate() {
      navigate('create')
    }
  })

  return (
    <ListView>
      <ListView.Header className="flex flex-row items-center justify-between">
        <ListView.RangeDatePicker {...dates} />
        <DownloadDocumentButton
          fileName={`aкт-приема-пересдач_шапка-${dates.from}:${dates.to}.xlsx`}
          url="/akt/export/cap"
          params={{
            main_schet_id,
            from: dates.from,
            to: dates.to
          }}
          buttonText="Aкт приема пересдач шапка"
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={aktList?.data ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination {...pagination} pageCount={1} />
      </ListView.Footer>
    </ListView>
  )
}

export default AktPage
