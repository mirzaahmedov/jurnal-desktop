import type { OstatokProduct } from '@renderer/common/models'

import { useEffect, useMemo, useState } from 'react'

import { createGroupSpravochnik } from '@renderer/app/super-admin/group/service'
import { ChooseSpravochnik, DatePicker, GenericTable } from '@renderer/common/components'
import { Badge } from '@renderer/common/components/ui/badge'
import { Button } from '@renderer/common/components/ui/button'
import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/common/components/ui/dropdown-menu'
import { FormField } from '@renderer/common/components/ui/form'
import { useConfirm } from '@renderer/common/features/confirm'
import { DownloadFile, ImportFile } from '@renderer/common/features/file'
import { FileValidationErrorAlert } from '@renderer/common/features/file/file-validation-error-alert'
import {
  type ImportValidationErrorRow,
  handleImportValidationError
} from '@renderer/common/features/file/utils'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { usePagination, useToggle } from '@renderer/common/hooks'
import { date_iso_regex, formatDate, parseDate, validateDate } from '@renderer/common/lib/date'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleArrowDown, CopyCheck, Download, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { createResponsibleSpravochnik } from '../responsible/service'
import { ostatokProductColumns } from './columns'
import { defaultValues, ostatokQueryKeys } from './config'
import { ExistingDocumentsAlert } from './existing-document-alert'
import { deleteOstatokBatchQuery, ostatokProductService } from './service'
import { useOstatokStore } from './store'
import {
  type ExistingDocument,
  handleOstatokError,
  handleOstatokExistingDocumentError,
  handleOstatokResponse
} from './utils'

