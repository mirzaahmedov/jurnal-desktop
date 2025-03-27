import type { OrganizationOstatok } from '@/common/models'

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

import { organOstatokColumns } from './columns'
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
  const { mutate: deleteOrganizationOstatok, isPending } = useMutation({
    mutationKey: [organOstatokQueryKeys.delete],
    mutationFn: organizationOstatokService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [organOstatokQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: OrganizationOstatok) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: OrganizationOstatok) => {
    confirm({
      onConfirm() {
        deleteOrganizationOstatok(row.id)
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
        <SummaTotal className="mt-5">
          <SummaTotal.Value
            name={t('remainder-from')}
            value={formatNumber(organOstatokList?.meta?.from_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(organOstatokList?.meta?.from_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(organOstatokList?.meta?.from_summa_rasxod ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={organOstatokList?.data ?? []}
          columnDefs={organOstatokColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                colSpan={5}
                content={formatNumber(organOstatokList?.meta?.page_prixod_summa ?? 0)}
              />
              <FooterCell
                title={undefined}
                content={formatNumber(organOstatokList?.meta?.page_rasxod_summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaTotal className="mb-5">
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(organOstatokList?.meta?.to_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(organOstatokList?.meta?.to_summa_prixod ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(organOstatokList?.meta?.to_summa_rasxod ?? 0)}
          />
        </SummaTotal>
        <ListView.Pagination
          {...pagination}
          pageCount={organOstatokList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default OrganizationOstatokPage
