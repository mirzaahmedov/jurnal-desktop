import { CircleMinus, CirclePlus } from 'lucide-react'
import { DatePicker, NumericInput, inputVariants } from '@/common/components'
import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import {
  RasxodChildFormSchema,
  RasxodChildFormType,
  RasxodFormType,
  defaultValues
} from '../config'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { calcSena, calcSumma } from '@/common/lib/pricing'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { SpravochnikInput } from '@/common/features/spravochnik'
import { UseFormReturn } from 'react-hook-form'
import { useEventCallback } from '@/common/hooks/use-event-callback'
import { useOstatokProduct } from '../../common/features/ostatok-product/use-ostatok-product'

type ProvodkaTableProps = {
  form: UseFormReturn<RasxodFormType>
}
export const ProvodkaTable = ({ form }: ProvodkaTableProps) => {
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
            <EditableTableHead rowSpan={2}>Код</EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="w-48"
            >
              Группа
            </EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="min-w-72"
            >
              Наименования
            </EditableTableHead>
            <EditableTableHead rowSpan={2}>Е.И</EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="text-right"
            >
              Количество
            </EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="text-right"
            >
              Цена
            </EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="text-right"
            >
              Сумма
            </EditableTableHead>
            <EditableTableHead
              colSpan={2}
              className="text-center"
            >
              Дебет
            </EditableTableHead>
            <EditableTableHead
              colSpan={2}
              className="text-center"
            >
              Кредит
            </EditableTableHead>
            <EditableTableHead rowSpan={2}>Дата прихода</EditableTableHead>
            <EditableTableHead rowSpan={2}></EditableTableHead>
          </EditableTableRow>
          <EditableTableRow>
            <EditableTableHead>Счет</EditableTableHead>
            <EditableTableHead>Субсчет</EditableTableHead>
            <EditableTableHead>Счет</EditableTableHead>
            <EditableTableHead className="last:border-solid">Субсчет</EditableTableHead>
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
                    !childs.every((c) => RasxodChildFormSchema.safeParse(c).success)
                  ) {
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
  row: RasxodChildFormType
  form: UseFormReturn<RasxodFormType>
}
const Provodka = ({ index, row, form }: ProvodkaProps) => {
  const [maxKol, setMaxKol] = useState<number>(Infinity)

  const handleChangeChildField = (
    index: number,
    key: keyof RasxodChildFormType,
    value: unknown
  ) => {
    form.setValue(`childs.${index}.${key}`, value as string | number)
    form.trigger(`childs.${index}.${key}`)
  }

  return (
    <EditableTableRow key={index}>
      <NaimenovanieCells
        index={index}
        kimdan_id={form.watch('kimdan_id')}
        doc_date={form.watch('doc_date')}
        setMaxKol={setMaxKol}
        errorMessage={form.formState.errors.childs?.[index]?.naimenovanie_tovarov_jur7_id?.message}
        value={row.naimenovanie_tovarov_jur7_id}
        onChange={(id) => {
          handleChangeChildField(index, 'naimenovanie_tovarov_jur7_id', Number(id))
        }}
        onChangeChildField={handleChangeChildField}
      />
      <EditableTableCell>
        <div className="relative">
          <NumericInput
            adjustWidth
            allowNegative={false}
            isAllowed={(values) => (values.floatValue ?? 0) <= maxKol}
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
            triggerProps={{
              className: 'min-w-32'
            }}
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
        >
          <CircleMinus className="btn-icon !mx-0" />
        </Button>
      </EditableTableCell>
    </EditableTableRow>
  )
}

type NaimenovanieCellsProps = {
  index: number
  value: number
  kimdan_id: number
  doc_date: string
  setMaxKol: (value: number) => void
  onChange: (value: number) => void
  onChangeChildField: (index: number, key: keyof RasxodChildFormType, value: unknown) => void
  errorMessage?: string
}
const NaimenovanieCells = ({
  index,
  setMaxKol,
  value,
  kimdan_id,
  doc_date,
  onChange,
  onChangeChildField,
  errorMessage
}: NaimenovanieCellsProps) => {
  const isMounted = useRef(false)

  const onChangeChildFieldEvent = useEventCallback(onChangeChildField)!

  const { values, groupSpravochnik, productOstatokSpravochnik } = useOstatokProduct({
    index,
    setMaxKol,
    value,
    kimdan_id,
    doc_date,
    onChange,
    onChangeChildFieldEvent
  })

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    onChangeChildFieldEvent(index, 'debet_schet', groupSpravochnik.selected?.provodka_debet ?? '')
    onChangeChildFieldEvent(index, 'kredit_schet', groupSpravochnik.selected?.schet ?? '')
    onChangeChildFieldEvent(
      index,
      'debet_sub_schet',
      groupSpravochnik.selected?.provodka_subschet ?? ''
    )
    onChangeChildFieldEvent(
      index,
      'kredit_sub_schet',
      groupSpravochnik.selected?.provodka_subschet ?? ''
    )
  }, [index, onChangeChildFieldEvent, groupSpravochnik.selected])

  return (
    <>
      <EditableTableCell>
        <div className="relative">
          <SpravochnikInput
            readOnly
            disabled={!kimdan_id}
            value={value || ''}
            className={inputVariants({
              editor: true,
              error: !!errorMessage
            })}
            getInputValue={(selected) => String(selected?.id) ?? ''}
            {...productOstatokSpravochnik}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <SpravochnikInput
            readOnly
            disabled={!kimdan_id}
            value={groupSpravochnik.selected?.name || ''}
            className={inputVariants({ editor: true, error: !!errorMessage })}
            getInputValue={(selected) => selected?.name ?? ''}
            {...groupSpravochnik}
            open={productOstatokSpravochnik.open}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Input
            readOnly
            disabled={!kimdan_id}
            value={values.name}
            className={inputVariants({ editor: true, error: !!errorMessage })}
            onDoubleClick={productOstatokSpravochnik.open}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Input
            readOnly
            disabled={!kimdan_id}
            value={values.edin}
            className={inputVariants({ editor: true, error: !!errorMessage })}
            onDoubleClick={productOstatokSpravochnik.open}
          />
        </div>
      </EditableTableCell>
    </>
  )
}
