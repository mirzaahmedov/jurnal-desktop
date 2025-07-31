import type { EditorComponent } from './interfaces'
import type { TypeSchetOperatsii } from '@/common/models'
import type { UseFormReturn } from 'react-hook-form'

import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useFilter } from 'react-aria-components'
import { useTranslation } from 'react-i18next'

import {
  OperatsiiService,
  createOperatsiiSpravochnik,
  operatsiiQueryKeys
} from '@/app/super-admin/operatsii'
import { AutoComplete } from '@/common/components/auto-complete-new'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useDebounceValue, useEventCallback } from '@/common/hooks'

export const createOperatsiiNewEditor = <
  T extends {
    childs: Array<{
      schet?: string
      schet_6?: string
      sub_schet?: string
    }>
  }
>({
  field,
  type_schet
}: {
  field: keyof T & string
  type_schet?: TypeSchetOperatsii
}): EditorComponent<T, any> => {
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
    // const schet_6 = typedForm.watch(`childs.${id}.schet_6`)
    const sub_schet = typedForm.watch(`childs.${id}.sub_schet`)

    const [schetInputValue, setSchetInputValue] = useState<string>('')
    const [subschetInputValue, setSubschetInputValue] = useState<string>('')
    const [debouncedSchetInputValue] = useDebounceValue(schetInputValue)

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

    const { data: schetOptions, isFetching: isFetchingSchetOptions } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getSchetOptions,
        {
          type_schet
        }
      ],
      queryFn: OperatsiiService.getSchetOptions
    })

    const { data: operatsiiOptions, isFetching } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getAll,
        {
          type_schet,
          schet: debouncedSchetInputValue ? debouncedSchetInputValue : undefined
        }
      ],
      queryFn: OperatsiiService.getAll,
      enabled: !!debouncedSchetInputValue
    })

    const filteredSchetOptions = useMemo(
      () => schetOptions?.data?.filter((option) => startsWith(option.schet, schetInputValue)) ?? [],
      [schetOptions, schetInputValue]
    )
    const filteredOperatsiiOptions = useMemo(
      () =>
        operatsiiOptions?.data?.filter((option) =>
          startsWith(option.sub_schet, subschetInputValue)
        ) ?? [],
      [operatsiiOptions, subschetInputValue]
    )

    useEffect(() => {
      setSubschetInputValue(sub_schet ?? '')
    }, [sub_schet])
    useEffect(() => {
      if (!operatsiiSpravochnik.selected) {
        return
      }
      const { schet, schet6, sub_schet } = operatsiiSpravochnik.selected

      setSchetInputValue(schet ?? '')
      setSubschetInputValue(sub_schet ?? '')
      handleChangeField('schet', schet ?? '')
      handleChangeField('schet_6', schet6 ?? '')
      handleChangeField('sub_schet', sub_schet ?? '')
    }, [operatsiiSpravochnik.selected])

    useEffect(() => {
      if (filteredOperatsiiOptions.length === 1) {
        const operatsii = filteredOperatsiiOptions[0]
        onChangeEvent?.(operatsii?.id ?? 0)
      }
    }, [filteredOperatsiiOptions, onChangeEvent])

    return (
      <div
        className="w-full grid grid-cols-2 divide-x"
        onDoubleClick={operatsiiSpravochnik.open}
      >
        <AutoComplete
          editor
          error={!!error}
          tabIndex={tabIndex}
          isDisabled={isFetchingSchetOptions}
          inputValue={schetInputValue}
          onInputChange={setSchetInputValue}
          selectedKey={schet || ''}
          onSelectionChange={(value) => {
            if (operatsiiSpravochnik.selected && operatsiiSpravochnik.selected.schet !== value) {
              onChange?.(0)
            }
            handleChangeField('schet', (value as string) || '')
          }}
          className="border-none"
          placeholder={t('schet')}
          items={filteredSchetOptions}
        >
          {filteredSchetOptions.map((item) => (
            <ComboboxItem
              id={item.schet}
              key={`${item.schet}-${item.schet6}`}
            >
              {item.schet}({item.schet6})
            </ComboboxItem>
          ))}
        </AutoComplete>
        <JollyComboBox
          editor
          error={!!error}
          tabIndex={tabIndex}
          allowsEmptyCollection
          isDisabled={isFetching}
          inputValue={subschetInputValue}
          onInputChange={setSubschetInputValue}
          menuTrigger="focus"
          selectedKey={(value as string) ?? ''}
          onSelectionChange={(value) => {
            onChange?.(value)
            const selectedOperatsii = operatsiiOptions?.data?.find((option) => option.id === value)
            if (selectedOperatsii) {
              setSubschetInputValue(selectedOperatsii.sub_schet)
              handleChangeField('sub_schet', selectedOperatsii.sub_schet)
            }
          }}
          placeholder={t('subschet')}
          items={filteredOperatsiiOptions}
        >
          {(item) => (
            <ComboboxItem id={item.id}>
              {item.sub_schet} - {item.name}
            </ComboboxItem>
          )}
        </JollyComboBox>
      </div>
    )
  }
}
