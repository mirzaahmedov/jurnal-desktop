import { useEffect } from 'react'

import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import { DownloadFile, ImportFile } from '@renderer/common/features/file'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'

import { DateRangeForm } from '../common/components/date-range-form'
import { useJurnal7DateRange } from '../common/components/use-date-range'
import { columns, queryKeys } from './config'
import { usePrixodDelete, usePrixodList } from './service'

const MO7PrixodPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const setLayout = useLayoutStore((store) => store.setLayout)
  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { form, from, to, applyFilters } = useJurnal7DateRange()

  const { mutate: deletePrixod, isPending: isDeleting } = usePrixodDelete({
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast.success('Приход успешно удален')
    },
    onError() {
      toast.error('Ошибка при удалении прихода')
    }
  })
  const { data: prixodList, isFetching } = usePrixodList({
    params: {
      ...pagination,
      main_schet_id,
      from,
      to
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.prixod-docs'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

  return (
    <ListView>
      <div className="p-5 flex items-center justify-between">
        <DateRangeForm
          form={form}
          onSubmit={applyFilters}
        />
        {main_schet_id ? (
          <ButtonGroup>
            <ImportFile
              url="/jur_7/doc_prixod/import"
              params={{
                main_schet_id,
                budjet_id
              }}
            />
            <DownloadFile
              url="/jur_7/doc_prixod/template"
              fileName={`jur7_prixod_shablon-${from}&${to}.xlsx`}
              buttonText={t('download-something', { something: t('template') })}
              params={{
                excel: true
              }}
              className="ml-2.5"
            />
            <DownloadFile
              url="jur_7/doc_prixod/report"
              fileName={`jur7_prixod_report-${from}&${to}.xlsx`}
              buttonText={t('download-something', { something: t('report') })}
              params={{
                from,
                to,
                main_schet_id,
                excel: true
              }}
            />
          </ButtonGroup>
        ) : null}
      </div>
      <ListView.Content
        loading={isFetching || isDeleting}
        className="flex-1 relative"
      >
        <GenericTable
          columnDefs={columns}
          data={prixodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              title: 'Удалить приход?',
              onConfirm: () => deletePrixod(row.id)
            })
          }}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={prixodList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export { MO7PrixodPage }
