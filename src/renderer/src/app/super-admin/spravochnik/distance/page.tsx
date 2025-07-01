import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { columnDefs } from './column-defs'
import { DistanceQueryKeys } from './config'
import { DistanceEditModal } from './edit-modal'
import { type Distance, DistanceService } from './service'

const DistancePage = () => {
  const modalToggle = useToggle()
  const setLayout = useLayout()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<Distance | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: distances, isFetching } = useQuery({
    queryKey: [
      DistanceQueryKeys.GetAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: DistanceService.getAll
  })

  const { mutate: deleteDistance } = useMutation({
    mutationFn: DistanceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DistanceQueryKeys.GetAll] })
    }
  })

  const handleDelete = (row: Distance) => {
    confirm({
      onConfirm: () => {
        deleteDistance(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.distance'),
      content: SearchFilterDebounced,
      onCreate: () => {
        setSelected(null)
        modalToggle.open()
      },
      breadcrumbs: [
        {
          title: t('pages.admin')
        },
        {
          title: t('pages.spravochnik')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={distances?.data ?? []}
          columnDefs={columnDefs}
          onDelete={handleDelete}
          onEdit={(row) => {
            setSelected(row)
            modalToggle.open()
          }}
        />
      </ListView.Content>
      <DistanceEditModal
        selected={selected}
        isOpen={modalToggle.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null)
          }
          modalToggle.setOpen(open)
        }}
      />
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={distances?.meta?.pageCount ?? 0}
          count={distances?.meta?.count ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default DistancePage
