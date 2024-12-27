import { CircleMinus, CirclePlus } from 'lucide-react'
import {
  DatePicker,
  EdinSelect,
  LoadingSpinner,
  NumericInput,
  inputVariants
} from '@/common/components'
import {
  EditableTableCell,
  EditableTableHead,
  EditableTableRow
} from '@/common/features/editable-table'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import {
  PrixodChildFormSchema,
  PrixodChildFormType,
  PrixodFormType,
  defaultValues
} from '../config'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { Table, TableBody, TableFooter, TableHeader } from '@/common/components/ui/table'
import { calcSena, calcSumma } from '@/common/lib/pricing'
import {
  createNaimenovanieSpravochnik,
  naimenovanieService
} from '@/app/jur7/naimenovaniya/service'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@renderer/common/components/ui/checkbox'
import { Input } from '@/common/components/ui/input'
import { Naimenovanie } from '@/common/models'
import { UseFormReturn } from 'react-hook-form'
import { cn } from '@/common/lib/utils'
import { createGroupSpravochnik } from '@/app/super-admin/group/service'
import { denominationQueryKeys } from '@/app/jur7/naimenovaniya/constants'
import { useEventCallback } from '@/common/hooks/use-event-callback'
import { useMutation } from '@tanstack/react-query'
import { useRequisitesStore } from '@/common/features/main-schet'

