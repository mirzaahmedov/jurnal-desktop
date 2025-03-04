import type { UseFormReturn } from 'react-hook-form'

import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import { useDefaultFilters } from '@renderer/common/features/app-defaults'
import { formatDate } from '@renderer/common/lib/date'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useOstatokProduct } from '@/app/jurnal-7/ostatok/use-ostatok-product'
import { DatePicker, NumericInput } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { SpravochnikInput, inputVariants } from '@/common/features/spravochnik'
import { calcSena, calcSumma } from '@/common/lib/pricing'

import {
  InternalTransferChildFormSchema,
  type InternalTransferChildFormType,
  type InternalTransferFormType,
  defaultValues
} from '../config'

type ProvodkaTableProps = {
  form: UseFormReturn<InternalTransferFormType>
  tabIndex: number
}
export const ProvodkaTable = ({ form, tabIndex }: ProvodkaTableProps) => {
  const { t } = useTranslation()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
      onFocus={(e) => {
        e.currentTarget.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }}
      className="whitespace-nowrap w-[2000px]"
    >
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
              className="w-48"
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
              rowSpan={2}
              colSpan={2}
              className="text-center"
            >
              {t('iznos')} / {t('iznos-eski')}
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
              colSpan={2}
              className="text-center"
            >
              {t('iznos')}
            </EditableTableHead>
            <EditableTableHead rowSpan={2}>{t('iznos_start_date')}</EditableTableHead>
            <EditableTableHead rowSpan={2}>{t('prixod-date')}</EditableTableHead>
            <EditableTableHead rowSpan={2}></EditableTableHead>
          </EditableTableRow>
          <EditableTableRow>
            <EditableTableHead>{t('schet')}</EditableTableHead>
            <EditableTableHead>{t('subschet')}</EditableTableHead>
            <EditableTableHead>{t('schet')}</EditableTableHead>
            <EditableTableHead>{t('subschet')}</EditableTableHead>
            <EditableTableHead>{t('schet')}</EditableTableHead>
            <EditableTableHead className="last:border-solid">{t('subschet')}</EditableTableHead>
          </EditableTableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(form.watch('childs')) ? (
            form.watch('childs').map((row, index) => {
              return (
                <Provodka
                  key={index}
                  index={index}
                  row={row}
                  form={form}
                  tabIndex={tabIndex}
                />
              )
            })
          ) : (
            <EditableTableRow>
              <EditableTableCell
                colSpan={100}
                className="text-center"
              >
                No data available.
              </EditableTableCell>
            </EditableTableRow>
          )}
        </TableBody>
        <TableFooter>
          <EditableTableRow>
            <EditableTableCell colSpan={100}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full hover:bg-slate-50 text-brand hover:text-brand"
                onClick={() => {
                  const childs = form.getValues('childs')
                  if (
                    !Array.isArray(childs) ||
                    !childs.every((c) => InternalTransferChildFormSchema.safeParse(c).success)
                  ) {
                    form.trigger('childs')
                    toast.error('Неверные данные')
                    return
                  }

                  form.setValue('childs', [
                    ...form.getValues('childs'),
                    {
                      ...defaultValues.childs[0],
                      data_pereotsenka: form.getValues('doc_date')
                    }
                  ])
                }}
              >
                <CirclePlus className="btn-icon icon-start" /> Добавить
              </Button>
            </EditableTableCell>
          </EditableTableRow>
        </TableFooter>
      </Table>
    </form>
  )
}