const OstatokPage = () => {
  const { minDate, maxDate, queuedMonths } = useOstatokStore()

  const [existingDocsError, setExistingDocsError] = useState<{
    message: string
    docs: ExistingDocument[]
    product?: OstatokProduct
  }>()
  const [validationError, setValidationError] = useState<{
    message: string
    doc: ImportValidationErrorRow
  }>()
  const [selectedRows, setSelectedRows] = useState<OstatokProduct[]>([])
  const [selectedDate, setSelectedDate] = useState<undefined | Date>(minDate)

  const dropdownToggle = useToggle()
  const selectedToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { search } = useSearch()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const form = useForm({
    defaultValues
  })

  const groupSpravochnik = useSpravochnik(createGroupSpravochnik({}))
  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))

  const {
    data: ostatok,
    isFetching,
    error: ostatokError
  } = useQuery({
    queryKey: [
      ostatokQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        to: formatDate(selectedDate!),
        search,
        responsible_id: responsibleSpravochnik.selected?.id,
        group_id: groupSpravochnik.selected?.id,
        budjet_id: budjet_id!,
        main_schet_id
      }
    ],
    queryFn: ostatokProductService.getAll,
    enabled: !!selectedDate && !!budjet_id && queuedMonths.length === 0,
    select: (data) =>
      !!selectedDate && !!budjet_id && queuedMonths.length === 0 ? data : undefined
  })

  const { mutate: deleteOstatok, isPending: isDeleting } = useMutation({
    mutationKey: [ostatokQueryKeys.delete],
    mutationFn: deleteOstatokBatchQuery,
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [ostatokQueryKeys.getAll]
      })
      setSelectedRows([])
      handleOstatokResponse(res)
      toast.success(res?.message)
    },
    onError(error) {
      const result = handleOstatokExistingDocumentError<ExistingDocument>(error)
      if (result) {
        setExistingDocsError({
          message: error.message,
          docs: result.docs,
          product: selectedRows.find((r) => r.id === result?.saldo_id?.id)
        })
      } else {
        setExistingDocsError(undefined)
      }
    }
  })

  useEffect(() => {
    handleOstatokError(ostatokError)
  }, [ostatokError])
  useEffect(() => {
    const date = form.getValues('date')
    if (date && minDate < date && date < maxDate) {
      return
    }
    form.setValue('date', minDate)
    setSelectedDate(minDate)
  }, [form, minDate, maxDate])
  useEffect(() => {
    setLayout({
      title: t('pages.ostatok'),
      content: SearchField,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ]
    })
  }, [setLayout, t])

  const handleDelete = (ids: number[]) => {
    if (!selectedDate) {
      return
    }
    confirm({
      onConfirm() {
        deleteOstatok({
          ids: ids.map((id) => ({
            id
          })),
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          budjet_id: budjet_id!,
          main_schet_id: main_schet_id!
        })
      }
    })
  }
  const handleDeselectRow = (row: OstatokProduct) => {
    setSelectedRows((prev) => {
      return prev.filter((p) => p.product_id !== row.product_id)
    })
  }

  const onSubmit = form.handleSubmit((values) => {
    setSelectedDate(values.date)
  })

  const selectedIds = useMemo(() => selectedRows.map((row) => row.product_id), [selectedRows])

  return (
    <ListView>
      <ListView.Header className="w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-5">
            <ChooseSpravochnik
              spravochnik={groupSpravochnik}
              placeholder={t('choose', { what: t('group').toLowerCase() })}
              getName={(selected) => `${selected.group_number ?? ''} / ${selected.name}`}
              getElements={(selected) => [{ name: 'Наименование', value: selected.name }]}
            />

            <ChooseSpravochnik
              spravochnik={responsibleSpravochnik}
              placeholder={t('choose', { what: t('responsible').toLowerCase() })}
              getName={(selected) => selected.fio}
              getElements={(selected) => [
                { name: t('fio'), value: selected.fio },
                { name: t('podrazdelenie'), value: selected.spravochnik_podrazdelenie_jur7_name }
              ]}
            />
          </div>
          <div>
            <ButtonGroup className="flex gap-5">
              {selectedDate ? (
                <DropdownMenu open={dropdownToggle.isOpen}>
                  <DropdownMenuTrigger
                    asChild
                    onClick={dropdownToggle.open}
                  >
                    <Button variant="ghost">
                      <Download className="btn-icon icon-start" />
                      <span className="titlecase">
                        {t('download-something', { something: t('reports') })}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    onInteractOutside={dropdownToggle.close}
                  >
                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`оборотка_${formatDate(selectedDate)}.xlsx`}
                        url="/jur_7/monitoring/obrotka/report"
                        params={{
                          to: formatDate(selectedDate),
                          main_schet_id,
                          excel: true
                        }}
                        buttonText="Оборотка"
                        className="w-full"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`материальная_${formatDate(selectedDate)}.xlsx`}
                        url="/jur_7/monitoring/material/report"
                        params={{
                          to: formatDate(selectedDate),
                          main_schet_id,
                          excel: true
                        }}
                        buttonText="Материальная"
                        className="w-full"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`шапка_${formatDate(selectedDate)}.xlsx`}
                        url="/jur_7/monitoring/cap/report"
                        params={{
                          to: formatDate(selectedDate),
                          budjet_id,
                          excel: true
                        }}
                        buttonText="Шапка"
                        className="w-full"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`шапка2_${formatDate(selectedDate)}.xlsx`}
                        url="/jur_7/monitoring/cap/back/report"
                        params={{
                          to: formatDate(selectedDate),
                          budjet_id,
                          excel: true
                        }}
                        buttonText="Шапка (2)"
                        className="w-full"
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}

              <DownloadFile
                fileName={`${t('pages.ostatok')}-${t('import')}-${t('template')}.xlsx`}
                url="/jur_7/saldo/temlate"
                buttonText={t('download-something', { something: t('template') })}
                params={{
                  excel: true
                }}
              />
              <ImportFile
                url="/jur_7/saldo/import"
                params={{
                  main_schet_id,
                  budjet_id
                }}
                onSuccess={() => {
                  queryClient.invalidateQueries({
                    queryKey: [ostatokQueryKeys.getAll]
                  })
                }}
                onError={(error) => {
                  const doc = handleImportValidationError(error)
                  if (doc) {
                    setValidationError({
                      doc,
                      message: error?.message
                    })
                  } else {
                    setValidationError(undefined)
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
                    if (date_iso_regex.test(date)) {
                      toast.error(t('date_does_not_exist'))
                    }
                    return false
                  }
                  const isValid = minDate <= parseDate(date) && parseDate(date) <= maxDate
                  if (!isValid && date?.length === 10) {
                    toast.error(
                      t('out_of_range', {
                        minDate: formatLocaleDate(formatDate(minDate)),
                        maxDate: formatLocaleDate(formatDate(maxDate))
                      })
                    )
                  }
                  return isValid
                }}
                calendarProps={{
                  fromMonth: minDate,
                  toMonth: maxDate
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

        <div className="flex items-center gap-5">
          {selectedIds.length > 0 ? (
            <>
              <Button
                variant="ghost"
                onClick={selectedToggle.open}
              >
                <CopyCheck className="btn-icon" /> {t('selected_elements')}
                <Badge>{selectedRows.length}</Badge>
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(selectedRows.map((row) => row.id))}
                disabled={isDeleting}
                loading={isDeleting}
              >
                <Trash2 className="btn-icon" /> {t('delete_selected')}
              </Button>
            </>
          ) : null}
        </div>
      </div>
      <ListView.Content loading={isFetching || isDeleting}>
        <GenericTable
          columnDefs={ostatokProductColumns.map((column) => {
            if (column.key === 'id') {
              return {
                ...column,
                renderHeader: () => {
                  const count =
                    ostatok?.data?.filter((p) => selectedIds.includes(p.product_id)).length ?? 0

                  const checked =
                    ostatok?.data?.length && ostatok.data.length === count
                      ? true
                      : count > 0
                        ? 'indeterminate'
                        : false

                  return (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={checked}
                        onClick={() => {
                          if (checked === true) {
                            setSelectedRows([])
                            return
                          }
                          setSelectedRows(ostatok?.data ?? [])
                        }}
                        className="size-5"
                      />
                      <Trans>id</Trans>
                    </div>
                  )
                }
              }
            }
            return column
          })}
          data={ostatok?.data ?? []}
          getRowId={(row) => row.product_id}
          selectedIds={selectedIds}
          params={{
            onCheckedChange: (row: OstatokProduct) => {
              setSelectedRows((prev) => {
                if (prev.find((p) => p.product_id === row.product_id)) {
                  return prev.filter((p) => p.product_id !== row.product_id)
                }
                return [...prev, row]
              })
            }
          }}
        />
      </ListView.Content>
      {existingDocsError ? (
        <ExistingDocumentsAlert
          open
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setExistingDocsError(undefined)
            }
          }}
          message={existingDocsError.message}
          docs={existingDocsError.docs}
          product={existingDocsError.product}
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
          doc={validationError.doc}
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
              onDelete={handleDeselectRow}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ListView.Footer>
        <ListView.Pagination
          pageCount={ostatok?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default OstatokPage
