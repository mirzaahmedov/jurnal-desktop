import { useState } from 'react'

import { CircleMinus, CirclePlus } from 'lucide-react'
import { type UseFormReturn, useFieldArray, useWatch } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { SaldoProductSpravochnikDialog } from '@/app/jur_7/saldo/components/spravochnik-dialog'
import { NumericInput } from '@/common/components'
import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@/common/components/editable-table'
import { SchetEditor, SubSchetEditor } from '@/common/components/editable-table/editors'
import { EmptyList } from '@/common/components/empty-states'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Input } from '@/common/components/ui/input'
import { Table, TableBody, TableHeader } from '@/common/components/ui/table'
import { inputVariants } from '@/common/features/spravochnik'
import { useToggle } from '@/common/hooks'
import { formatDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { calcSena, calcSumma } from '@/common/lib/pricing'

import { type InternalFormValues, type InternalProvodkaFormValues, defaultValues } from '../config'

type ProvodkaTableProps = {
  form: UseFormReturn<InternalFormValues>
  tabIndex: number
}
export const ProvodkaTable = ({ form, tabIndex }: ProvodkaTableProps) => {
  const spravochnikToggle = useToggle()

  const [rowIndex, setRowIndex] = useState(0)

  const { t } = useTranslation()

  const { fields, remove, insert, append } = useFieldArray({
    control: form.control,
    name: 'childs'
  })

  return (
    <div className="m-5">
      <div className="w-full overflow-x-auto scrollbar relative">
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
          className="w-[2200px]"
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
                  prixod_dates: p?.prixodData.map((prixod) => ({
                    date: prixod.docDate
                  })),
                  data_pereotsenka: p?.prixodData?.[0]?.docDate ?? '',
                  iznos: p.iznos,
                  iznos_summa: p.to.iznos_summa,
                  iznos_schet: p.iznos_schet,
                  iznos_sub_schet: p.iznos_sub_schet,
                  iznos_start: p.iznos_start ? formatDate(p.iznos_start) : '',
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
                <EditableTableHead
                  rowSpan={2}
                  className="min-w-48"
                >
                  {t('prixod_date')}
                </EditableTableHead>
                <EditableTableHead
                  rowSpan={2}
                  className="sticky right-0 border-l"
                ></EditableTableHead>
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
              {Array.isArray(fields) ? (
                fields.map((field, index) => {
                  return (
                    <Provodka
                      tabIndex={tabIndex}
                      key={field.id}
                      rowIndex={index}
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
          </Table>
        </div>
      </div>
      <div className="w-full">
        <Button
          type="button"
          variant="ghost"
          className="w-full hover:bg-slate-50 text-brand hover:text-brand border"
          tabIndex={tabIndex}
          onClick={() => {
            append(defaultValues.childs[0])
          }}
        >
          <CirclePlus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </div>
    </div>
  )
}

type ProvodkaProps = {
  rowIndex: number
  form: UseFormReturn<InternalFormValues>
  tabIndex: number
  onOpenDialog: (rowIndex: number) => void
  onRemove: (rowIndex: number) => void
}
const Provodka = ({ rowIndex, onOpenDialog, onRemove, form, tabIndex }: ProvodkaProps) => {
  const handleChangeChildField = (
    index: number,
    key: keyof InternalProvodkaFormValues,
    value: unknown
  ) => {
    form.setValue(`childs.${index}.${key}`, value as string | number)
    form.trigger(`childs.${index}.${key}`)
  }

  const iznos = useWatch({
    control: form.control,
    name: `childs.${rowIndex}.iznos`
  })

  console.log('debet_schet', form.watch(`childs.${rowIndex}.debet_schet`))
  console.log('debet_sub_schet', form.watch(`childs.${rowIndex}.debet_sub_schet`))

  return (
    <EditableTableRow key={rowIndex}>
      <NaimenovanieCells
        form={form}
        rowIndex={rowIndex}
        kimdan_id={form.watch('kimdan_id')}
        tabIndex={tabIndex}
        openDialog={() => {
          onOpenDialog(rowIndex)
        }}
      />
      <EditableTableCell>
        <div className="relative">
          <Controller
            control={form.control}
            name={`childs.${rowIndex}.kol`}
            render={({ field, fieldState }) => (
              <NumericInput
                adjustWidth
                allowNegative={false}
                decimalScale={100}
                isAllowed={(values) =>
                  (values.floatValue ?? 0) <=
                  (form.getValues(`childs.${rowIndex}`).max_kol || Infinity)
                }
                value={field.value || 0}
                onValueChange={(values, src) => {
                  const row = form.getValues(`childs.${rowIndex}`)
                  const summa = calcSumma(values.floatValue ?? 0, row.sena)
                  if (src.source === 'event' && summa !== row.summa) {
                    handleChangeChildField(rowIndex, 'summa', summa ?? 0)
                  }
                  field.onChange(values.floatValue ?? 0)
                }}
                className={inputVariants({
                  editor: true,
                  error: !!fieldState.error
                })}
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
            name={`childs.${rowIndex}.sena`}
            render={({ field, fieldState }) => (
              <NumericInput
                adjustWidth
                allowNegative={false}
                value={field.value || 0}
                onValueChange={(values, src) => {
                  const row = form.getValues(`childs.${rowIndex}`)
                  const summa = calcSumma(row.kol, values.floatValue ?? 0)
                  if (src.source === 'event' && summa !== row.summa) {
                    handleChangeChildField(rowIndex, 'summa', summa ?? 0)
                  }
                  field.onChange(values.floatValue ?? 0)
                }}
                className={inputVariants({
                  editor: true,
                  error: !!fieldState.error
                })}
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
            name={`childs.${rowIndex}.summa`}
            render={({ field, fieldState }) => (
              <NumericInput
                adjustWidth
                allowNegative={false}
                value={field.value || 0}
                onValueChange={(values, src) => {
                  const row = form.getValues(`childs.${rowIndex}`)
                  const sena = calcSena(values.floatValue ?? 0, row.kol)
                  if (
                    src.source === 'event' &&
                    (values.floatValue ?? 0) !== 0 &&
                    row.sena !== sena
                  ) {
                    handleChangeChildField(rowIndex, 'sena', sena ?? 0)
                  }
                  field.onChange(values.floatValue ?? 0)
                }}
                className={inputVariants({
                  editor: true,
                  error: !!fieldState.error
                })}
                error={!!fieldState.error}
                tabIndex={tabIndex}
              />
            )}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative flex items-center justify-center px-4">
          <Controller
            control={form.control}
            name={`childs.${rowIndex}.iznos`}
            render={({ field }) => (
              <Checkbox
                disabled
                checked={field.value}
                tabIndex={tabIndex}
              />
            )}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative flex items-center justify-center">
          <Controller
            control={form.control}
            name={`childs.${rowIndex}.iznos_summa`}
            render={({ field, fieldState }) => (
              <NumericInput
                disabled={!iznos}
                adjustWidth
                value={field.value || ''}
                onValueChange={(values) => {
                  field.onChange(values.floatValue ?? 0)
                }}
                className={inputVariants({
                  editor: true,
                  error: !!fieldState.error,
                  className: 'w-40'
                })}
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
            name={`childs.${rowIndex}.iznos_schet`}
            render={({ field, fieldState }) => (
              <Input
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                error={!!fieldState.error}
                className={inputVariants({
                  editor: true,
                  error: !!fieldState.error
                })}
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
            name={`childs.${rowIndex}.iznos_sub_schet`}
            render={({ field, fieldState }) => (
              <Input
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
                className={inputVariants({
                  editor: true,
                  error: !!fieldState.error
                })}
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
            name={`childs.${rowIndex}.iznos_start`}
            render={({ field, fieldState }) => (
              <JollyDatePicker
                disabled
                value={field.value ?? ''}
                onChange={(date) => {
                  field.onChange(date)
                }}
                placeholder="дд.мм.гггг"
                className={inputVariants({
                  editor: true,
                  error: !!fieldState.error,
                  className: 'disabled:opacity-100'
                })}
                containerProps={{
                  className: 'min-w-32'
                }}
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
            name={`childs.${rowIndex}.debet_schet`}
            render={({ field, fieldState }) => (
              <SchetEditor
                value={field.value || ''}
                onChange={field.onChange}
                error={fieldState.error}
                tabIndex={tabIndex}
                className="w-24"
              />
            )}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Controller
            control={form.control}
            name={`childs.${rowIndex}.debet_sub_schet`}
            render={({ field, fieldState }) => (
              <SubSchetEditor
                schet={form.watch(`childs.${rowIndex}.debet_schet`)}
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value)
                }}
                error={fieldState.error}
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
            name={`childs.${rowIndex}.kredit_schet`}
            render={({ field, fieldState }) => (
              <Input
                readOnly
                value={field.value || ''}
                className={inputVariants({
                  editor: true,
                  error: !!fieldState.error
                })}
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
            name={`childs.${rowIndex}.kredit_sub_schet`}
            render={({ field, fieldState }) => (
              <SubSchetEditor
                schet={form.watch(`childs.${rowIndex}.kredit_schet`)}
                value={field.value || ''}
                onChange={(value) => {
                  field.onChange(value)
                }}
                error={fieldState.error}
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
            name={`childs.${rowIndex}.data_pereotsenka`}
            render={({ field, fieldState }) => (
              <JollySelect
                triggerClassName={inputVariants({
                  editor: true,
                  error: !!fieldState.error
                })}
                selectedKey={field.value || ''}
                onSelectionChange={(value) => {
                  field.onChange(value as string)
                }}
                items={form.watch(`childs.${rowIndex}.prixod_dates`) ?? []}
                placeholder=""
              >
                {(item) => <SelectItem id={item.date}>{formatLocaleDate(item.date)}</SelectItem>}
              </JollySelect>
            )}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell className="whitespace-nowrap w-0 px-1 sticky right-0 border-l">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-slate-50 hover:text-brand text-red-500"
          onClick={() => {
            onRemove(rowIndex)
          }}
          tabIndex={tabIndex}
        >
          <CircleMinus className="btn-icon" />
        </Button>
      </EditableTableCell>
    </EditableTableRow>
  )
}

type NaimenovanieCellsProps = {
  form: UseFormReturn<InternalFormValues>
  rowIndex: number
  kimdan_id: number
  tabIndex: number
  openDialog: VoidFunction
}
const NaimenovanieCells = ({
  form,
  rowIndex,
  kimdan_id,
  tabIndex,
  openDialog
}: NaimenovanieCellsProps) => {
  const errors = form.formState.errors.childs?.[rowIndex]
  const row = useWatch({
    control: form.control,
    name: `childs.${rowIndex}`
  })

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
              error: !!errors?.naimenovanie_tovarov_jur7_id,
              className: 'w-28'
            })}
            error={!!errors?.naimenovanie_tovarov_jur7_id}
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
                error={!!errors?.naimenovanie_tovarov_jur7_id}
                tabIndex={-1}
                className={inputVariants({
                  editor: true,
                  error: !!errors?.naimenovanie_tovarov_jur7_id
                })}
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
