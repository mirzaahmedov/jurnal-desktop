import type { EditorComponentType } from './types'
import type { Operatsii, TypeSchetOperatsii } from '@renderer/common/models'

import { useLayoutEffect, useRef, useState } from 'react'

import {
  createOperatsiiSpravochnik,
  getOperatsiiSchetOptionsQuery,
  operatsiiQueryKeys,
  operatsiiService
} from '@renderer/app/super-admin/operatsii'
import { AutoComplete } from '@renderer/common/components/auto-complete'
import { SpravochnikInput, useSpravochnik } from '@renderer/common/features/spravochnik'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

type OperatsiiEditorOptions = {
  type_schet: TypeSchetOperatsii
}
export const createOperatsiiEditor = <T extends { spravochnik_operatsii_id?: number }>({
  type_schet
}: OperatsiiEditorOptions): EditorComponentType<T> => {
  return ({ tabIndex, id, row, errors, onChange, params }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [schetFilter, setSchetFilter] = useState<null | string>(null)
    const [subschetFilter, setSubschetFilter] = useState<null | string>(null)

    const [, setDisabled] = useState<boolean>(false)
    const [schet, setSchet] = useState<null | string>(null)

    const { t } = useTranslation()

    const paramsRef = useRef<{ onChangeOperatsii: (selected: Operatsii | undefined) => void }>(
      params as any
    )

    useLayoutEffect(() => {
      paramsRef.current = params as any
    })

    const operatsiiSpravochnik = useSpravochnik(
      createOperatsiiSpravochnik({
        value: row.spravochnik_operatsii_id || undefined,
        onChange: (value, selected) => {
          onChange?.({
            id,
            key: 'spravochnik_operatsii_id',
            payload: {
              ...row,
              spravochnik_operatsii_id: value
            }
          })
          paramsRef.current?.onChangeOperatsii?.(selected)
          if (value !== undefined) {
            setSchet(null)
            setSchetFilter(null)
            setSubschetFilter(null)
          }
        },
        params: {
          type_schet
        }
      })
    )

    const { data: schetOptions, isFetching: isFetchingSchetOptions } = useQuery({
      queryKey: [operatsiiQueryKeys.getSchetOptions, { type_schet }],
      queryFn: getOperatsiiSchetOptionsQuery
    })

    const { data: operatsiiList, isFetching } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getAll,
        {
          type_schet,
          schet: schet ? schet : undefined,
          sub_schet: subschetFilter ? subschetFilter : undefined
        }
      ],
      queryFn: operatsiiService.getAll,
      enabled: !!schet,
      placeholderData: (prev) => prev
    })

    const filteredSchetOptions =
      schetOptions?.data?.filter((o) => o.schet.includes(schetFilter ?? '')) ?? []

    return (
      <div className="w-full flex">
        <AutoComplete
          isFetching={isFetchingSchetOptions}
          // disabled={schetFilter === null}
          disabled={true}
          options={filteredSchetOptions}
          className="w-full border-r"
          getOptionLabel={(option) => option.schet}
          getOptionValue={(option) => option.schet}
          onSelect={(option) => {
            setSchet(option.schet)
            setSchetFilter(null)
            inputRef.current?.focus()
          }}
        >
          <SpravochnikInput
            {...operatsiiSpravochnik}
            editor
            readOnly
            tabIndex={tabIndex}
            error={!!errors?.spravochnik_operatsii_id}
            name="spravochnik_operatsii_id"
            placeholder={t('schet')}
            onChange={(e) => {
              setSchetFilter(e.target.value)
              operatsiiSpravochnik.clear()
            }}
            onBlur={(e) => {
              setSchetFilter(null)
              setSchet(e.target.value)
              const found = schetOptions?.data?.find((o) => o.schet === e.target.value)
              console.log({ found })
              if (!found) {
                setSchet(null)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
            getInputValue={(selected) => {
              if (schetFilter !== null) {
                return schetFilter
              }
              if (schet !== null) {
                return schet
              }
              return selected ? selected.schet : ''
            }}
          />
        </AutoComplete>
        <AutoComplete
          isFetching={isFetching}
          options={operatsiiList?.data ?? []}
          // disabled={disabled}
          disabled={true}
          className="w-full"
          value={row.spravochnik_operatsii_id?.toString()}
          getOptionLabel={(option) => option.sub_schet}
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
              paramsRef.current?.onChangeOperatsii?.(option)

              setSubschetFilter(null)
              setDisabled(true)
              inputRef?.current?.focus()
            }
          }}
        >
          <SpravochnikInput
            {...operatsiiSpravochnik}
            editor
            readOnly
            inputRef={inputRef}
            tabIndex={tabIndex}
            error={!!errors?.spravochnik_operatsii_id}
            name="spravochnik_operatsii_id"
            placeholder={t('subschet')}
            onChange={(e) => {
              setSubschetFilter(e.target.value)
              setDisabled(false)
            }}
            onBlur={() => {
              setSubschetFilter(null)
              setDisabled(true)
            }}
            onFocus={() => {
              setDisabled(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
            getInputValue={(selected) => {
              if (subschetFilter !== null) {
                return subschetFilter
              }
              return selected ? selected.sub_schet : ''
            }}
          />
        </AutoComplete>
      </div>
    )
  }
}
