import { useState } from 'react'

import { CircleMinus, CirclePlus } from 'lucide-react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { DatePicker, NumericInput } from '@/common/components'
import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@/common/components/editable-table'
import { SchetEditor, SubSchetEditor } from '@/common/components/editable-table/editors'
import { EmptyList } from '@/common/components/empty-states'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Input } from '@/common/components/ui/input'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { inputVariants } from '@/common/features/spravochnik'
import { useToggle } from '@/common/hooks'
import { formatDate } from '@/common/lib/date'
import { calcSena, calcSumma } from '@/common/lib/pricing'

import { SaldoProductSpravochnikDialog } from '../../saldo/components/spravochnik-dialog'
import { type InternalFormValues, type InternalProvodkaFormValues, defaultValues } from '../config'

type ProvodkaTableProps = {
  form: UseFormReturn<InternalFormValues>
  tabIndex: number
}
export const ProvodkaTable = ({ form, tabIndex }: ProvodkaTableProps) => {
  const spravochnikToggle = useToggle()

  const [rowIndex, setRowIndex] = useState(0)

  const { t } = useTranslation()

  const { remove, insert, append } = useFieldArray({
    control: form.control,
    name: 'childs'
  })

  return (
    <div
      onSubmit={(e) => {
        e.preventDefault()
      }}
      onFocus={(e) => {
        e.currentTarget.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }}
      className="w-[2000px]"
    >
      <SaldoProductSpravochnikDialog
        responsible_id={form.watch('kimdan_id')}
        to={form.watch('doc_date')}
        open={spravochnikToggle.isOpen}
        disabledIds={form
          .watch('childs')
          .map((child) => child.naimenovanie_tovarov_jur7_id)
          .filter(Boolean)}
        onOpenChange={spravochnikToggle.setOpen}
        onSelect={(products) => {
          remove(rowIndex)
          insert(
            rowIndex,
            products.map((p) => ({
              naimenovanie_tovarov_jur7_id: p.product_id,
              name: p.name,
              group_number: p.group_number ?? p.group_name,
              edin: p.edin,
              inventar_num: p.inventar_num,
              serial_num: p.serial_num,
              kol: p.to.kol,
              max_kol: p.to.kol,
              sena: p.to.sena,
              summa: calcSumma(p.to.kol, p.to.sena),
              debet_schet: p.debet_schet ?? '',
              kredit_schet: p?.debet_schet ?? '',
              debet_sub_schet: p?.debet_sub_schet ?? '',
              kredit_sub_schet: p?.debet_sub_schet ?? '',
              data_pereotsenka: formatDate(p.prixodData?.docDate),
              iznos: p.iznos,
              iznos_summa: p.to.iznos_summa,
              iznos_schet: p.iznos_schet,
              iznos_sub_schet: p.iznos_sub_schet,
              iznos_start: p.iznos_start ?? undefined,
              group_jur7_id: p.group_id
            }))
          )
        }}
      />
      <Table className="border border-slate-200 table-xs">
        <TableHeader>
          <EditableTableRow>
            <EditableTableHead rowSpan={2}>{t('code')}</EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="min-w-72"
            >
              {t('product-name')}
            </EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="w-20"
            >
              {t('group')}
            </EditableTableHead>
            <EditableTableHead rowSpan={2}>{t('ei')}</EditableTableHead>
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
            <EditableTableHead rowSpan={2}>{t('prixod_date')}</EditableTableHead>
            <EditableTableHead rowSpan={2}></EditableTableHead>
          </EditableTableRow>
          <EditableTableRow>
            <EditableTableHead>{t('iznos')}</EditableTableHead>
            <EditableTableHead
              className="text-right"
              style={{ width: 150 }}
            >
              {t('summa')}
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
          {Array.isArray(form.watch('childs')) && form.watch('childs').length ? (
            form.watch('childs').map((row, index) => {
              return (
                <Provodka
                  tabIndex={tabIndex}
                  key={index}
                  rowIndex={index}
                  row={row}
                  form={form}
                  onRemove={remove}
                  onOpenDialog={(index) => {
                    spravochnikToggle.open()
                    setRowIndex(index)
                  }}
                />
              )
            })
          ) : (
            <EditableTableRow>
              <EditableTableCell colSpan={100}>
                <div className="grid place-items-center text-center p-5">
                  <EmptyList className="size-36" />
                </div>
              </EditableTableCell>
            </EditableTableRow>
          )}
        </TableBody>
        <TableFooter>
          <EditableTableRow>
            <EditableTableCell colSpan={100}>
              <Button
                type="button"
                variant="ghost"
                className="w-full hover:bg-slate-50 text-brand hover:text-brand"
                tabIndex={tabIndex}
                onClick={() => {
                  append({
                    ...defaultValues.childs[0],
                    data_pereotsenka: form.getValues('doc_date')
                  })
                }}
              >
                <CirclePlus className="btn-icon icon-start" /> {t('add')}
              </Button>
            </EditableTableCell>
          </EditableTableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

type ProvodkaProps = {
  rowIndex: number
  row: InternalProvodkaFormValues
  form: UseFormReturn<InternalFormValues>
  tabIndex: number
  onOpenDialog: (rowIndex: number) => void
  onRemove: (rowIndex: number) => void
}
const Provodka = ({ rowIndex, onOpenDialog, onRemove, row, form, tabIndex }: ProvodkaProps) => {
  const errors = form.formState.errors.childs?.[rowIndex]

  const handleChangeChildField = (
    index: number,
    key: keyof InternalProvodkaFormValues,
    value: unknown
  ) => {
    form.setValue(`childs.${index}.${key}`, value as string | number)
    form.trigger(`childs.${index}.${key}`)
  }

  return (
    <EditableTableRow key={rowIndex}>
      <NaimenovanieCells
        row={row}
        kimdan_id={form.watch('kimdan_id')}
        tabIndex={tabIndex}
        errorMessage={errors?.naimenovanie_tovarov_jur7_id?.message}
        openDialog={() => {
          onOpenDialog(rowIndex)
        }}
      />
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
            allowNegative={false}
            isAllowed={(values) => (values.floatValue ?? 0) <= (row.max_kol || Infinity)}
            value={row.kol || 0}
            onValueChange={(values, src) => {
              const summa = calcSumma(values.floatValue ?? 0, row.sena)
              if (src.source === 'event' && summa !== row.summa) {
                handleChangeChildField(rowIndex, 'summa', summa ?? 0)
              }
              handleChangeChildField(rowIndex, 'kol', values.floatValue ?? 0)
            }}
            className={inputVariants({
              editor: true,
              error: !!errors?.kol
            })}
            error={!!errors?.kol}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
            allowNegative={false}
            value={row.sena || 0}
            onValueChange={(values, src) => {
              const summa = calcSumma(row.kol, values.floatValue ?? 0)
              if (src.source === 'event' && summa !== row.summa) {
                handleChangeChildField(rowIndex, 'summa', summa ?? 0)
              }
              handleChangeChildField(rowIndex, 'sena', values.floatValue ?? 0)
            }}
            className={inputVariants({
              editor: true,
              error: !!errors?.sena
            })}
            error={!!errors?.sena}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
            allowNegative={false}
            value={row.summa || 0}
            onValueChange={(values, src) => {
              const sena = calcSena(values.floatValue ?? 0, row.kol)
              if (src.source === 'event' && (values.floatValue ?? 0) !== 0 && row.sena !== sena) {
                handleChangeChildField(rowIndex, 'sena', sena ?? 0)
              }
              handleChangeChildField(rowIndex, 'summa', values.floatValue ?? 0)
            }}
            className={inputVariants({
              editor: true,
              error: !!errors?.summa
            })}
            error={!!errors?.summa}
            tabIndex={tabIndex}
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
            value={row.iznos_summa || ''}
            onValueChange={(values) => {
              handleChangeChildField(rowIndex, 'iznos_summa', values.floatValue)
            }}
            className={inputVariants({
              editor: true,
              error: !!errors?.iznos_summa,
              className: 'w-40'
            })}
            error={!!errors?.iznos_summa}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <Input
            value={row.iznos_schet}
            onChange={(e) => {
              handleChangeChildField(rowIndex, 'iznos_schet', e.target.value)
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
              handleChangeChildField(rowIndex, 'iznos_sub_schet', e.target.value)
            }}
            className={inputVariants({
              editor: true,
              error: !!errors?.iznos_sub_schet
            })}
            error={!!errors?.iznos_sub_schet}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <DatePicker
            disabled
            value={row.iznos_start ?? ''}
            onChange={(date) => {
              handleChangeChildField(rowIndex, 'iznos_start', date)
            }}
            placeholder="дд.мм.гггг"
            className={inputVariants({
              editor: true,
              error: !!errors?.iznos_start,
              className: 'disabled:opacity-100'
            })}
            containerProps={{
              className: 'min-w-32'
            }}
            error={!!errors?.iznos_start}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <SchetEditor
            value={row.debet_schet}
            onChange={(value) => {
              handleChangeChildField(rowIndex, 'debet_schet', value)
              handleChangeChildField(rowIndex, 'debet_sub_schet', '')
            }}
            error={errors?.debet_schet}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <SubSchetEditor
            schet={row.debet_schet}
            value={row.debet_sub_schet}
            onChange={(value) => {
              handleChangeChildField(rowIndex, 'debet_sub_schet', value)
            }}
            error={errors?.debet_sub_schet}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <Input
            readOnly
            value={row.kredit_schet}
            className={inputVariants({
              editor: true,
              error: !!errors?.kredit_schet
            })}
            error={!!errors?.kredit_schet}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <SubSchetEditor
            schet={row.kredit_schet}
            value={row.kredit_sub_schet}
            onChange={(value) => {
              handleChangeChildField(rowIndex, 'kredit_sub_schet', value)
            }}
            error={errors?.kredit_sub_schet}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <DatePicker
            value={row.data_pereotsenka}
            onChange={(date) => {
              handleChangeChildField(rowIndex, 'data_pereotsenka', date)
            }}
            placeholder="дд.мм.гггг"
            className={inputVariants({
              editor: true,
              error: !!errors?.data_pereotsenka
            })}
            error={!!errors?.data_pereotsenka}
            containerProps={{
              className: 'min-w-32'
            }}
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
            onRemove(rowIndex)
          }}
          tabIndex={tabIndex}
        >
          <CircleMinus className="btn-icon !mx-0" />
        </Button>
      </EditableTableCell>
    </EditableTableRow>
  )
}

