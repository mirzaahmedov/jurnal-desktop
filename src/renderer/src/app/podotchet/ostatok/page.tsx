import type { PodotchetOstatok } from '@/common/models'

import { useEffect } from 'react'

import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { ListView } from '@/common/views'

import { podotchetOstatokColumns } from './columns'
import { podotchetOstatokQueryKeys } from './config'
import { podotchetOstatokService } from './service'

const PodotchetOstatokPage = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useDates()

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const { data: organOstatokList, isFetching } = useQuery({
    queryKey: [
      podotchetOstatokQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...dates,
        ...pagination
      }
    ],
    queryFn: podotchetOstatokService.getAll
  })
  const { mutate: deletePodotchetOstatok, isPending } = useMutation({
    mutationKey: [podotchetOstatokQueryKeys.delete],
    mutationFn: podotchetOstatokService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [podotchetOstatokQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: PodotchetOstatok) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: PodotchetOstatok) => {
    confirm({
      onConfirm() {
        deletePodotchetOstatok(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.ostatok'),
      breadcrumbs: [
        {
          title: t('pages.podotchet')
        }
      ],
      content: SearchField,
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={organOstatokList?.data ?? []}
          columnDefs={podotchetOstatokColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={organOstatokList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PodotchetOstatokPage
