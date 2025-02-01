import type { Jur7Podrazdelenie } from '@/common/models'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { toast } from '@/common/hooks/use-toast'
import { useToggle } from '@/common/hooks/use-toggle'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { podrazdelenie7Columns } from './columns'
import { subdivision7QueryKeys } from './constants'
import Podrazdelenie7Dialog from './dialog'
import { subdivision7Service } from './service'

const Subdivision7Page = () => {
  const [selected, setSelected] = useState<null | Jur7Podrazdelenie>(null)

  const pagination = usePagination()
  const dialogToggle = useToggle()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const queryClient = useQueryClient()
  const { data: subdivision7List, isFetching } = useQuery({
    queryKey: [
      subdivision7QueryKeys.getAll,
      {
        ...pagination
      }
    ],
    queryFn: subdivision7Service.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [subdivision7QueryKeys.delete],
    mutationFn: subdivision7Service.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [subdivision7QueryKeys.getAll]
      })
      toast({
        title: 'Подразделениe удалено'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при удалении подразделения',
        description: error.message
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.podrazdelenie'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      onCreate() {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, t])

  const handleClickEdit = (row: Jur7Podrazdelenie) => {
    dialogToggle.open()
    setSelected(row)
  }
  const handleClickDelete = (row: Jur7Podrazdelenie) => {
    confirm({
      title: 'Удалить подразделениe?',
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={podrazdelenie7Columns}
          data={subdivision7List?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={subdivision7List?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
      <Podrazdelenie7Dialog
        open={dialogToggle.isOpen}
        onClose={dialogToggle.close}
        selected={selected}
      />
    </ListView>
  )
}

export default Subdivision7Page