type ProvodkaTableProps = {
  form: UseFormReturn<PrixodFormType>
}
export const ProvodkaTable = ({ form }: ProvodkaTableProps) => {
  const handleChangeChildField = (
    index: number,
    key: keyof PrixodChildFormType,
    value: unknown
  ) => {
    form.setValue(`childs.${index}.${key}`, value as string | number)
    form.trigger(`childs.${index}.${key}`)
  }

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
            <EditableTableHead rowSpan={2}>Износь</EditableTableHead>
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
                <EditableTableRow key={index}>
                  <NaimenovanieCells
                    index={index}
                    errorMessage={
                      form.formState.errors.childs?.[index]?.naimenovanie_tovarov_jur7_id?.message
                    }
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
                          error: !!form.formState.errors.childs?.[index]?.kol
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
                          error: !!form.formState.errors.childs?.[index]?.sena
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
                          error: !!form.formState.errors.childs?.[index]?.summa
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
                          error: !!form.formState.errors.childs?.[index]?.nds_foiz
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
                  <EditableTableCell>
                    <div className="relative flex items-center justify-center">
                      <Checkbox
                        checked={row.iznos}
                        onCheckedChange={(checked) => {
                          handleChangeChildField(index, 'iznos', Boolean(checked))
                        }}
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

type NaimenovanieCellsProps = {
  index: number
  value: number
  onChange: (value: number) => void
  onChangeChildField: (index: number, key: keyof PrixodChildFormType, value: unknown) => void
  errorMessage?: string
}
const NaimenovanieCells = ({
  index,
  value,
  onChange,
  onChangeChildField,
  errorMessage
}: NaimenovanieCellsProps) => {
  const isMounted = useRef(false)

  const budjet_id = useRequisitesStore((store) => store.budjet_id)

  const onChangeChildFieldEvent = useEventCallback(onChangeChildField)!

  const [values, setValues] = useState<Pick<Naimenovanie, 'group_jur7_id' | 'name' | 'edin'>>({
    group_jur7_id: 0,
    name: '',
    edin: ''
  })

  const naimenovanieSpravochnik = useSpravochnik(
    createNaimenovanieSpravochnik({
      value,
      onChange
    })
  )
  const groupSpravochnik = useSpravochnik(
    createGroupSpravochnik({
      value: values.group_jur7_id,
      onChange: (id) => {
        setValues((prev) => ({ ...prev, group_jur7_id: id }))
        if (!budjet_id) {
          return
        }
        applyChanges({
          id: value,
          name: values.name,
          group_jur7_id: id,
          edin: values.edin,
          spravochnik_budjet_name_id: budjet_id
        })
      }
    })
  )

  const { mutate: createNaimenovanie, isPending: isCreating } = useMutation({
    mutationKey: [denominationQueryKeys.create],
    mutationFn: naimenovanieService.create,
    onSuccess(result: unknown) {
      const id = (result as { data: [Naimenovanie] }).data[0].id
      setValues((prev) => ({
        ...prev,
        group_jur7_id: id
      }))
      onChange(id)
    }
  })
  const { mutate: updateNaimenovanie, isPending: isUpdating } = useMutation({
    mutationKey: [denominationQueryKeys.update],
    mutationFn: naimenovanieService.update
  })

  useEffect(() => {
    if (!naimenovanieSpravochnik.selected) {
      setValues({
        group_jur7_id: 0,
        name: '',
        edin: ''
      })
      return
    }
    setValues({
      group_jur7_id: naimenovanieSpravochnik.selected?.group_jur7_id ?? 0,
      name: naimenovanieSpravochnik.selected?.name ?? '',
      edin: naimenovanieSpravochnik.selected?.edin ?? ''
    })
  }, [naimenovanieSpravochnik.selected])
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    onChangeChildFieldEvent(index, 'debet_schet', groupSpravochnik.selected?.schet ?? '')
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

  const applyChanges = (changes: Parameters<typeof updateNaimenovanie>[0]) => {
    const selected = naimenovanieSpravochnik.selected
    if (
      !selected ||
      (selected.group_jur7_id === changes.group_jur7_id &&
        selected.edin === changes.edin &&
        selected.name === changes.name) ||
      !budjet_id
    ) {
      return
    }

    updateNaimenovanie(changes)
  }

  return (
    <>
      <EditableTableCell>
        <div className="relative">
          <Popover open={!value && !!values.name && !!values.edin && !!values.group_jur7_id}>
            <PopoverTrigger>
              <SpravochnikInput
                readOnly
                value={value || ''}
                className={inputVariants({
                  editor: true,
                  error: !!errorMessage
                })}
                {...naimenovanieSpravochnik}
                getInputValue={(selected) => String(selected?.id) ?? ''}
                open={undefined}
                clear={undefined}
              />
            </PopoverTrigger>
            <PopoverContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <Button
                disabled={isCreating || isUpdating}
                onClick={() => {
                  if (!budjet_id) {
                    return
                  }
                  createNaimenovanie({
                    group_jur7_id: values.group_jur7_id,
                    name: values.name,
                    edin: values.edin,
                    spravochnik_budjet_name_id: budjet_id
                  })
                }}
              >
                {isCreating || isUpdating ? (
                  <>
                    <LoadingSpinner /> {}
                  </>
                ) : null}
                Добавить новое наименование
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <SpravochnikInput
            readOnly
            value={groupSpravochnik.selected?.name || ''}
            className={cn(
              inputVariants({ editor: true, error: !!errorMessage }),
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
            value={values.name}
            onChange={(e) => {
              setValues({ ...values, name: e.target.value })
            }}
            onBlur={(e) => {
              if (!budjet_id) {
                return
              }
              const name = e.target.value
              applyChanges({
                id: value,
                name,
                group_jur7_id: values.group_jur7_id,
                edin: values.edin,
                spravochnik_budjet_name_id: budjet_id
              })
            }}
            className={inputVariants({ editor: true, error: !!errorMessage })}
          />
        </div>
      </EditableTableCell>
      <EditableTableCell>
        <div className="relative">
          <EdinSelect
            value={values.edin}
            onValueChange={(edin) => {
              setValues({ ...values, edin })
              if (!budjet_id) {
                return
              }
              applyChanges({
                id: value,
                name: values.name,
                group_jur7_id: values.group_jur7_id,
                edin,
                spravochnik_budjet_name_id: budjet_id
              })
            }}
            triggerClassName={inputVariants({ editor: true, error: !!errorMessage })}
          />
        </div>
      </EditableTableCell>
    </>
  )
}
