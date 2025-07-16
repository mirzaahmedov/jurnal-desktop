import { useEffect, useState } from 'react'

import {
  CircleMinus,
  CirclePlus,
  LayoutList,
  TableOfContents,
  Warehouse,
  XCircle
} from 'lucide-react'
import {
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
  type UseFormReturn,
  useFieldArray,
  useWatch
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { EdinSelect, NumericInput } from '@/common/components'
import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@/common/components/editable-table'
import { SchetEditor } from '@/common/components/editable-table/editors'
import { EmptyList } from '@/common/components/empty-states'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Pagination } from '@/common/components/pagination'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Input } from '@/common/components/ui/input'
import { Table, TableBody, TableHeader } from '@/common/components/ui/table'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { SpravochnikInput, inputVariants, useSpravochnik } from '@/common/features/spravochnik'
import { useEventCallback, useToggle } from '@/common/hooks'
import { calcSena, calcSumma } from '@/common/lib/pricing'
import { cn } from '@/common/lib/utils'

import { AddExistingProductDialog } from '../../saldo/components/add-existing-product-dialog'
import {
  type MaterialPrixodFormValues,
  type MaterialPrixodProvodkaFormValues,
  defaultValues
} from '../config'

const PAGE_SIZE = 20

interface ProvodkaTableProps {
  tabIndex: number
  form: UseFormReturn<MaterialPrixodFormValues>
}
export const ProvodkaTable = ({ form, tabIndex, ...props }: ProvodkaTableProps) => {
  const params = useParams()

  const [page, setPage] = useState(1)
  const [rowIndex, setRowIndex] = useState(0)

  const { t } = useTranslation()
  const { startDate, endDate } = useSelectedMonthStore()

  const spravochnikToggle = useToggle()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'childs'
  })
  const pageCount = Math.ceil(fields.length / PAGE_SIZE)

  const values = useWatch({
    control: form.control
  })

  console.log({ values })

  const updateFormField = useEventCallback(
    (index: number, key: keyof MaterialPrixodProvodkaFormValues, value: unknown) => {
      form.setValue(`childs.${index}.${key}`, value as string | number, {
        shouldValidate: true
      })
    }
  )!

  useEffect(() => {
    if (page > pageCount) {
      setPage(1)
    }
  }, [pageCount])

  return (
    <div>
      <div className="overflow-x-auto scrollbar relative">
        <div
          onFocus={(e) => {
            e.currentTarget.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            })
          }}
          className="w-[2500px]"
        >
          <AddExistingProductDialog
            responsible_id={form.watch('kimga_id')}
            to={form.watch('doc_date')}
            open={spravochnikToggle.isOpen}
            disabledIds={form
              .watch('childs')
              .map((child) => child.product_id!)
              .filter(Boolean)}
            onOpenChange={(open) => {
              if (!open) {
                setRowIndex(0)
              }
              spravochnikToggle.setOpen(open)
            }}
            onSelect={(products) => {
              const prevChilds = form.getValues('childs').slice(0, rowIndex)
              const nextChilds = form.getValues('childs').slice(rowIndex + 1)
              form.setValue(
                'childs',
                [
                  ...prevChilds,
                  ...products.map((p) => {
                    const group = p.group
                    const iznos = group && group?.iznos_foiz > 0
                    return {
                      product_id: p.id,
                      group_jur7_id: p.group_jur7_id,
                      name: p.name,
                      group_number: group.group_number ?? group?.name ?? '',
                      unit_id: p.unit_id,
                      inventar_num: p.inventar_num,
                      serial_num: p.serial_num,
                      kol: 0,
                      sena: 0,
                      summa: 0,
                      iznos: iznos,
                      debet_schet: group?.schet ?? '',
                      debet_sub_schet: group?.provodka_subschet ?? '',
                      kredit_schet: '',
                      kredit_sub_schet: group?.provodka_subschet ?? '',
                      data_pereotsenka: form.getValues('doc_date'),
                      eski_iznos_summa: 0,
                      iznos_schet: iznos ? (group?.schet ?? '') : '',
                      iznos_sub_schet: iznos ? (group?.provodka_subschet ?? '') : '',
                      iznos_start: iznos ? form.getValues('doc_date') : ''
                    } satisfies MaterialPrixodProvodkaFormValues
                  }),
                  ...nextChilds
                ],
                {
                  shouldValidate: true
                }
              )
            }}
          />
          <Table
            className="relative border border-slate-200 table-xs"
            {...props}
          >
            <TableHeader className="sticky top-0 z-50">
              <EditableTableRow>
                <EditableTableHead
                  className="min-w-11"
                  rowSpan={2}
                ></EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="w-24"
                >
                  {t('group')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="min-w-72"
                >
                  {t('product-name')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="min-w-28"
                >
                  {t('serial-num')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="min-w-28"
                >
                  {t('inventar-num')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  style={{ width: 160 }}
                >
                  {t('ei')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="text-right"
                >
                  {t('kol')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="text-right"
                >
                  {t('sena')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="text-right"
                >
                  {t('summa')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="text-right"
                >
                  {t('nds_foiz')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="text-right"
                >
                  {t('nds')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="text-right"
                >
                  {t('nds_summa')}
                </EditableTableHead>
                <EditableTableHead
                  colSpan={3}
                  className="text-center"
                >
                  {t('iznos')}
                </EditableTableHead>
                <EditableTableHead
                  colSpan={2}
                  className="text-center"
                >
                  {t('debet')}
                </EditableTableHead>
                <EditableTableHead
                  colSpan={2}
                  className="text-center"
                >
                  {t('kredit')}
                </EditableTableHead>

                <EditableTableHead rowSpan={2}>{t('prixod_date')}</EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="px-3 sticky right-0 border-l"
                >
                  <div className="flex justify-center">
                    <TableOfContents className="size-5 text-slate-500" />
                  </div>
                </EditableTableHead>
              </EditableTableRow>
              <EditableTableRow>
                <EditableTableHead>{t('iznos')}</EditableTableHead>
                <EditableTableHead
                  className="text-end"
                  style={{ width: 150 }}
                >
                  {t('iznos_summa_old')}
                </EditableTableHead>
                {/* <EditableTableHead>{t('schet')}</EditableTableHead>
                <EditableTableHead>{t('subschet')}</EditableTableHead> */}
                <EditableTableHead>{t('iznos_start_date')}</EditableTableHead>

                <EditableTableHead>{t('schet')}</EditableTableHead>
                <EditableTableHead>{t('subschet')}</EditableTableHead>
                <EditableTableHead>{t('schet')}</EditableTableHead>
                <EditableTableHead className="last:border-solid">{t('subschet')}</EditableTableHead>
              </EditableTableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(fields) && fields.length ? (
                fields.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((row, rowIndex) => {
                  const index = (page - 1) * PAGE_SIZE + rowIndex
                  const errors = form.formState.errors.childs?.[index] || {}
                  const isExisting = !!row.product_id
                  return (
                    <EditableTableRow key={index}>
                      <EditableTableCell className="px-3 font-medium">
                        {index + 1}
                      </EditableTableCell>
                      <NaimenovanieCells
                        index={index}
                        form={form}
                        errors={errors}
                        tabIndex={tabIndex}
                        isExisting={isExisting}
                        onOpenModal={() => {
                          spravochnikToggle.open()
                          setRowIndex(index)
                        }}
                        onChangeField={updateFormField}
                      />
                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.kol`}
                            render={({ field, fieldState }) => (
                              <NumericInput
                                adjustWidth
                                value={field.value || 0}
                                onValueChange={(values, src) => {
                                  const row = form.getValues(`childs.${index}`)
                                  const summa = calcSumma(values.floatValue ?? 0, row.sena)

                                  if (src.source === 'event' && summa !== row.summa) {
                                    updateFormField(index, 'summa', summa ?? 0)
                                  }
                                  field.onChange(values.floatValue ?? 0)

                                  if (values.floatValue === undefined) {
                                    const input = src.event?.currentTarget as HTMLInputElement
                                    if (input) {
                                      setTimeout(() => {
                                        input.setSelectionRange(0, 1)
                                      }, 0)
                                    }
                                  }
                                }}
                                editor
                                error={!!fieldState.error}
                                tabIndex={tabIndex}
                              />
                            )}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.sena`}
                            render={({ field, fieldState }) => (
                              <NumericInput
                                adjustWidth
                                value={field.value || 0}
                                onValueChange={(values, src) => {
                                  const row = form.getValues(`childs.${index}`)
                                  const summa = calcSumma(row.kol, values.floatValue ?? 0)
                                  if (src.source === 'event' && summa !== row.summa) {
                                    updateFormField(index, 'summa', summa ?? 0)
                                  }
                                  field.onChange(values.floatValue ?? 0)

                                  if (values.floatValue === undefined) {
                                    const input = src.event?.currentTarget as HTMLInputElement
                                    if (input) {
                                      setTimeout(() => {
                                        input.setSelectionRange(0, 1)
                                      }, 0)
                                    }
                                  }
                                }}
                                editor
                                error={!!fieldState.error}
                                tabIndex={tabIndex}
                                decimalScale={100}
                              />
                            )}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.summa`}
                            render={({ field, fieldState }) => (
                              <NumericInput
                                adjustWidth
                                value={field.value || 0}
                                defaultValue={0}
                                onValueChange={(values, src) => {
                                  const row = form.getValues(`childs.${index}`)
                                  const sena = calcSena(values.floatValue ?? 0, row.kol)
                                  if (
                                    src.source === 'event' &&
                                    sena !== row.sena &&
                                    (values.floatValue ?? 0) !== 0
                                  ) {
                                    updateFormField(index, 'sena', sena ?? 0)
                                  }
                                  field.onChange(values.floatValue ?? 0)

                                  if (values.floatValue === undefined) {
                                    const input = src.event?.currentTarget as HTMLInputElement
                                    if (input) {
                                      setTimeout(() => {
                                        input.setSelectionRange(0, 1)
                                      }, 0)
                                    }
                                  }
                                }}
                                editor
                                error={!!fieldState.error}
                                tabIndex={tabIndex}
                              />
                            )}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.nds_foiz`}
                            render={({ field, fieldState }) => (
                              <NumericInput
                                adjustWidth
                                isAllowed={(values) => (values.floatValue ?? 0) <= 99}
                                value={field.value || ''}
                                onValueChange={(values) => {
                                  field.onChange(values.floatValue ?? 0)
                                }}
                                editor
                                error={!!fieldState.error}
                                tabIndex={tabIndex}
                              />
                            )}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.nds_foiz`}
                            render={({ field }) => {
                              const kol = form.watch(`childs.${index}.kol`) || 0
                              const sena = form.watch(`childs.${index}.sena`) || 0
                              return (
                                <NumericInput
                                  readOnly
                                  adjustWidth
                                  value={
                                    field.value
                                      ? ((kol || 0) * (sena || 0) * (field.value || 0)) / 100 || 0
                                      : 0
                                  }
                                  editor
                                  className={inputVariants({
                                    editor: true,
                                    nonfocus: true
                                  })}
                                />
                              )
                            }}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.nds_foiz`}
                            render={({ field }) => {
                              const kol = form.watch(`childs.${index}.kol`) || 0
                              const sena = form.watch(`childs.${index}.sena`) || 0
                              return (
                                <NumericInput
                                  readOnly
                                  adjustWidth
                                  value={
                                    field.value
                                      ? (kol || 0) * (sena || 0) +
                                          ((kol || 0) * (sena || 0) * (field.value || 0)) / 100 || 0
                                      : 0
                                  }
                                  className={inputVariants({
                                    editor: true,
                                    nonfocus: true
                                  })}
                                />
                              )
                            }}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative flex items-center justify-center px-4">
                          <Checkbox
                            checked={row.iznos}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative flex items-center justify-center">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.eski_iznos_summa`}
                            render={({ field, fieldState }) => (
                              <NumericInput
                                adjustWidth
                                value={field.value || ''}
                                onValueChange={(values) => {
                                  field.onChange(values.floatValue)
                                }}
                                editor
                                error={!!fieldState.error}
                                tabIndex={tabIndex}
                              />
                            )}
                          />
                        </div>
                      </EditableTableCell>

                      {/* <EditableTableCell>
                        <div className="relative">
                          <Input
                            value={row.iznos_schet}
                            onChange={(e) => {
                              handleChangeChildField(index, 'iznos_schet', e.target.value)
                            }}
                            error={!!errors?.iznos_schet}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.iznos_schet
                            })}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative">
                          <Input
                            value={row.iznos_sub_schet}
                            onChange={(e) => {
                              handleChangeChildField(index, 'iznos_sub_schet', e.target.value)
                            }}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.iznos_sub_schet
                            })}
                            error={!!errors.iznos_sub_schet}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell> */}

                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.iznos_start`}
                            render={({ field, fieldState }) => {
                              const row = form.getValues(`childs.${index}`)
                              return (
                                <JollyDatePicker
                                  readOnly={!row.iznos}
                                  value={field.value ?? ''}
                                  onChange={field.onChange}
                                  placeholder="дд.мм.гггг"
                                  containerProps={{
                                    className: 'min-w-32'
                                  }}
                                  editor
                                  error={!!fieldState.error}
                                  tabIndex={tabIndex}
                                />
                              )
                            }}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.debet_schet`}
                            render={({ field, fieldState }) => (
                              <Input
                                readOnly
                                value={field.value}
                                editor
                                error={!!fieldState.error}
                                tabIndex={tabIndex}
                              />
                            )}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.debet_sub_schet`}
                            render={({ field, fieldState }) => (
                              <Input
                                readOnly
                                value={field.value}
                                editor
                                error={!!fieldState.error}
                                tabIndex={tabIndex}
                              />
                            )}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <Controller
                          control={form.control}
                          name={`childs.${index}.kredit_schet`}
                          render={({ field, fieldState }) => (
                            <SchetEditor
                              tabIndex={tabIndex}
                              error={fieldState.error}
                              value={field.value}
                              onChange={(schet) => {
                                field.onChange(schet)
                              }}
                            />
                          )}
                        />
                      </EditableTableCell>
                      <EditableTableCell className="w-[140px]">
                        <Controller
                          control={form.control}
                          name={`childs.${index}.kredit_sub_schet`}
                          render={({ field, fieldState }) => (
                            <Input
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value)
                              }}
                              editor
                              error={!!fieldState.error}
                              tabIndex={tabIndex}
                            />
                          )}
                        />
                      </EditableTableCell>

                      {/* <EditableTableCell colSpan={2}>
                        <div className="relative">
                          <Input
                            value={row.kredit_schet}
                            onChange={(e) => {
                              handleChangeChildField(index, 'kredit_schet', e.target.value)
                            }}
                            error={!!errors?.kredit_schet}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.kredit_schet
                            })}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative">
                          <Input
                            value={row.kredit_sub_schet}
                            onChange={(e) => {
                              handleChangeChildField(index, 'kredit_sub_schet', e.target.value)
                            }}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.kredit_sub_schet
                            })}
                            error={!!errors.kredit_sub_schet}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell> */}

                      <EditableTableCell>
                        <div className="relative">
                          <Controller
                            control={form.control}
                            name={`childs.${index}.data_pereotsenka`}
                            render={({ field, fieldState }) => (
                              <JollyDatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="дд.мм.гггг"
                                className={inputVariants({
                                  editor: true,
                                  error: !!fieldState.error
                                })}
                                containerProps={{
                                  className: 'min-w-32'
                                }}
                                error={!!fieldState.error}
                                tabIndex={tabIndex}
                                validate={
                                  params.id === 'create'
                                    ? validateDateWithinSelectedMonth
                                    : undefined
                                }
                                calendarProps={
                                  params.id === 'create'
                                    ? {
                                        fromMonth: startDate,
                                        toMonth: endDate
                                      }
                                    : undefined
                                }
                              />
                            )}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell className="whitespace-nowrap w-0 sticky right-0 border-l">
                        <Button
                          type="button"
                          variant="ghost"
                          className="hover:bg-slate-50 hover:text-brand text-red-500"
                          onClick={() => remove(index)}
                          tabIndex={tabIndex}
                        >
                          <CircleMinus className="btn-icon !mx-0" />
                        </Button>
                      </EditableTableCell>
                    </EditableTableRow>
                  )
                })
              ) : (
                <EditableTableRow>
                  <EditableTableCell
                    colSpan={100}
                    className="text-center p-5"
                  >
                    <EmptyList
                      iconProps={{
                        className: 'w-40'
                      }}
                    >
                      {t('no-display-data')}
                    </EmptyList>
                  </EditableTableCell>
                </EditableTableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div>
        <Button
          type="button"
          variant="ghost"
          className="w-full hover:bg-slate-50 text-brand hover:text-brand border"
          tabIndex={tabIndex}
          onClick={() => {
            append(defaultValues.childs[0])
            setTimeout(() => {
              setPage(Math.ceil(fields.length + 1 / PAGE_SIZE))
            })
          }}
        >
          <CirclePlus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </div>
      <div className="mt-5 flex items-center justify-center">
        <Pagination
          disablePageSize={false}
          page={page}
          limit={PAGE_SIZE}
          onChange={({ page }) => setPage(page ?? 1)}
          count={fields.length}
          pageCount={pageCount}
        />
      </div>
    </div>
  )
}

type NaimenovanieCellsProps = {
  index: number
  form: UseFormReturn<MaterialPrixodFormValues>
  tabIndex: number
  isExisting: boolean
  errors: Merge<FieldError, FieldErrorsImpl<MaterialPrixodProvodkaFormValues>>
  onOpenModal: VoidFunction
  onChangeField: (
    index: number,
    key: keyof MaterialPrixodProvodkaFormValues,
    value: unknown
  ) => void
}
const NaimenovanieCells = ({
  index,
  form,
  errors,
  tabIndex,
  isExisting,
  onOpenModal,
  onChangeField
}: NaimenovanieCellsProps) => {
  const groupSpravochnik = useSpravochnik(
    createGroupSpravochnik({
      value: form.watch(`childs.${index}.group_jur7_id`),
      onChange: (id, group) => {
        const iznos = group && group?.iznos_foiz > 0
        onChangeField(index, 'debet_schet', group?.schet ?? '')
        onChangeField(index, 'debet_sub_schet', group?.provodka_subschet ?? '')
        onChangeField(index, 'kredit_sub_schet', group?.provodka_subschet ?? '')
        onChangeField(index, 'group_jur7_id', id)
        onChangeField(index, 'iznos', iznos)
        onChangeField(index, 'iznos_schet', iznos ? (group?.schet ?? '') : '')
        onChangeField(index, 'iznos_sub_schet', iznos ? (group?.provodka_subschet ?? '') : '')
        onChangeField(index, 'iznos_start', iznos ? (form.watch('doc_date') ?? '') : '')
      }
    })
  )

  const handleOpenModal = () => {
    if (isExisting) {
      onChangeField(index, 'product_id', 0)
    } else {
      onOpenModal()
    }
  }

  return (
    <>
      <EditableTableCell>
        <div className="relative">
          <SpravochnikInput
            tabIndex={tabIndex}
            readOnly
            error={!!errors.group_jur7_id}
            className={cn(
              inputVariants({ editor: true, error: !!errors.group_jur7_id }),
              'disabled:opacity-100'
            )}
            getInputValue={(selected) => (selected?.group_number || selected?.name) ?? ''}
            {...groupSpravochnik}
            disabled={isExisting}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Controller
            control={form.control}
            name={`childs.${index}.name`}
            render={({ field, fieldState }) => (
              <Input
                tabIndex={tabIndex}
                error={!!fieldState.error}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                editor
                onDoubleClick={handleOpenModal}
                readOnly={isExisting}
              />
            )}
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 group bg-white"
            onClick={handleOpenModal}
          >
            {isExisting ? (
              <>
                <XCircle className="btn-icon hidden group-hover:block text-red-500" />
                <Warehouse className="btn-icon text-brand group-hover:hidden" />
              </>
            ) : (
              <LayoutList className="btn-icon" />
            )}
          </Button>
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Controller
            control={form.control}
            name={`childs.${index}.serial_num`}
            render={({ field, fieldState }) => (
              <Input
                tabIndex={tabIndex}
                editor
                error={!!fieldState.error}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                readOnly={isExisting}
              />
            )}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Controller
            control={form.control}
            name={`childs.${index}.inventar_num`}
            render={({ field, fieldState }) => (
              <Input
                tabIndex={tabIndex}
                editor
                error={!!fieldState.error}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                readOnly={isExisting}
              />
            )}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Controller
            control={form.control}
            name={`childs.${index}.unit_id`}
            render={({ field, fieldState }) => (
              <EdinSelect
                error={!!fieldState.error}
                tabIndex={tabIndex}
                selectedKey={field.value ?? null}
                onSelectionChange={(value) => {
                  field.onChange(value ? Number(value) : undefined)
                }}
                isDisabled={isExisting}
              />
            )}
          />
        </div>
      </EditableTableCell>
    </>
  )
}
