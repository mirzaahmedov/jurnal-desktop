import type { SaldoProduct } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, CircleArrowDown, Download, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { ChooseSpravochnik, FooterCell, FooterRow, GenericTable } from '@/common/components'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { Checkbox } from '@/common/components/ui/checkbox'
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
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { capitalize } from '@/common/lib/string'
import { ListView } from '@/common/views'

import { MaterialReportModal } from '../__components__/material-report-modal'
import { IznosQueryKeys } from '../iznos/config'
import { createResponsibleSpravochnik } from '../responsible/service'
import { CommonWarehouseSaldoProductColumns } from './columns'
import { DeleteExistingDocumentsAlert } from './components/delete-existing-document-alert'
import { DeleteExistingSaldoAlert } from './components/delete-existing-saldo-alert'
import { MonthlySaldoTrackerDialog } from './components/monthly-saldo-tracker-dialog'
import { SaldoQueryKeys, defaultValues } from './config'
import { MaterialSaldoProductService, MaterialSaldoService } from './service'
import { useMaterialSaldo } from './use-saldo'
import {
  type OstatokDeleteExistingDocument,
  type OstatokDeleteExistingSaldo,
  handleOstatokDeleteExistingSaldoError,
  handleOstatokError,
  handleOstatokExistingDocumentError,
  handleOstatokResponse
} from './utils'

const columns = [
  {
    key: 'iznos',
    width: 160,
    renderCell: (row) => <Checkbox checked={row.iznos} />
  },
  ...CommonWarehouseSaldoProductColumns
] satisfies typeof CommonWarehouseSaldoProductColumns

