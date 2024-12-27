import { DownloadDocumentButton, GenericTable } from '@/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePagination, useRangeDate } from '@/common/hooks'

import type { Akt } from '@/common/models'
import { ListView } from '@/common/views'
import { aktService } from './service'
import { columns } from './columns'
import { queryKeys } from './constants'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useRequisitesStore } from '@/common/features/main-schet'

const AktPage = () => {
  const { confirm } = useConfirm()

  const main_schet_id = useRequisitesStore((state) => state.main_schet_id)
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
        <ListView.Pagination
          {...pagination}
          pageCount={1}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AktPage
