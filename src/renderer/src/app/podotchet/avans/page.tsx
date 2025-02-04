import { useEffect } from 'react'

import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout, useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { toast } from '@/common/hooks/use-toast'
import { Avans } from '@/common/models'
import { ListView } from '@/common/views'

import { avansColumns } from './columns'
import { avansQueryKeys } from './constants'
import { avansService } from './service'

const AvansPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: avansList, isFetching } = useQuery({
    queryKey: [
      avansQueryKeys.getAll,
      {
        main_schet_id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: avansService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [avansQueryKeys.delete],
    mutationFn: avansService.delete,
    onSuccess() {
      toast({
        title: 'Документ успешно удалён'
      })
      queryClient.invalidateQueries({
        queryKey: [avansQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: Avans) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: Avans) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.avans'),
      breadcrumbs: [
        {
          title: t('pages.podotchet')
        }
      ],
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={avansColumns}
          data={avansList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={avansList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AvansPage