const MaterialWarehouseSaldoPage = () => {
  const { startDate, endDate, setSelectedMonth } = useSelectedMonthStore()
  const { queuedMonths } = useMaterialSaldo()

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

  const [selectedDate, setSelectedDate] = useState<undefined | Date>(startDate)
  const [isModifiable, setModifiable] = useState(false)
  const [search] = useSearchFilter()

  const trackerToggle = useToggle()
  const materialToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues
  })

  const groupSpravochnik = useSpravochnik(createGroupSpravochnik({}))
  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))

  const { mutate: checkCreate, isPending: isCheckingCreate } = useMutation({
    mutationFn: MaterialSaldoService.checkCreate,
    onSuccess(res) {
      setModifiable(!!res?.data)
    },
    onError() {
      setModifiable(false)
    }
  })

  const {
    data: saldo,
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
    queryFn: MaterialSaldoProductService.getAll,
    enabled: !!selectedDate && !!budjet_id && queuedMonths.length === 0,
    select: (data) =>
      !!selectedDate && !!budjet_id && queuedMonths.length === 0 ? data : undefined
  })

  const { mutate: deleteMonth, isPending: isDeletingMonth } = useMutation({
    mutationKey: [SaldoQueryKeys.deleteMonth],
    mutationFn: MaterialSaldoService.deleteMonth,
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
      handleOstatokResponse(res)
      toast.success(res?.message)
    },
    onError(error) {
      const result = handleOstatokExistingDocumentError<OstatokDeleteExistingDocument>(error)
      if (result) {
        setDeleteExistingDocumentError({
          message: error.message,
          docs: result.docs,
          product: undefined
        })
      } else {
        setDeleteExistingDocumentError(undefined)
      }
    }
  })
  const { mutate: deleteOne, isPending: isDeleting } = useMutation({
    mutationKey: [SaldoQueryKeys.deleteOne],
    mutationFn: MaterialSaldoService.deleteOne,
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
      handleOstatokResponse(res)
      toast.success(res?.message)
    },
    onError(error) {
      const result = handleOstatokExistingDocumentError<OstatokDeleteExistingDocument>(error)
      if (result) {
        setDeleteExistingDocumentError({
          message: error.message,
          docs: result.docs,
          product: undefined
        })
      } else {
        setDeleteExistingDocumentError(undefined)
      }
    }
  })

  const { mutate: cleanSaldo } = useMutation({
    mutationKey: [SaldoQueryKeys.clean],
    mutationFn: MaterialSaldoService.cleanSaldo,
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
      onCreate:
        isModifiable && selectedDate
          ? () => {
              navigate(
                `create?year=${selectedDate.getFullYear()}&month=${selectedDate.getMonth() + 1}`
              )
            }
          : undefined,
      enableSaldo: true,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ]
    })
  }, [setLayout, navigate, t, isModifiable, selectedDate])
  useEffect(() => {
    if (selectedDate && main_schet_id) {
      checkCreate({
        main_schet_id,
        year: selectedDate?.getFullYear(),
        month: selectedDate?.getMonth() + 1
      })
    }
  }, [checkCreate, selectedDate, main_schet_id])

  const handleDelete = () => {
    if (!selectedDate) {
      return
    }
    confirm({
      onConfirm() {
        deleteMonth({
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          main_schet_id: main_schet_id!,
          budjet_id: budjet_id!
        })
      }
    })
  }
  const handleDeleteOne = (row: SaldoProduct) => {
    confirm({
      onConfirm() {
        deleteOne({
          year: row.year,
          month: row.month,
          main_schet_id: main_schet_id!,
          budjet_id: budjet_id!,
          id: row.id
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

  const onSubmit = form.handleSubmit((values) => {
    setSelectedDate(values.date)
  })

  useKeyUp({
    key: 'Delete',
    ctrlKey: true,
    handler: handleClean
  })

  return (
    <ListView>
      <ListView.Header className="w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-5">
            <ChooseSpravochnik
              spravochnik={groupSpravochnik}
              placeholder={t('group')}
              getName={(selected) => `${selected.group_number ?? ''} - ${selected.name}`}
              getElements={(selected) => [{ name: t('name'), value: selected.name }]}
            />

            <ChooseSpravochnik
              spravochnik={responsibleSpravochnik}
              placeholder={t('responsible')}
              getName={(selected) => selected.fio}
              getElements={(selected) => [
                { name: t('fio'), value: selected.fio },
                { name: t('podrazdelenie'), value: selected.spravochnik_podrazdelenie_jur7_name }
              ]}
            />
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
              <JollyDatePicker
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
            onClick={materialToggle.open}
          >
            <Download className="btn-icon icon-start icon-sm" /> {t('material')}
          </Button>

          <Button
            variant="ghost"
            onPress={trackerToggle.open}
          >
            <CalendarDays className="btn-icon icon-start" />
            {t('monthly_saldo')}
          </Button>

          <Button
            variant="destructive"
            onPress={handleDelete}
          >
            <Trash2 className="btn-icon icon-start" />
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
      <ListView.Content isLoading={isFetching || isDeletingMonth || isDeleting || isCheckingCreate}>
        <GenericTable
          columnDefs={columns}
          data={saldo?.data ?? []}
          getRowId={(row) => row.product_id}
          getRowKey={(row) => row.id}
          onDelete={isModifiable ? handleDeleteOne : undefined}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  colSpan={9}
                  title={t('total_page')}
                  content={String(saldo?.meta?.page_from_kol ?? 0)}
                />
                <FooterCell content={formatNumber(saldo?.meta?.page_from_summa ?? 0)} />
                <FooterCell content={String(saldo?.meta?.page_internal_prixod_kol ?? 0)} />
                <FooterCell content={formatNumber(saldo?.meta?.page_internal_prixod_summa ?? 0)} />
                <FooterCell content={String(saldo?.meta?.page_internal_rasxod_kol ?? 0)} />
                <FooterCell content={formatNumber(saldo?.meta?.page_internal_rasxod_summa ?? 0)} />
                <FooterCell content={String(saldo?.meta?.page_to_kol ?? 0)} />
                <FooterCell content={formatNumber(saldo?.meta?.page_to_summa ?? 0)} />
                <FooterCell
                  colSpan={7}
                  content={formatNumber(saldo?.meta?.page_to_iznos_summa ?? 0)}
                />
              </FooterRow>
              <FooterRow>
                <FooterCell
                  colSpan={9}
                  title={t('total_period')}
                  content={String(saldo?.meta?.from_kol ?? 0)}
                />
                <FooterCell content={formatNumber(saldo?.meta?.from_summa ?? 0)} />
                <FooterCell content={String(saldo?.meta?.internal_prixod_kol ?? 0)} />
                <FooterCell content={formatNumber(saldo?.meta?.internal_prixod_summa ?? 0)} />
                <FooterCell content={String(saldo?.meta?.internal_rasxod_kol ?? 0)} />
                <FooterCell content={formatNumber(saldo?.meta?.internal_rasxod_summa ?? 0)} />
                <FooterCell content={String(saldo?.meta?.to_kol ?? 0)} />
                <FooterCell content={formatNumber(saldo?.meta?.to_summa ?? 0)} />
                <FooterCell
                  colSpan={7}
                  content={formatNumber(saldo?.meta?.to_iznos_summa ?? 0)}
                />
              </FooterRow>
            </>
          }
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
          onRemove={() => {
            queryClient.invalidateQueries({
              queryKey: [SaldoQueryKeys.getAll]
            })
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

      <MonthlySaldoTrackerDialog
        isOpen={trackerToggle.isOpen}
        onOpenChange={trackerToggle.setOpen}
        onSelect={(month) => {
          form.setValue('date', month)
          setSelectedMonth(month)
          setSelectedDate(month)
          trackerToggle.close()
        }}
      />

      <MaterialReportModal
        withIznos
        isOpen={materialToggle.isOpen}
        onOpenChange={materialToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        to={formatDate(selectedDate!)}
        year={startDate.getFullYear()}
        month={startDate.getMonth() + 1}
      />

      <ListView.Footer>
        <ListView.Pagination
          pageCount={saldo?.meta?.pageCount ?? 0}
          count={saldo?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default MaterialWarehouseSaldoPage
