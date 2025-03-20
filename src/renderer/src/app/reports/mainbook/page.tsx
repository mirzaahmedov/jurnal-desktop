import type { Mainbook } from '@renderer/common/models'

import { useEffect } from 'react'

import { GenericTable } from '@renderer/common/components'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { mainbookColumns } from './columns'
import { mainbookQueryKeys } from './config'
import { mainbookService } from './service'

const MainbookPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const navigate = useNavigate()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: mainbook, isFetching: isFetchingMainbook } = useQuery({
    queryKey: [
      mainbookQueryKeys.getAll,
      {
        budjet_id,
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: mainbookService.getAll
  })
  const { mutate: deleteMainbook, isPending } = useMutation({
    mutationKey: [mainbookQueryKeys.delete],
    mutationFn: mainbookService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [mainbookQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.mainbook'),
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

  const handleEdit = (row: Mainbook) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: Mainbook) => {
    confirm({
      onConfirm: () => {
        deleteMainbook(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetchingMainbook || isPending}>
        <GenericTable
          data={mainbook?.data ?? []}
          columnDefs={mainbookColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={mainbook?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default MainbookPage