type ProvodkaProps = {
  index: number
  tabIndex: number
  row: InternalTransferChildFormType
  form: UseFormReturn<InternalTransferFormType>
}
const Provodka = ({ index, tabIndex, row, form }: ProvodkaProps) => {
  const handleChangeChildField = (
    index: number,
    key: keyof InternalTransferChildFormType,
    value: unknown
  ) => {
    form.setValue(`childs.${index}.${key}`, value as string | number)
    form.trigger(`childs.${index}.${key}`)
  }

  return (
    <EditableTableRow key={index}>
      <NaimenovanieCells
        index={index}
        tabIndex={tabIndex}
        form={form}
        row={row}
        kimdan_id={form.watch('kimdan_id')}
        doc_date={form.watch('doc_date')}
        errorMessage={form.formState.errors.childs?.[index]?.naimenovanie_tovarov_jur7_id?.message}
        updateFormField={handleChangeChildField}
      />
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
            tabIndex={tabIndex}
            allowNegative={false}
            isAllowed={(values) => (values.floatValue ?? 0) <= (row.max_kol || Infinity)}
            value={row.kol || ''}
            onValueChange={(values, src) => {
              const summa = calcSumma(values.floatValue ?? 0, row.sena)
              if (src.source === 'event' && summa !== row.summa) {
                handleChangeChildField(index, 'summa', summa)
              }
              handleChangeChildField(index, 'kol', values.floatValue ?? 0)
            }}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.kol
            })}
            error={!!form.formState.errors.childs?.[index]?.kol}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
            tabIndex={tabIndex}
            allowNegative={false}
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
              error: !!form.formState.errors.childs?.[index]?.sena
            })}
            error={!!form.formState.errors.childs?.[index]?.sena}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
            tabIndex={tabIndex}
            allowNegative={false}
            value={row.summa || ''}
            onValueChange={(values, src) => {
              const sena = calcSena(values.floatValue ?? 0, row.kol)
              if (src.source === 'event' && sena !== row.sena && (values.floatValue ?? 0) !== 0) {
                handleChangeChildField(index, 'sena', sena)
              }
              handleChangeChildField(index, 'summa', values.floatValue)
            }}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.summa
            })}
            error={!!form.formState.errors.childs?.[index]?.summa}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative flex items-center justify-center px-4">
          <Checkbox
            disabled
            checked={row.iznos}
            onCheckedChange={(checked) => {
              if (!checked) {
                handleChangeChildField(index, 'eski_iznos_summa', 0)
              }
              handleChangeChildField(index, 'iznos', Boolean(checked))
            }}
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
              error: !!form.formState.errors?.childs?.[index]?.eski_iznos_summa
            })}
            error={!!form.formState.errors?.childs?.[index]?.eski_iznos_summa}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <Input
            tabIndex={tabIndex}
            value={row.debet_schet}
            onChange={(e) => {
              handleChangeChildField(index, 'debet_schet', e.target.value)
            }}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.debet_schet
            })}
            error={!!form.formState.errors.childs?.[index]?.debet_schet}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Input
            tabIndex={tabIndex}
            value={row.debet_sub_schet}
            onChange={(e) => {
              handleChangeChildField(index, 'debet_sub_schet', e.target.value)
            }}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.debet_sub_schet
            })}
            error={!!form.formState.errors.childs?.[index]?.debet_sub_schet}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <Input
            tabIndex={tabIndex}
            value={row.kredit_schet}
            onChange={(e) => {
              handleChangeChildField(index, 'kredit_schet', e.target.value)
            }}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.kredit_schet
            })}
            error={!!form.formState.errors.childs?.[index]?.kredit_schet}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Input
            tabIndex={tabIndex}
            value={row.kredit_sub_schet}
            onChange={(e) => {
              handleChangeChildField(index, 'kredit_sub_schet', e.target.value)
            }}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.kredit_sub_schet
            })}
            error={!!form.formState.errors.childs?.[index]?.kredit_sub_schet}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <Input
            value={row.iznos_schet}
            onChange={(e) => {
              handleChangeChildField(index, 'iznos_schet', e.target.value)
            }}
            error={!!form.formState.errors?.childs?.[index]?.iznos_schet}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors?.childs?.[index]?.iznos_schet
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
              error: !!form.formState.errors?.childs?.[index]?.iznos_sub_schet
            })}
            error={!!form.formState.errors?.childs?.[index]?.iznos_sub_schet}
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
              handleChangeChildField(index, 'iznos_start', date)
            }}
            placeholder="дд.мм.гггг"
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors?.childs?.[index]?.iznos_start,
              className: 'disabled:opacity-100'
            })}
            triggerProps={{
              className: 'min-w-32'
            }}
            error={!!form.formState.errors?.childs?.[index]?.iznos_start}
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell>
        <div className="relative">
          <DatePicker
            tabIndex={tabIndex}
            value={row.data_pereotsenka}
            onChange={(date) => {
              handleChangeChildField(index, 'data_pereotsenka', date)
            }}
            placeholder="дд.мм.гггг"
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.data_pereotsenka
            })}
            error={!!form.formState.errors.childs?.[index]?.data_pereotsenka}
            triggerProps={{
              className: 'min-w-32'
            }}
          />
        </div>
      </EditableTableCell>

      <EditableTableCell className="whitespace-nowrap w-0">
        <Button
          tabIndex={tabIndex}
          type="button"
          variant="ghost"
          className="hover:bg-slate-50 hover:text-brand text-slate-400"
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
        >
          <CircleMinus className="btn-icon !mx-0" />
        </Button>
      </EditableTableCell>
    </EditableTableRow>
  )
}

