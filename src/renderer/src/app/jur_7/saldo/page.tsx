import type { SaldoProduct } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, CircleArrowDown, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { ChooseSpravochnik, DatePicker, GenericTable } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { FormField } from '@/common/components/ui/form'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile, ImportFile } from '@/common/features/file'
import { FileValidationErrorAlert } from '@/common/features/file/file-validation-error-alert'
import {
  type ImportValidationErrorRow,
  handleImportValidationError
} from '@/common/features/file/utils'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useKeyUp, usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ISODateRegex, formatDate, parseDate, validateDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { capitalize } from '@/common/lib/string'
import { ListView } from '@/common/views'

import { IznosQueryKeys } from '../iznos/config'
import { createResponsibleSpravochnik } from '../responsible/service'
import { ostatokProductColumns } from './columns'
import { DeleteExistingDocumentsAlert } from './components/delete-existing-document-alert'
import { DeleteExistingSaldoAlert } from './components/delete-existing-saldo-alert'
import { MonthlySaldoTrackerDialog } from './components/monthly-saldo-tracker-dialog'
import { SaldoQueryKeys, defaultValues } from './config'
import { MaterialWarehouseSaldoProductService, MaterialWarehouseSaldoService } from './service'
import { useWarehouseSaldo } from './use-saldo'
import {
  type OstatokDeleteExistingDocument,
  type OstatokDeleteExistingSaldo,
  handleOstatokDeleteExistingSaldoError,
  handleOstatokError,
  handleOstatokExistingDocumentError,
  handleOstatokResponse
} from './utils'

