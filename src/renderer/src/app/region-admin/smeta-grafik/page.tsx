import type { SmetaGrafik } from '@/common/models'

import { useEffect, useState } from 'react'

import { useRequisitesStore } from '@renderer/common/features/requisites'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { SmetaTable } from './components'
import { smetaGrafikQueryKeys } from './constants'
import SmetaGrafikDialog from './dialog'
import { smetaGrafikService } from './service'

const SmetaGrafikPage = () => {
  const [selected, setSelected] = useState<null | SmetaGrafik>(null)

  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { confirm } = useConfirm()
  const { open, close, isOpen: active } = useToggle()
  const { t } = useTranslation(['app'])

  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: smetaGrafikList, isFetching } = useQuery({
    queryKey: [
      smetaGrafikQueryKeys.getAll,
      {
        ...pagination,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: smetaGrafikService.getAll,
    enabled: !!budjet_id && !!main_schet_id
  })
  const { mutate: deleteSmetaGrafik, isPending } = useMutation({
    mutationKey: [smetaGrafikQueryKeys.delete],
    mutationFn: smetaGrafikService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: SmetaGrafik) => {
    setSelected(row)
    open()
  }
  const handleClickDelete = (row: SmetaGrafik) => {
    confirm({
      onConfirm() {
        deleteSmetaGrafik(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.smeta-grafik'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      onCreate: () => {
        setSelected(null)
        open()
      }
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Content
        loading={false}
        className="relative w-full flex-1"
      >
        <SmetaTable
          isLoading={isFetching || isPending}
          data={smetaGrafikList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={smetaGrafikList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <SmetaGrafikDialog
        data={selected}
        open={active}
        onClose={close}
      />
    </ListView>
  )
}

export default SmetaGrafikPage
