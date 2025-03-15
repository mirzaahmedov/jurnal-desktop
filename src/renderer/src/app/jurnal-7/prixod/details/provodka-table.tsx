import type { FieldError, FieldErrorsImpl, Merge, UseFormReturn } from 'react-hook-form'

import { useEffect, useState } from 'react'

import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import { Pagination } from '@renderer/common/components/pagination'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import { useEventCallback } from '@renderer/common/hooks'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { DatePicker, EdinSelect, NumericInput } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Table, TableBody, TableHeader } from '@/common/components/ui/table'
import { SpravochnikInput, inputVariants, useSpravochnik } from '@/common/features/spravochnik'
import { calcSena, calcSumma } from '@/common/lib/pricing'
import { cn } from '@/common/lib/utils'

import { type PrixodChildFormValues, type PrixodFormValues, defaultValues } from '../config'

const PAGE_SIZE = 20

type ProvodkaTableProps = {
  tabIndex: number
  form: UseFormReturn<PrixodFormValues>
}
export const ProvodkaTable = ({ form, tabIndex, ...props }: ProvodkaTableProps) => {
  const [page, setPage] = useState(1)

  const { t } = useTranslation()

  const childs = form.watch('childs')
  const pageCount = Math.ceil(childs.length / PAGE_SIZE)

  const handleChangeChildField = useEventCallback(
    (index: number, key: keyof PrixodChildFormValues, value: unknown) => {
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
      <div className="overflow-x-auto scrollbar">
        <div
          onFocus={(e) => {
            e.currentTarget.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            })
          }}
          className="w-[2500px]"
        >
          <Table
            className="relative border border-slate-200 table-xs"
            {...props}
          >
            <TableHeader className="sticky top-0 z-50">
              <EditableTableRow>
                <EditableTableHead rowSpan={2}>
                  <div className="px-3">№</div>
                </EditableTableHead>
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
                <EditableTableHead rowSpan={2}>{t('ei')}</EditableTableHead>
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
                  colSpan={5}
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

                <EditableTableHead rowSpan={2}>{t('prixod-date')}</EditableTableHead>
                <EditableTableHead rowSpan={2}></EditableTableHead>
              </EditableTableRow>
              <EditableTableRow>
                <EditableTableHead>{t('iznos')}</EditableTableHead>
                <EditableTableHead
                  className="text-end"
                  style={{ width: 150 }}
                >
                  {t('iznos_summa_old')}
                </EditableTableHead>
                <EditableTableHead>{t('schet')}</EditableTableHead>
                <EditableTableHead>{t('subschet')}</EditableTableHead>
                <EditableTableHead>{t('iznos_start_date')}</EditableTableHead>

                <EditableTableHead>{t('schet')}</EditableTableHead>
                <EditableTableHead>{t('subschet')}</EditableTableHead>
                <EditableTableHead>{t('schet')}</EditableTableHead>
                <EditableTableHead className="last:border-solid">{t('subschet')}</EditableTableHead>
              </EditableTableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(childs) ? (
                childs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((row, rowIndex) => {
                  const index = (page - 1) * PAGE_SIZE + rowIndex
                  const errors = form.formState.errors.childs?.[index] || {}
                  return (
                    <EditableTableRow key={index}>
                      <EditableTableCell className="px-3 font-medium bg-slate-50">
                        {index + 1}
                      </EditableTableCell>
                      <NaimenovanieCells
                        index={index}
                        row={row}
                        form={form}
                        errors={errors}
                        tabIndex={tabIndex}
                        onChangeField={handleChangeChildField}
                      />
                      <EditableTableCell>
                        <div className="relative">
                          <NumericInput
                            adjustWidth
                            value={row.kol || ''}
                            onValueChange={(values, src) => {
                              const summa = calcSumma(values.floatValue ?? 0, row.sena)
                              if (src.source === 'event' && summa !== row.summa) {
                                handleChangeChildField(index, 'summa', summa)
                              }
                              handleChangeChildField(index, 'kol', values.floatValue)
                            }}
                            error={!!errors.kol}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.kol
                            })}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative">
                          <NumericInput
                            adjustWidth
                            value={row.sena || ''}
                            onValueChange={(values, src) => {
                              const summa = calcSumma(row.kol, values.floatValue ?? 0)
                              if (src.source === 'event' && summa !== row.summa) {
                                handleChangeChildField(index, 'summa', summa)
                              }
                              handleChangeChildField(index, 'sena', values.floatValue)
                            }}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.sena
                            })}
                            error={!!errors.sena}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative">
                          <NumericInput
                            adjustWidth
                            value={row.summa || ''}
                            onValueChange={(values, src) => {
                              const sena = calcSena(values.floatValue ?? 0, row.kol)
                              if (
                                src.source === 'event' &&
                                sena !== row.sena &&
                                (values.floatValue ?? 0) !== 0
                              ) {
                                handleChangeChildField(index, 'sena', sena)
                              }
                              handleChangeChildField(index, 'summa', values.floatValue)
                            }}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.summa
                            })}
                            error={!!errors.summa}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <NumericInput
                            adjustWidth
                            isAllowed={(values) => (values.floatValue ?? 0) <= 99}
                            value={row.nds_foiz || ''}
                            onValueChange={(values) => {
                              handleChangeChildField(index, 'nds_foiz', values.floatValue)
                            }}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.nds_foiz
                            })}
                            error={!!errors.nds_foiz}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <NumericInput
                            readOnly
                            adjustWidth
                            value={
                              ((row.kol || 0) * (row.sena || 0) * (row.nds_foiz || 0)) / 100 || ''
                            }
                            className={inputVariants({
                              editor: true,
                              nonfocus: true
                            })}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <NumericInput
                            readOnly
                            adjustWidth
                            value={
                              (row.kol || 0) * (row.sena || 0) +
                                ((row.kol || 0) * (row.sena || 0) * (row.nds_foiz || 0)) / 100 || ''
                            }
                            className={inputVariants({
                              editor: true,
                              nonfocus: true
                            })}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative flex items-center justify-center px-4">
                          <Checkbox
                            disabled
                            checked={row.iznos}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative flex items-center justify-center">
                          <NumericInput
                            disabled={!row.iznos}
                            adjustWidth
                            value={row.eski_iznos_summa || ''}
                            onValueChange={(values) => {
                              handleChangeChildField(index, 'eski_iznos_summa', values.floatValue)
                            }}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.eski_iznos_summa
                            })}
                            error={!!errors.eski_iznos_summa}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <Input
                            readOnly={!row.iznos}
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
                            readOnly={!row.iznos}
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
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <DatePicker
                            readOnly={!row.iznos}
                            value={row.iznos_start ?? ''}
                            onChange={(date) => {
                              handleChangeChildField(index, 'iznos_start', date)
                            }}
                            placeholder="дд.мм.гггг"
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.iznos_start
                            })}
                            triggerProps={{
                              className: 'min-w-32'
                            }}
                            error={!!errors.iznos_start}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <Input
                            value={row.debet_schet}
                            onChange={(e) => {
                              handleChangeChildField(index, 'debet_schet', e.target.value)
                            }}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.debet_schet
                            })}
                            error={!!errors.debet_schet}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>
                      <EditableTableCell>
                        <div className="relative">
                          <Input
                            value={row.debet_sub_schet}
                            onChange={(e) => {
                              handleChangeChildField(index, 'debet_sub_schet', e.target.value)
                            }}
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.debet_sub_schet
                            })}
                            error={!!errors.debet_sub_schet}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell>
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
                      </EditableTableCell>

                      <EditableTableCell>
                        <div className="relative">
                          <DatePicker
                            value={row.data_pereotsenka}
                            onChange={(date) => {
                              handleChangeChildField(index, 'data_pereotsenka', date)
                            }}
                            placeholder="дд.мм.гггг"
                            className={inputVariants({
                              editor: true,
                              error: !!errors?.data_pereotsenka
                            })}
                            triggerProps={{
                              className: 'min-w-32'
                            }}
                            error={!!errors.data_pereotsenka}
                            tabIndex={tabIndex}
                          />
                        </div>
                      </EditableTableCell>

                      <EditableTableCell className="whitespace-nowrap w-0">
                        <Button
                          type="button"
                          variant="ghost"
                          className="hover:bg-slate-50 hover:text-brand text-red-500"
                          onClick={() => {
                            const childs = form.getValues('childs')
                            if (!Array.isArray(childs) || childs.length === 1) {
                              return
                            }
                            form.setValue(
                              'childs',
                              childs.filter((_, i) => i !== index)
                            )
                          }}
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
                    className="text-center"
                  >
                    {t('no-display-data')}
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
            const newChilds = [
              ...form.getValues('childs'),
              {
                ...defaultValues.childs[0],
                kredit_schet: form.getValues('j_o_num'),
                data_pereotsenka: form.getValues('doc_date')
              }
            ]
            form.setValue('childs', newChilds)
            setTimeout(() => {
              setPage(Math.ceil(newChilds.length / PAGE_SIZE))
            })
          }}
        >
          <CirclePlus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </div>
      <div className="mt-5 flex items-center justify-center">
        <Pagination
          displayLimit={false}
          page={page}
          limit={PAGE_SIZE}
          onChange={({ page }) => setPage(page ?? 1)}
          pageCount={pageCount}
        />
      </div>
    </div>
  )
}