const MaterialWarehouseSaldoPage = () => {
  const { startDate, endDate, setSelectedMonth } = useSelectedMonthStore()
  const { queuedMonths } = useWarehouseSaldo()

  const [deleteExistingDocumentError, setDeleteExistingDocumentError] = useState<{
    message: string
    docs: OstatokDeleteExistingDocument[]
    product?: SaldoProduct
  }>()
  const [deleteExistingSaldoError, setDeleteExistingSaldoError] = useState<{
    message: string
    data: OstatokDeleteExistingSaldo
  }>()
  const [validationError, setValidationError] = useState<{
    message: string
    result: ImportValidationErrorRow
  }>()

  const [selectedRows, setSelectedRows] = useState<SaldoProduct[]>([])
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(startDate)
  const [search] = useSearchFilter()

  const selectedToggle = useToggle()
  const monthlyTrackerToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const setLayout = useLayout()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues
  })

  const groupSpravochnik = useSpravochnik(createGroupSpravochnik({}))
  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))

  const {
    data: saldos,
    isFetching,
    error: saldoError
  } = useQuery({
    queryKey: [
      SaldoQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        to: formatDate(selectedDate!),
        search,
        responsible_id: responsibleSpravochnik.selected?.id,
        group_id: groupSpravochnik.selected?.id,
        budjet_id: budjet_id!
      }
    ],
    queryFn: MaterialWarehouseSaldoProductService.getAll,
    enabled: !!selectedDate && !!budjet_id && queuedMonths.length === 0,
    select: (data) =>
      !!selectedDate && !!budjet_id && queuedMonths.length === 0 ? data : undefined
  })

  const { mutate: deleteOstatok, isPending: isDeleting } = useMutation({
    mutationKey: [SaldoQueryKeys.delete],
    mutationFn: MaterialWarehouseSaldoService.deleteSaldoMonth,
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [IznosQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.check]
      })
      setSelectedRows([])
      handleOstatokResponse(res)
      toast.success(res?.message)
    },
    onError(error) {
      const result = handleOstatokExistingDocumentError<OstatokDeleteExistingDocument>(error)
      if (result) {
        setDeleteExistingDocumentError({
          message: error.message,
          docs: result.docs,
          product: selectedRows.find((r) => r.id === result?.saldo_id?.id)
        })
      } else {
        setDeleteExistingDocumentError(undefined)
      }
    }
  })

  const { mutate: cleanSaldo } = useMutation({
    mutationKey: [SaldoQueryKeys.clean],
    mutationFn: MaterialWarehouseSaldoService.cleanSaldo,
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [IznosQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [SaldoQueryKeys.check]
      })
      setSelectedRows([])
      toast.success(res?.message)
    }
  })

  useEffect(() => {
    if (saldoError) {
      handleOstatokError(saldoError)
    }
  }, [saldoError])
  useEffect(() => {
    const date = form.getValues('date')
    if (date && startDate < date && date < endDate) {
      return
    }
    form.setValue('date', startDate)
    setSelectedDate(startDate)
  }, [form, startDate, endDate])

  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      content: SearchFilterDebounced,
      enableSaldo: true,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ]
    })
  }, [setLayout, t])

  const handleDelete = () => {
    if (!selectedDate) {
      return
    }
    confirm({
      onConfirm() {
        deleteOstatok({
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          main_schet_id: main_schet_id!,
          budjet_id: budjet_id!
        })
      }
    })
  }
  const handleClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password: string) {
        cleanSaldo({
          budjet_id: budjet_id!,
          password
        })
      }
    })
  }

  const handleDeselectRow = (row: SaldoProduct) => {
    setSelectedRows((prev) => {
      return prev.filter((p) => p.product_id !== row.product_id)
    })
  }

  const onSubmit = form.handleSubmit((values) => {
    setSelectedDate(values.date)
  })

  // const selectedIds = useMemo(() => selectedRows.map((row) => row.product_id), [selectedRows])

  useKeyUp({
    key: 'Delete',
    ctrlKey: true,
    onKeyUp: handleClean
  })

  return (
    <ListView>
      <ListView.Header className="w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-5">
            <ChooseSpravochnik
              spravochnik={groupSpravochnik}
              placeholder={capitalize(t('choose', { what: t('group') }))}
              getName={(selected) => `${selected.group_number ?? ''} - ${selected.name}`}
              getElements={(selected) => [{ name: t('name'), value: selected.name }]}
            />

            <ChooseSpravochnik
              spravochnik={responsibleSpravochnik}
              placeholder={capitalize(t('choose', { what: t('responsible') }))}
              getName={(selected) => selected.fio}
              getElements={(selected) => [
                { name: t('fio'), value: selected.fio },
                { name: t('podrazdelenie'), value: selected.spravochnik_podrazdelenie_jur7_name }
              ]}
            />
          </div>
          <div>
            <ButtonGroup className="flex gap-5">
              <DownloadFile
                fileName={`${t('pages.saldo')}-${t('import')}-${t('template')}.xlsx`}
                url="/jur_7/saldo/template"
                buttonText={capitalize(t('download-something', { something: t('template') }))}
                params={{
                  excel: true
                }}
              />
              <Button
                variant="ghost"
                onClick={monthlyTrackerToggle.open}
              >
                <CalendarDays className="btn-icon" />
                {t('monthly_saldo')}
              </Button>

              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="btn-icon" />
                {t('clean_current_month')}
              </Button>

              <ImportFile
                url="/jur_7/saldo/import"
                params={{
                  budjet_id,
                  main_schet_id
                }}
                onSuccess={() => {
                  queryClient.invalidateQueries({
                    queryKey: [SaldoQueryKeys.getAll]
                  })
                  queryClient.invalidateQueries({
                    queryKey: [IznosQueryKeys.getAll]
                  })
                  queryClient.invalidateQueries({
                    queryKey: [SaldoQueryKeys.check]
                  })
                }}
                onError={(error) => {
                  const result = handleImportValidationError(error)
                  if (result) {
                    setValidationError({
                      result,
                      message: error?.message
                    })
                  } else {
                    setValidationError(undefined)
                  }
                  const existingDocument = handleOstatokDeleteExistingSaldoError(error)
                  if (existingDocument) {
                    setDeleteExistingSaldoError({
                      message: error.message,
                      data: existingDocument.docs
                    })
                  } else {
                    setDeleteExistingDocumentError(undefined)
                  }
                }}
              />
            </ButtonGroup>
          </div>
        </div>
      </ListView.Header>
      <div className="p-5 pt-0 w-full flex items-center justify-between gap-5">
        <form
          onSubmit={onSubmit}
          className="flex items-center justify-start gap-5"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <DatePicker
                value={field.value ? formatDate(field.value) : ''}
                onChange={(value) => {
                  field.onChange(value ? parseDate(value) : undefined)
                }}
                validate={(date) => {
                  if (!validateDate(date)) {
                    if (ISODateRegex.test(date)) {
                      toast.error(t('date_does_not_exist'))
                    }
                    return false
                  }
                  const isValid = startDate <= parseDate(date) && parseDate(date) <= endDate
                  if (!isValid && date?.length === 10) {
                    toast.error(
                      t('out_of_range', {
                        startDate: formatLocaleDate(formatDate(startDate)),
                        endDate: formatLocaleDate(formatDate(endDate))
                      })
                    )
                  }
                  return isValid
                }}
                calendarProps={{
                  fromMonth: startDate,
                  toMonth: endDate
                }}
              />
            )}
          />
          <Button
            variant="outline"
            type="submit"
          >
            <CircleArrowDown className="btn-icon icon-start" />
            {t('load')}
          </Button>
        </form>
      </div>
      <ListView.Content loading={isFetching || isDeleting}>
        <GenericTable
          columnDefs={ostatokProductColumns}
          data={saldos?.data ?? []}
          getRowId={(row) => row.product_id}
          getRowKey={(row) => row.id}
        />
      </ListView.Content>
      {deleteExistingDocumentError ? (
        <DeleteExistingDocumentsAlert
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteExistingDocumentError(undefined)
            }
          }}
          message={deleteExistingDocumentError.message}
          docs={deleteExistingDocumentError.docs}
          product={deleteExistingDocumentError.product}
          onRemove={(product) => {
            queryClient.invalidateQueries({
              queryKey: [SaldoQueryKeys.getAll]
            })
            if (product) {
              setSelectedRows((prev) => {
                return prev.filter((p) => p.product_id !== product.product_id)
              })
            }
          }}
        />
      ) : null}
      {deleteExistingSaldoError ? (
        <DeleteExistingSaldoAlert
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteExistingSaldoError(undefined)
            }
          }}
          message={deleteExistingSaldoError.message}
          data={deleteExistingSaldoError.data}
        />
      ) : null}
      {validationError ? (
        <FileValidationErrorAlert
          open
          onOpenChange={(open) => {
            if (!open) {
              setValidationError(undefined)
            }
          }}
          message={validationError.message}
          doc={validationError.result}
        />
      ) : null}

      <Dialog
        open={selectedToggle.isOpen}
        onOpenChange={selectedToggle.setOpen}
      >
        <DialogContent className="w-full max-w-full h-full max-h-[600px] flex flex-col p-0">
          <DialogHeader className="p-5 pb-0">
            <DialogTitle>{t('selected_elements')}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto scrollbar flex-1">
            <GenericTable
              data={selectedRows}
              columnDefs={ostatokProductColumns}
              getRowId={(row) => row.product_id}
              getRowKey={(row) => row.id}
              onDelete={handleDeselectRow}
            />
          </div>
        </DialogContent>
      </Dialog>

      <MonthlySaldoTrackerDialog
        isOpen={monthlyTrackerToggle.isOpen}
        onOpenChange={monthlyTrackerToggle.setOpen}
        onSelect={(month) => {
          form.setValue('date', month)
          setSelectedMonth(month)
          setSelectedDate(month)
          monthlyTrackerToggle.close()
        }}
      />

      <ListView.Footer>
        <ListView.Pagination
          pageCount={saldos?.meta?.pageCount ?? 0}
          count={saldos?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default MaterialWarehouseSaldoPage
