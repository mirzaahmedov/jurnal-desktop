import type { EditorComponent } from './interfaces'
import type { Operatsii, TypeSchetOperatsii } from '@/common/models'

import { type FC, useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleX, Plus } from 'lucide-react'
import { type DialogTriggerProps, useFilter } from 'react-aria-components'
import { type ArrayPath, type UseFormReturn, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  type OperatsiiFormValues,
  OperatsiiService,
  createOperatsiiSpravochnik,
  operatsiiQueryKeys
} from '@/app/super-admin/operatsii'
import { SmetaQueryKeys, smetaService } from '@/app/super-admin/smeta'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useDebounceValue, useEventCallback } from '@/common/hooks'
import { capitalize } from '@/common/lib/string'

export const createOperatsiiEditor = <T extends object, F extends ArrayPath<T>>({
  field,
  type_schet
}: {
  field: keyof T[F][number] & string
  type_schet?: TypeSchetOperatsii
}): EditorComponent<T, F> => {
  return ({ tabIndex, id, value, errors, onChange, form }) => {
    const error = (errors as any)?.[field]

    const typedForm = form as unknown as UseFormReturn<{
      childs: Array<{
        schet?: string
        schet_6?: string
        sub_schet?: string
      }>
    }>
    const schet = typedForm.watch(`childs.${id}.schet`)
    const schet6 = typedForm.watch(`childs.${id}.schet_6`)
    const sub_schet = typedForm.watch(`childs.${id}.sub_schet`)

    const [subschetInputValue, setSubschetInputValue] = useState<string>('')
    const [debouncedSchetInputValue, setDebouncedSchetInputValue] = useDebounceValue(schet)

    const handleChangeField = (field: 'schet' | 'schet_6' | 'sub_schet', value: string) => {
      typedForm.setValue(`childs.${id}.${field}`, value)
    }

    const onChangeEvent = useEventCallback(onChange)
    const operatsiiSpravochnik = useSpravochnik(
      createOperatsiiSpravochnik({
        value: value as number | undefined,
        onChange: (value) => {
          onChange?.(value)
        },
        params: {
          type_schet
        }
      })
    )

    const { t } = useTranslation()
    const { startsWith } = useFilter({
      sensitivity: 'base'
    })

    const { data: schetOptions, isLoading: isLoadingSchetOptions } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getSchetOptions,
        {
          type_schet
        }
      ],
      queryFn: OperatsiiService.getSchetOptions
    })

    const { data: operatsiiOptions, isLoading } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getAll,
        {
          type_schet,
          schet: debouncedSchetInputValue
            ? decodeSchetOption(debouncedSchetInputValue).schet || undefined
            : undefined,
          schet6: debouncedSchetInputValue
            ? decodeSchetOption(debouncedSchetInputValue).schet6 || null
            : null
        }
      ],
      queryFn: OperatsiiService.getAll,
      enabled: !!debouncedSchetInputValue
    })

    const filteredOperatsiiOptions = useMemo(
      () =>
        operatsiiOptions?.data?.filter((option) =>
          startsWith(option.sub_schet ?? '', subschetInputValue ?? '')
        ) ?? [],
      [operatsiiOptions, subschetInputValue]
    )

    useEffect(() => {
      if (!operatsiiSpravochnik.selected) {
        return
      }
      const { schet, schet6, sub_schet } = operatsiiSpravochnik.selected

      setSubschetInputValue(sub_schet ?? '')
      setDebouncedSchetInputValue(schet ? encodeSchetOption(schet, schet6) : '')
      handleChangeField('schet', schet ? encodeSchetOption(schet, schet6) : '')
      handleChangeField('schet_6', schet6 ?? '')
      handleChangeField('sub_schet', sub_schet ?? '')
    }, [operatsiiSpravochnik.selected?.id])

    useEffect(() => {
      if (filteredOperatsiiOptions.length === 1) {
        const operatsii = filteredOperatsiiOptions[0]
        onChangeEvent?.(operatsii?.id ?? 0)
      }
    }, [filteredOperatsiiOptions, onChangeEvent])

    useEffect(() => {
      setDebouncedSchetInputValue(schet ?? '')
    }, [schet])
    useEffect(() => {
      setSubschetInputValue(sub_schet ?? '')
    }, [sub_schet])

    return (
      <div className="flex items-center gap-px p-px">
        <div>
          <div
            className="w-full flex divide-x"
            onDoubleClick={operatsiiSpravochnik.open}
          >
            <JollyComboBox
              editor
              error={!!error}
              tabIndex={tabIndex}
              isDisabled={isLoadingSchetOptions}
              menuTrigger="focus"
              selectedKey={schet || ''}
              onSelectionChange={(value) => {
                if (
                  operatsiiSpravochnik.selected &&
                  encodeSchetOption(
                    operatsiiSpravochnik.selected.schet,
                    operatsiiSpravochnik.selected.schet6
                  ) !== value
                ) {
                  onChange?.(0)
                  handleChangeField('sub_schet', '')
                  setSubschetInputValue('')
                }
                handleChangeField('schet', (value as string) || '')
                setDebouncedSchetInputValue((value as string) || '')
              }}
              className="border-none flex-1"
              placeholder={t('schet')}
              defaultItems={schetOptions?.data ?? []}
            >
              {(item) => (
                <ComboboxItem id={encodeSchetOption(item.schet, item.schet6)}>
                  {encodeSchetOption(item.schet, item.schet6)}
                </ComboboxItem>
              )}
            </JollyComboBox>
            <JollyComboBox
              editor
              error={!!error}
              tabIndex={tabIndex}
              allowsEmptyCollection
              isDisabled={isLoading}
              inputValue={subschetInputValue}
              onInputChange={setSubschetInputValue}
              menuTrigger="focus"
              formValue="text"
              selectedKey={(value as string) ?? ''}
              onSelectionChange={(value) => {
                onChange?.(value)
                const selectedOperatsii = operatsiiOptions?.data?.find(
                  (option) => option.id === value
                )
                if (selectedOperatsii) {
                  setSubschetInputValue(selectedOperatsii.sub_schet)
                  handleChangeField('sub_schet', selectedOperatsii.sub_schet)
                }
              }}
              className="flex-1"
              placeholder={t('subschet')}
              items={filteredOperatsiiOptions}
              popoverProps={{
                className: 'w-[300px]'
              }}
              renderEmptyState={() => (
                <div className="py-5 flex flex-col items-center">
                  {t('operatsii_not_found_want_to_create')}
                  <OperatsiiQuickAdd
                    type_schet={type_schet!}
                    schet={schet || ''}
                    schet6={schet6 || ''}
                  />
                </div>
              )}
            >
              {(item) => (
                <ComboboxItem id={item.id}>
                  {item.sub_schet} - {item.name}
                </ComboboxItem>
              )}
            </JollyComboBox>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-slate-400 hover:text-red-500 rounded-none"
              onPress={() => {
                operatsiiSpravochnik.clear()
                setSubschetInputValue('')
                setDebouncedSchetInputValue('')
                handleChangeField('schet', '')
                handleChangeField('schet_6', '')
                handleChangeField('sub_schet', '')
              }}
            >
              <CircleX />
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export interface OperatsiiQuickAddProps extends Omit<DialogTriggerProps, 'children'> {
  type_schet: TypeSchetOperatsii
  schet: string
  schet6: string
  onCreateSuccess?: (operatsii: Operatsii) => void
}
export const OperatsiiQuickAdd: FC<OperatsiiQuickAddProps> = ({
  type_schet,
  schet,
  schet6,
  ...props
}) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      name: '',
      schet: '',
      schet6: '',
      sub_schet: '',
      type_schet
    } as OperatsiiFormValues
  })
  const smetaNumbersQuery = useQuery({
    queryKey: [SmetaQueryKeys.getSmetaNumbers],
    queryFn: smetaService.getSmetaNumbers
  })

  const createOperatsiiMutation = useMutation({
    mutationFn: OperatsiiService.create,
    onSuccess: () => {
      toast.success(t('create_success'))
      queryClient.invalidateQueries({
        queryKey: [operatsiiQueryKeys.getAll]
      })
      props.onOpenChange?.(false)
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    createOperatsiiMutation.mutate(values)
  })

  useEffect(() => {
    form.setValue('schet', schet)
  }, [form, schet])
  useEffect(() => {
    form.setValue('schet6', schet6)
  }, [form, schet6])

  const smetaNumberOptions = smetaNumbersQuery.data?.data ?? []

  return (
    <DialogTrigger {...props}>
      <Button
        size="icon"
        className="flex-shrink-0"
      >
        <Plus />
      </Button>
      <DialogOverlay>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {capitalize(t('create-something', { something: t('operatsii') }))}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      label={t('name')}
                      grid="2:4"
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />
                <FormElement
                  label={t('schet')}
                  grid="2:4"
                >
                  <Input
                    readOnly
                    value={schet}
                  />
                </FormElement>

                <FormField
                  control={form.control}
                  name="schet6"
                  render={({ field }) => (
                    <FormElement
                      label={t('schet_6_digit')}
                      grid="2:4"
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />

                <FormField
                  name="sub_schet"
                  control={form.control}
                  render={({ field }) => (
                    <FormElement
                      label={t('subschet')}
                      grid="2:4"
                    >
                      <JollyComboBox
                        onBlur={field.onBlur}
                        selectedKey={field.value}
                        onSelectionChange={(value) => field.onChange(value as any)}
                        defaultItems={smetaNumberOptions.map((value) => ({
                          value
                        }))}
                        menuTrigger="focus"
                      >
                        {(item) => <ComboboxItem id={item.value}>{item.value}</ComboboxItem>}
                      </JollyComboBox>
                    </FormElement>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  isDisabled={createOperatsiiMutation.isPending}
                >
                  {t('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const encodeSchetOption = (schet: string, schet6: string | null) => {
  return `${schet ?? ''}(${schet6 ?? ''})`
}
const decodeSchetOption = (
  value: string
): {
  schet: string
  schet6: string
} => {
  const parts = value?.split?.('(') ?? []
  return {
    schet: parts[0] ?? '',
    schet6: parts[1]?.replace(')', '') ?? ''
  }
}
