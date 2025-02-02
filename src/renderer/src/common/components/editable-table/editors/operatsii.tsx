import type { EditorComponentType } from './types'
import type { Operatsii, TypeSchetOperatsii } from '@/common/models'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { operatsiiQueryKeys } from '@renderer/app/super-admin/operatsii/constants'
import { useQuery } from '@tanstack/react-query'

import { createOperatsiiSpravochnik, operatsiiService } from '@/app/super-admin/operatsii'
import { AutoComplete } from '@/common/components/auto-complete'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

// const operatsii_input_regex = /^\d+\/?\d*$/

type OperatsiiEditorOptions = {
  type_schet: TypeSchetOperatsii
}
export const createOperatsiiEditor = <T extends { spravochnik_operatsii_id?: number }>({
  type_schet
}: OperatsiiEditorOptions): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange, params }) => {
    const [innerValue, setInnerValue] = useState<null | string>(null)

    const paramsRef = useRef<{ onChangeOperatsii: (selected: Operatsii | undefined) => void }>(
      params as any
    )

    useLayoutEffect(() => {
      paramsRef.current = params as any
    })

    const operatsiiSpravochnik = useSpravochnik(
      createOperatsiiSpravochnik({
        value: row.spravochnik_operatsii_id || undefined,
        onChange: (value) => {
          onChange?.({
            id,
            key: 'spravochnik_operatsii_id',
            payload: {
              ...row,
              spravochnik_operatsii_id: value
            }
          })
        },
        params: {
          type_schet
        }
      })
    )

    useEffect(() => {
      paramsRef.current?.onChangeOperatsii?.(operatsiiSpravochnik.selected)
    }, [operatsiiSpravochnik.selected])

    const [schet, subschet] = innerValue?.split('/') ?? ''
    const { data: operatsiiList, isFetching } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getAll,
        {
          type_schet,
          search: schet ? schet : undefined,
          meta_search: subschet ? subschet : undefined
        }
      ],
      queryFn: operatsiiService.getAll,
      enabled: !!innerValue,
      placeholderData: (prev) => prev
    })

    return (
      <AutoComplete
        isFetching={isFetching}
        disabled={innerValue === null}
        options={operatsiiList?.data ?? []}
        className="w-full"
        getOptionLabel={(option) => `${option.schet} / ${option.sub_schet} - ${option.name}`}
        getOptionValue={(option) => option.id.toString()}
        onSelect={(option) => {
          if (row.spravochnik_operatsii_id !== option.id) {
            onChange?.({
              id,
              key: 'spravochnik_operatsii_id',
              payload: {
                ...row,
                spravochnik_operatsii_id: option.id
              }
            })
            setInnerValue(null)
          }
        }}
      >
        <SpravochnikInput
          {...operatsiiSpravochnik}
          editor
          tabIndex={tabIndex}
          error={!!errors?.spravochnik_operatsii_id}
          name="spravochnik_operatsii_id"
          onChange={(e) => {
            const value = e.target.value
            // if (operatsii_input_regex.test(value) || value === '') {
            setInnerValue(value)
            // }
          }}
          onBlur={() => {
            setInnerValue(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
            }
          }}
          getInputValue={(selected) => {
            if (innerValue !== null) {
              return innerValue
            }
            return selected ? formatInputValue(selected) : ''
          }}
        />
      </AutoComplete>
    )
  }
}

const formatInputValue = (selected: Operatsii) =>
  `${selected.schet} / ${selected.sub_schet} - ${selected.name}`
