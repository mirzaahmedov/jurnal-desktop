import type { PokazatUslugi } from '@/common/models'

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

import { pokazatUslugiColumns } from './columns'
import { organOstatokQueryKeys } from './config'
import { organizationOstatokService } from './service'

const OrganizationOstatokPage = () => {
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
      organOstatokQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...dates,
        ...pagination
      }
    ],
    queryFn: organizationOstatokService.getAll
  })
  const { mutate: deletePokazatUslugi, isPending } = useMutation({
    mutationKey: [organOstatokQueryKeys.delete],
    mutationFn: organizationOstatokService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [organOstatokQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: PokazatUslugi) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: PokazatUslugi) => {
    confirm({
      onConfirm() {
        deletePokazatUslugi(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.ostatok'),
      breadcrumbs: [
        {
          title: t('pages.organization')
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
          columnDefs={pokazatUslugiColumns}
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

export default OrganizationOstatokPage