type NaimenovanieCellsProps = {
  row: InternalProvodkaFormValues
  kimdan_id: number
  tabIndex: number
  errorMessage?: string
  openDialog: VoidFunction
}
const NaimenovanieCells = ({
  row,
  kimdan_id,
  tabIndex,
  errorMessage,
  openDialog
}: NaimenovanieCellsProps) => {
  return (
    <>
      <EditableTableCell>
        <div className="relative">
          <Input
            readOnly
            disabled={!kimdan_id}
            tabIndex={tabIndex}
            value={row.naimenovanie_tovarov_jur7_id || ''}
            className={inputVariants({
              editor: true,
              error: !!errorMessage
            })}
            error={!!errorMessage}
            onDoubleClick={openDialog}
          />
        </div>
      </EditableTableCell>
      {[row.name, row.group_number, row.edin, row.serial_num, row.inventar_num].map(
        (field, index) => (
          <EditableTableCell key={index}>
            <div className="relative">
              <Input
                readOnly
                value={field ?? ''}
                error={!!errorMessage}
                tabIndex={-1}
                className={inputVariants({ editor: true, error: !!errorMessage })}
                disabled={!kimdan_id}
                onDoubleClick={openDialog}
              />
            </div>
          </EditableTableCell>
        )
      )}
    </>
  )
}
