import type { EditorComponentType } from './types'
import type { Operatsii, TypeSchetOperatsii } from '@renderer/common/models'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  createOperatsiiSpravochnik,
  getOperatsiiSchetOptionsQuery,
  operatsiiQueryKeys,
  operatsiiService
} from '@renderer/app/super-admin/operatsii'
import { AutoComplete } from '@renderer/common/components/auto-complete'
import { SpravochnikInput, useSpravochnik } from '@renderer/common/features/spravochnik'
import { useDebounceValue } from '@renderer/common/hooks'
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

    const [schet, setSchet] = useState<string>()
    const [subschet, setSubschet] = useState<string>()

    const [debouncedSchet] = useDebounceValue(schet)

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
        },
        params: {
          type_schet
        }
      })
    )

    const { data: schetOptions, isFetching: isFetchingSchetOptions } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getSchetOptions,
        {
          type_schet
        }
      ],
      queryFn: getOperatsiiSchetOptionsQuery
    })
    const filteredSchetOptions =
      schetOptions?.data?.filter((o) => o.schet.includes(schet ?? '')) ?? []

    const { data: operatsiiOptions, isFetching } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getAll,
        {
          type_schet,
          schet: debouncedSchet ? debouncedSchet : undefined
        }
      ],
      queryFn: operatsiiService.getAll,
      enabled: !!schet && !operatsiiSpravochnik.selected
    })
    const filteredOperatsiiOptions =
      operatsiiOptions?.data?.filter((o) => o.sub_schet.includes(subschet ?? '')) ?? []

    useEffect(() => {
      if (operatsiiSpravochnik.selected) {
        setSchet(operatsiiSpravochnik.selected?.schet)
        setSubschet(operatsiiSpravochnik.selected?.sub_schet)
      }
    }, [operatsiiSpravochnik.selected])

    return (
      <div className="w-full grid grid-cols-2">
        <AutoComplete
          autoSelectSingleResult={false}
          isFetching={isFetchingSchetOptions}
          options={filteredSchetOptions}
          disabled={!!operatsiiSpravochnik.selected}
          getOptionLabel={(option) => option.schet}
          getOptionValue={(option) => option.schet}
          onSelect={(option) => {
            setSchet(option.schet)
            inputRef.current?.focus()
          }}
          className="border-r"
          popoverProps={{
            onCloseAutoFocus: (e) => e.preventDefault()
          }}
        >
          {({ open, close }) => (
            <SpravochnikInput
              {...operatsiiSpravochnik}
              clear={() => {
                operatsiiSpravochnik.clear()
                setSchet('')
                setSubschet('')
              }}
              editor
              type="text"
              tabIndex={tabIndex}
              error={!!errors?.spravochnik_operatsii_id}
              name="spravochnik_operatsii_id"
              placeholder={t('schet')}
              onChange={(e) => {
                operatsiiSpravochnik.clear()
                setSchet(e.target.value)
                setSubschet(undefined)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
              onFocus={open}
              onBlur={close}
              getInputValue={() => schet ?? ''}
              onMouseDown={(e) => e.stopPropagation()}
            />
          )}
        </AutoComplete>
        <AutoComplete
          autoSelectSingleResult={false}
          isFetching={isFetching}
          options={filteredOperatsiiOptions ?? []}
          disabled={(!!operatsiiSpravochnik.selected && subschet !== undefined) || !schet}
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
              setSchet(option.schet)
              setSubschet(option.sub_schet)

              paramsRef.current?.onChangeOperatsii?.(option)
            }
          }}
        >
          {({ open, close }) => (
            <SpravochnikInput
              {...operatsiiSpravochnik}
              clear={() => {
                operatsiiSpravochnik.clear()
                setSchet('')
                setSubschet('')
              }}
              editor
              type="text"
              inputRef={inputRef}
              tabIndex={tabIndex}
              error={!!errors?.spravochnik_operatsii_id}
              data-error={false}
              name="spravochnik_operatsii_id"
              placeholder={t('subschet')}
              onChange={(e) => {
                setSubschet(e.target.value)
                operatsiiSpravochnik.clear()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
              getInputValue={() => {
                return subschet ?? ''
              }}
              onFocus={open}
              onBlur={close}
              className="w-full"
              onMouseDown={(e) => e.stopPropagation()}
            />
          )}
        </AutoComplete>
      </div>
    )
  }
}
