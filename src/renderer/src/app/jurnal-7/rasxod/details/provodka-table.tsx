import { useState } from 'react'

import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import { EmptyList } from '@renderer/common/components/empty-states'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import { useToggle } from '@renderer/common/hooks'
import { formatDate } from '@renderer/common/lib/date'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { DatePicker, NumericInput } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { inputVariants } from '@/common/features/spravochnik'
import { calcSena, calcSumma } from '@/common/lib/pricing'

import { OstatokSpravochnikDialog } from '../../ostatok/spravochnik/dialog'
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
  const spravochnikToggle = useToggle()

  const [rowIndex, setRowIndex] = useState(0)

  const { t } = useTranslation()

  const { remove, insert } = useFieldArray({
    control: form.control,
    name: 'childs'
  })

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
      <OstatokSpravochnikDialog
        kimning_buynida={form.watch('kimdan_id')}
        to={form.watch('doc_date')}
        open={spravochnikToggle.isOpen}
        disabledIds={form
          .watch('childs')
          .map((child) => child.naimenovanie_tovarov_jur7_id)
          .filter(Boolean)}
        onOpenChange={(open) => {
          if (!open) {
            setRowIndex(0)
          }
          spravochnikToggle.setOpen(open)
        }}
        onSelect={(products) => {
          remove(rowIndex)
          insert(
            rowIndex,
            products.map((p) => ({
              naimenovanie_tovarov_jur7_id: p.naimenovanie_tovarov_jur7_id,
              name: p.product.name,
              group_number: p.group.group_number,
              edin: p.product.edin,
              inventar_num: p.product.inventar_num,
              serial_num: p.product.serial_num,
              kol: p.to.kol,
              max_kol: p.to.kol,
              sena: p.to.sena,
              summa: calcSumma(p.to.kol, p.to.sena),
              debet_schet: p?.group?.provodka_debet ?? '',
              kredit_schet: p?.group?.schet ?? '',
              debet_sub_schet: p?.group?.provodka_subschet ?? '',
              kredit_sub_schet: p?.group?.provodka_subschet ?? '',
              data_pereotsenka: formatDate(p.prixod_data?.doc_date),
              iznos: p.iznos,
              iznos_summa: p.to.iznos_summa,
              iznos_schet: p.iznos_schet,
              iznos_sub_schet: p.iznos_sub_schet,
              iznos_start: p.iznos_start ?? undefined,
              group_jur7_id: p.product.group_jur7_id
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
              rowSpan={2}
              colSpan={2}
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
          {Array.isArray(form.watch('childs')) && form.watch('childs').length ? (
            form.watch('childs').map((row, index) => {
              return (
                <Provodka
                  tabIndex={tabIndex}
                  openDialog={(index) => {
                    spravochnikToggle.open()
                    setRowIndex(index)
                  }}
                  key={index}
                  index={index}
                  row={row}
                  form={form}
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
  openDialog: (rowIndex: number) => void
}
const Provodka = ({ index, openDialog, row, form, tabIndex }: ProvodkaProps) => {
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
        row={row}
        kimdan_id={form.watch('kimdan_id')}
        tabIndex={tabIndex}
        errorMessage={form.formState.errors.childs?.[index]?.naimenovanie_tovarov_jur7_id?.message}
        openDialog={() => {
          openDialog(index)
        }}
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
              handleChangeChildField(index, 'iznos_summa', values.floatValue)
            }}
            className={inputVariants({
              editor: true,
              error: !!form.formState.errors?.childs?.[index]?.iznos_summa
            })}
            error={!!form.formState.errors?.childs?.[index]?.iznos_summa}
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
  row: RasxodChildFormValues
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
