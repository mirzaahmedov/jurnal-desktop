import { CircleMinus, CirclePlus } from 'lucide-react'
import { DatePicker, EdinSelect, NumericInput, inputVariants } from '@/common/components'
import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@renderer/common/components/editable-table'
import type { FieldError, FieldErrorsImpl, Merge, UseFormReturn } from 'react-hook-form'
import {
  PrixodChildFormSchema,
  PrixodChildFormType,
  PrixodFormType,
  defaultValues
} from '../config'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { calcSena, calcSumma } from '@/common/lib/pricing'
import { useEffect, useRef } from 'react'

import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import { Input } from '@/common/components/ui/input'
import { cn } from '@/common/lib/utils'
import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { toast } from 'react-toastify'
import { useEventCallback } from '@renderer/common/hooks'
import { useRequisitesStore } from '@renderer/common/features/requisites'

type ProvodkaTableProps = {
  isCreate: boolean
  form: UseFormReturn<PrixodFormType>
}
export const ProvodkaTable = ({ isCreate, form }: ProvodkaTableProps) => {
  const handleChangeChildField = useEventCallback(
    (index: number, key: keyof PrixodChildFormType, value: unknown) => {
      form.setValue(`childs.${index}.${key}`, value as string | number)
      form.trigger(`childs.${index}.${key}`)
    }
  )!

  console.log({ errors: form.formState.errors })

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
      className="w-[2500px]"
    >
      <Table className="border border-slate-200 table-xs">
        <TableHeader>
          <EditableTableRow>
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
            <EditableTableHead
              rowSpan={2}
              className="min-w-28"
            >
              Серийный номер
            </EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="min-w-28"
            >
              Инвентарный номер
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
              rowSpan={2}
              className="text-right"
            >
              НДС(%)
            </EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="text-right"
            >
              НДС
            </EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              className="text-right"
            >
              Сумма с НДС
            </EditableTableHead>
            <EditableTableHead
              rowSpan={2}
              colSpan={isCreate ? 2 : 1}
              className="text-center"
            >
              Износь / Старый износ
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
              const errors = form.formState.errors.childs?.[index] || {}
              return (
                <EditableTableRow key={index}>
                  <NaimenovanieCells
                    index={index}
                    row={row}
                    errors={errors}
                    onChangeField={handleChangeChildField}
                  />
                  <EditableTableCell>
                    <div className="relative">
                      <NumericInput
                        adjustWidth
                        value={row.kol || ''}
                        onValueChange={(values) => {
                          const summa = calcSumma(values.floatValue ?? 0, row.sena)
                          if (summa !== row.summa) {
                            handleChangeChildField(index, 'summa', summa)
                          }
                          handleChangeChildField(index, 'kol', values.floatValue)
                        }}
                        className={inputVariants({
                          editor: true,
                          error: !!errors?.kol
                        })}
                      />
                    </div>
                  </EditableTableCell>
                  <EditableTableCell>
                    <div className="relative">
                      <NumericInput
                        adjustWidth
                        value={row.sena || ''}
                        onValueChange={(values) => {
                          const summa = calcSumma(row.kol, values.floatValue ?? 0)
                          if (summa !== row.summa) {
                            handleChangeChildField(index, 'summa', summa)
                          }
                          handleChangeChildField(index, 'sena', values.floatValue)
                        }}
                        className={inputVariants({
                          editor: true,
                          error: !!errors?.sena
                        })}
                      />
                    </div>
                  </EditableTableCell>
                  <EditableTableCell>
                    <div className="relative">
                      <NumericInput
                        adjustWidth
                        value={row.summa || ''}
                        onValueChange={(values) => {
                          const sena = calcSena(values.floatValue ?? 0, row.kol)
                          if (sena !== row.sena && (values.floatValue ?? 0) !== 0) {
                            handleChangeChildField(index, 'sena', sena)
                          }
                          handleChangeChildField(index, 'summa', values.floatValue)
                        }}
                        className={inputVariants({
                          editor: true,
                          error: !!errors?.summa
                        })}
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
                      />
                    </div>
                  </EditableTableCell>

                  <EditableTableCell>
                    <div className="relative">
                      <NumericInput
                        readOnly
                        adjustWidth
                        value={((row.kol || 0) * (row.sena || 0) * (row.nds_foiz || 0)) / 100 || ''}
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
                  {isCreate ? (
                    <EditableTableCell>
                      <div className="relative flex items-center justify-center px-4">
                        <Checkbox
                          checked={row.iznos}
                          onCheckedChange={(checked) => {
                            handleChangeChildField(index, 'iznos', Boolean(checked))
                          }}
                        />
                      </div>
                    </EditableTableCell>
                  ) : null}
                  <EditableTableCell>
                    <div className="relative flex items-center justify-center">
                      <NumericInput
                        adjustWidth
                        value={row.eski_iznos_summa || ''}
                        onValueChange={(values) => {
                          handleChangeChildField(index, 'eski_iznos_summa', values.floatValue)
                        }}
                        className={inputVariants({
                          editor: true,
                          error: !!errors?.eski_iznos_summa
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
                          error: !!errors?.debet_schet
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
                          error: !!errors?.debet_sub_schet
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
                          error: !!errors?.kredit_schet
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
                          error: !!errors?.kredit_sub_schet
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
                          error: !!errors?.data_pereotsenka
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
                    !childs.every((c) => PrixodChildFormSchema.safeParse(c).success)
                  ) {
                    form.trigger('childs')
                    toast.error('Неверные данные')
                    return
                  }

                  form.setValue('childs', [
                    ...form.getValues('childs'),
                    {
                      ...defaultValues.childs[0],
                      kredit_schet: form.getValues('j_o_num'),
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

type NaimenovanieCellsProps = {
  index: number
  row: PrixodChildFormType
  errors: Merge<FieldError, FieldErrorsImpl<PrixodChildFormType>>
  onChangeField: (index: number, key: keyof PrixodChildFormType, value: unknown) => void
}
const NaimenovanieCells = ({ index, row, errors, onChangeField }: NaimenovanieCellsProps) => {
  const isMounted = useRef(false)

  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const groupSpravochnik = useSpravochnik(
    createGroupSpravochnik({
      value: row.group_jur7_id,
      onChange: (groupId) => {
        if (!budjet_id) {
          return
        }
        onChangeField(index, 'group_jur7_id', groupId)
      }
    })
  )

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    onChangeField(index, 'debet_schet', groupSpravochnik.selected?.schet ?? '')
    onChangeField(index, 'debet_sub_schet', groupSpravochnik.selected?.provodka_subschet ?? '')
    onChangeField(index, 'kredit_sub_schet', groupSpravochnik.selected?.provodka_subschet ?? '')
  }, [index, onChangeField, groupSpravochnik.selected])

  return (
    <>
      <EditableTableCell>
        <div className="relative">
          <SpravochnikInput
            readOnly
            value={groupSpravochnik.selected?.name || ''}
            className={cn(
              inputVariants({ editor: true, error: !!errors.group_jur7_id }),
              'disabled:opacity-100'
            )}
            getInputValue={(selected) => selected?.name ?? ''}
            {...groupSpravochnik}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <Input
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
