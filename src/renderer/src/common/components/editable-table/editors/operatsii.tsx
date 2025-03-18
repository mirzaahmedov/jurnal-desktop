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

type Filter<T extends object> = { [K in keyof T]: T[K] extends number ? K : never }

export const withEditorProps = <Options extends object>(
  editorConstructor: <T extends object, Field extends keyof Filter<T> & string>(
    options: Options & { field: Field }
  ) => EditorComponentType<T>
) => {
  return editorConstructor
}

export const createOperatsiiEditor = withEditorProps<{
  type_schet?: TypeSchetOperatsii
}>(({ field, type_schet }) => {
  return ({ tabIndex, id, row, errors, onChange, params }) => {
    const error = errors?.[field as keyof typeof errors]
    const value = row[field] as number | undefined

    const inputRef = useRef<HTMLInputElement>(null)
    const editorState = useRef<{
      clickedOutside: boolean
    }>({
      clickedOutside: false
    })

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
        value: value || undefined,
        onChange: (value, selected) => {
          onChange?.({
            id,
            key: field,
            payload: {
              ...row,
              [field]: value
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
      schetOptions?.data?.filter((o) => o.schet?.includes(schet ?? '')) ?? []

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
      operatsiiOptions?.data?.filter((o) => o.sub_schet?.includes(subschet ?? '')) ?? []

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
          disabled={!!operatsiiSpravochnik.selected || !schet}
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
              error={!!error}
              name={`${field}-schet`}
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
          value={value?.toString()}
          getOptionLabel={(option) => option.sub_schet}
          getOptionValue={(option) => option.id.toString()}
          onSelect={(option) => {
            if (value !== option.id) {
              onChange?.({
                id,
                key: field,
                payload: {
                  ...row,
                  [field]: option.id
                }
              })
              setSchet(option.schet)
              setSubschet(option.sub_schet)

              paramsRef.current?.onChangeOperatsii?.(option)
            }
          }}
          popoverProps={{
            onCloseAutoFocus: (e) => {
              if (editorState.current.clickedOutside) {
                e.preventDefault()
                editorState.current.clickedOutside = false
              }
            },
            onInteractOutside: () => {
              editorState.current.clickedOutside = true
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
              error={!!error}
              data-error={false}
              name={`${field}-subschet`}
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
})
