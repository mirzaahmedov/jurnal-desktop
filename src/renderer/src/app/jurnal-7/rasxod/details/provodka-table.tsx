import type { UseFormReturn } from 'react-hook-form'

import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import { useDefaultFilters } from '@renderer/common/features/app-defaults'
import { formatDate } from '@renderer/common/lib/date'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DatePicker, NumericInput } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { SpravochnikInput, inputVariants } from '@/common/features/spravochnik'
import { calcSena, calcSumma } from '@/common/lib/pricing'

import { useOstatokProduct } from '../../common/features/ostatok-product/use-ostatok-product'
import {
  RasxodChildFormSchema,
  type RasxodChildFormValues,
  type RasxodFormValues,
  defaultValues
} from '../config'

type ProvodkaTableProps = {
  form: UseFormReturn<RasxodFormValues>
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
      className="w-[2000px]"
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
                  tabIndex={tabIndex}
                  key={index}
                  index={index}
                  row={row}
                  form={form}
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
                tabIndex={tabIndex}
                onClick={() => {
                  const childs = form.getValues('childs')
                  if (
                    !Array.isArray(childs) ||
                    !childs.every((c) => RasxodChildFormSchema.safeParse(c).success)
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
                <CirclePlus className="btn-icon icon-start" /> {t('add')}
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
  row: RasxodChildFormValues
  form: UseFormReturn<RasxodFormValues>
  tabIndex: number
}
const Provodka = ({ index, row, form, tabIndex }: ProvodkaProps) => {
  const handleChangeChildField = (
    index: number,
    key: keyof RasxodChildFormValues,
    value: unknown
  ) => {
    form.setValue(`childs.${index}.${key}`, value as string | number)
    form.trigger(`childs.${index}.${key}`)
  }

  return (
    <EditableTableRow key={index}>
      <NaimenovanieCells
        index={index}
        row={row}
        form={form}
        kimdan_id={form.watch('kimdan_id')}
        doc_date={form.watch('doc_date')}
        tabIndex={tabIndex}
        errorMessage={form.formState.errors.childs?.[index]?.naimenovanie_tovarov_jur7_id?.message}
        updateFormField={handleChangeChildField}
      />
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
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
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
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
            tabIndex={tabIndex}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
            allowNegative={false}
            value={row.summa || ''}
            onValueChange={(values, src) => {
              const sena = calcSena(values.floatValue ?? 0, row.kol)
              if (src.source === 'event' && (values.floatValue ?? 0) !== 0 && row.sena !== sena) {
                handleChangeChildField(index, 'sena', sena)
              }
              handleChangeChildField(index, 'summa', values.floatValue)
            }}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.summa
            })}
            error={!!form.formState.errors.childs?.[index]?.summa}
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
              error: !!form.formState.errors.childs?.[index]?.debet_schet
            })}
            error={!!form.formState.errors.childs?.[index]?.debet_schet}
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
              error: !!form.formState.errors.childs?.[index]?.debet_sub_schet
            })}
            error={!!form.formState.errors.childs?.[index]?.debet_sub_schet}
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
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors.childs?.[index]?.kredit_schet
            })}
            error={!!form.formState.errors.childs?.[index]?.kredit_schet}
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
              error: !!form.formState.errors.childs?.[index]?.kredit_sub_schet
            })}
            error={!!form.formState.errors.childs?.[index]?.kredit_sub_schet}
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
              error: !!form.formState.errors.childs?.[index]?.data_pereotsenka
            })}
            error={!!form.formState.errors.childs?.[index]?.data_pereotsenka}
            triggerProps={{
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
          tabIndex={tabIndex}
        >
          <CircleMinus className="btn-icon !mx-0" />
        </Button>
      </EditableTableCell>
    </EditableTableRow>
  )
}

type NaimenovanieCellsProps = {
  index: number
  row: RasxodChildFormValues
  form: UseFormReturn<RasxodFormValues>
  kimdan_id: number
  doc_date: string
  tabIndex: number
  updateFormField: (index: number, key: keyof RasxodChildFormValues, value: unknown) => void
  errorMessage?: string
}
const NaimenovanieCells = ({
  index,
  row,
  form,
  kimdan_id,
  doc_date,
  tabIndex,
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
    from,
    doc_date,
    disabledIds: form.getValues('childs').map((child) => child.naimenovanie_tovarov_jur7_id),
    onChange(product) {
      if (!product) {
        return
      }

      updateFormField(index, 'naimenovanie_tovarov_jur7_id', product.id)
      updateFormField(index, 'kol', product.to.kol)
      updateFormField(index, 'max_kol', product.to.kol)
      updateFormField(index, 'sena', product.to.sena)
      updateFormField(index, 'summa', calcSumma(product.to.kol, product.to.sena))
      updateFormField(index, 'debet_schet', product?.group?.provodka_debet ?? '')
      updateFormField(index, 'kredit_schet', product?.group?.schet ?? '')
      updateFormField(index, 'debet_sub_schet', product?.group?.provodka_subschet ?? '')
      updateFormField(index, 'kredit_sub_schet', product?.group?.provodka_subschet ?? '')
      updateFormField(index, 'data_pereotsenka', formatDate(product.prixod_data?.doc_date))
    }
  })

  return (
    <>
      <EditableTableCell>
        <div className="relative">
          <SpravochnikInput
            readOnly
            disabled={!kimdan_id}
            tabIndex={tabIndex}
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
                value={field}
                error={!!errorMessage}
                tabIndex={-1}
                className={inputVariants({ editor: true, error: !!errorMessage })}
                disabled={!kimdan_id}
                onDoubleClick={spravochnik.open}
              />
            </div>
          </EditableTableCell>
        )
      )}
    </>
  )
}
