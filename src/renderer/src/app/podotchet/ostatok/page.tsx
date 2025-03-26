import type { PodotchetOstatok } from '@/common/models'

import { useEffect } from 'react'

import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { formatNumber } from '@renderer/common/lib/format'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, SummaTotal } from '@/common/components'
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

  const { data: podotchetOstatokList, isFetching } = useQuery({
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
        <div className="w-full sticky top-0">
          <SummaTotal className="pt-5">
            <SummaTotal.Value
              name={t('remainder-from')}
              value={formatNumber(podotchetOstatokList?.meta?.from_summa ?? 0)}
            />
          </SummaTotal>
        </div>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={podotchetOstatokList?.data ?? []}
          columnDefs={podotchetOstatokColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total')}
                  colSpan={5}
                  content={formatNumber(podotchetOstatokList?.meta?.page_prixod_summa ?? 0)}
                />
                <FooterCell
                  content={formatNumber(podotchetOstatokList?.meta?.page_rasxod_summa ?? 0)}
                />
              </FooterRow>
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <div className="w-full sticky top-0 mt-5">
          <SummaTotal className="pb-5">
            <SummaTotal.Value
              name={t('remainder-to')}
              value={formatNumber(podotchetOstatokList?.meta?.to_summa ?? 0)}
            />
          </SummaTotal>
        </div>
        <ListView.Pagination
          {...pagination}
          pageCount={podotchetOstatokList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PodotchetOstatokPage
