import type { Deduction } from '@/common/models/deduction'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { Input } from '@/common/components/ui/input'
import { useConfirm } from '@/common/features/confirm'
import { useDebounceValue, usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { DetailsView, ListView } from '@/common/views'

import { DeductionColumnDefs } from './columns'
import { DeductionsChangePayment } from './components/change-deductions'
import { DeductionsDialog } from './dialog'
import {
  DeductionFilter,
  DeductionFilterTabOption,
  useCodeFilter,
  useNameFilter,
  useTabFilter
} from './filters'
import { DeductionsService } from './service'

const ColumnDefs = DeductionColumnDefs.filter((column) => column.key !== 'id')

const DeductionsPage = () => {
  const setLayout = useLayout()
  const pagination = usePagination()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const [name, setName] = useNameFilter()
  const [code, setCode] = useCodeFilter()
  const [tabValue] = useTabFilter()
  const [selectedPayment, setSelectedPayment] = useState<Deduction>()

  const [nameDebounced] = useDebounceValue(name)
  const [codeDebounced] = useDebounceValue(code)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: deductions, isFetching } = useQuery({
    queryKey: [
      DeductionsService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        name: nameDebounced || undefined,
        code: codeDebounced || undefined
      }
    ],
    queryFn: DeductionsService.getAll
  })

  const { mutate: deleteDeduction, isPending: isDeleting } = useMutation({
    mutationFn: DeductionsService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [DeductionsService.QueryKeys.GetAll]
      })
      setSelectedPayment(undefined)
    },
    onError: (error) => {
      toast.error(t('delete_failed'))
      console.error(error)
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.deductions'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        },
        {
          title: t('pages.payment_type')
        }
      ],
      content: DeductionFilter,
      onCreate:
        tabValue === DeductionFilterTabOption.All
          ? () => {
              setSelectedPayment(undefined)
              dialogToggle.open()
            }
          : undefined
    })
  }, [setLayout, t, tabValue])

  const handleRowEdit = (row: Deduction) => {
    setSelectedPayment(row)
    dialogToggle.open()
  }

  const handleRowDelete = (row: Deduction) => {
    confirm({
      onConfirm: () => {
        deleteDeduction(row.id)
      }
    })
  }

  return tabValue === DeductionFilterTabOption.ChangePayment ? (
    <DetailsView>
      <DetailsView.Content>
        <DeductionsChangePayment />
      </DetailsView.Content>
    </DetailsView>
  ) : (
    <ListView>
      <div className="p-5 flex items-center justify-start gap-5">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('name')}
          className="w-64"
        />
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t('code')}
          className="w-64"
        />
      </div>
      <ListView.Content isLoading={isFetching || isDeleting}>
        <GenericTable
          data={deductions?.data ?? []}
          columnDefs={ColumnDefs}
          className="table-generic-xs"
          onEdit={handleRowEdit}
          onDelete={handleRowDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={deductions?.meta?.count ?? 0}
          pageCount={deductions?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <DeductionsDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selectedPayment={selectedPayment}
      />
    </ListView>
  )
}

export default DeductionsPage