type NaimenovanieCellsProps = {
  index: number
  row: PrixodChildFormValues
  form: UseFormReturn<PrixodFormValues>
  tabIndex: number
  errors: Merge<FieldError, FieldErrorsImpl<PrixodChildFormValues>>
  onChangeField: (index: number, key: keyof PrixodChildFormValues, value: unknown) => void
}
const NaimenovanieCells = ({
  index,
  row,
  form,
  errors,
  tabIndex,
  onChangeField
}: NaimenovanieCellsProps) => {
  const groupSpravochnik = useSpravochnik(
    createGroupSpravochnik({
      value: row.group_jur7_id,
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
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Input
            tabIndex={tabIndex}
            error={!!errors.name}
            value={row.name}
            onChange={(e) => {
              onChangeField(index, 'name', e.target.value)
            }}
            className={inputVariants({ editor: true, error: !!errors.name })}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Input
            tabIndex={tabIndex}
            error={!!errors.serial_num}
            value={row.serial_num}
            onChange={(e) => {
              onChangeField(index, 'serial_num', e.target.value)
            }}
            className={inputVariants({ editor: true, error: !!errors.serial_num })}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Input
            tabIndex={tabIndex}
            error={!!errors.inventar_num}
            value={row.inventar_num}
            onChange={(e) => {
              onChangeField(index, 'inventar_num', e.target.value)
            }}
            className={inputVariants({ editor: true, error: !!errors.inventar_num })}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <EdinSelect
            tabIndex={tabIndex}
            error={!!errors.edin}
            value={row.edin}
            onValueChange={(edin) => {
              onChangeField(index, 'edin', edin)
            }}
            triggerClassName={inputVariants({ editor: true, error: !!errors.edin })}
          />
        </div>
      </EditableTableCell>
    </>
  )
}