type NaimenovanieCellsProps = {
  index: number
  tabIndex: number
  form: UseFormReturn<InternalTransferFormType>
  row: InternalTransferChildFormType
  kimdan_id: number
  doc_date: string
  updateFormField: (index: number, key: keyof InternalTransferChildFormType, value: unknown) => void
  errorMessage?: string
}
const NaimenovanieCells = ({
  index,
  tabIndex,
  form,
  row,
  kimdan_id,
  doc_date,
  updateFormField,
  errorMessage
}: NaimenovanieCellsProps) => {
  const from = useDefaultFilters((store) => store.from)

  const {
    naimenovanie_tovarov_jur7_name,
    group_jur7_number,
    edin,
    inventar_num,
    serial_num,
    spravochnik
  } = useOstatokProduct({
    naimenovanie_tovarov_jur7_id: row.naimenovanie_tovarov_jur7_id,
    kimdan_id,
    doc_date,
    from,
    disabledIds: form.getValues('childs').map((child) => child.naimenovanie_tovarov_jur7_id),
    onChange(product) {
      if (!product) {
        return
      }

      updateFormField(index, 'naimenovanie_tovarov_jur7_id', product.naimenovanie_tovarov_jur7_id)
      updateFormField(index, 'kol', product.to.kol)
      updateFormField(index, 'max_kol', product.to.kol)
      updateFormField(index, 'sena', product.to.sena)
      updateFormField(index, 'summa', calcSumma(product.to.kol, product.to.sena))
      updateFormField(index, 'debet_schet', product?.group?.schet ?? '')
      updateFormField(index, 'kredit_schet', product?.group?.schet ?? '')
      updateFormField(index, 'debet_sub_schet', product?.group?.provodka_subschet ?? '')
      updateFormField(index, 'kredit_sub_schet', product?.group?.provodka_subschet ?? '')
      updateFormField(index, 'data_pereotsenka', formatDate(product.prixod_data?.doc_date))
      updateFormField(index, 'iznos', product.iznos)
      updateFormField(index, 'eski_iznos_summa', product.eski_iznos_summa)
      updateFormField(index, 'iznos_schet', product.iznos_schet)
      updateFormField(index, 'iznos_sub_schet', product.iznos_sub_schet)
      updateFormField(index, 'iznos_start', product.iznos_start)
    }
  })

  return (
    <>
      <EditableTableCell>
        <div className="relative">
          <SpravochnikInput
            readOnly
            tabIndex={tabIndex}
            disabled={!kimdan_id}
            value={row.naimenovanie_tovarov_jur7_id || ''}
            className={inputVariants({
              editor: true,
              error: !!errorMessage
            })}
            error={!!errorMessage}
            getInputValue={(selected) => String(selected?.id) ?? ''}
            {...spravochnik}
          />
        </div>
      </EditableTableCell>
      {[naimenovanie_tovarov_jur7_name, group_jur7_number, edin, serial_num, inventar_num].map(
        (field, index) => (
          <EditableTableCell key={index}>
            <div className="relative">
              <Input
                readOnly
                tabIndex={-1}
                disabled={!kimdan_id}
                value={field}
                className={inputVariants({ editor: true, error: !!errorMessage })}
                error={!!errorMessage}
                onDoubleClick={spravochnik.open}
              />
            </div>
          </EditableTableCell>
        )
      )}
    </>
  )
}
