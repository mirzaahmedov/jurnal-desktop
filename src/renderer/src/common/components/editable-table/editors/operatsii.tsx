import type { EditorComponent } from './interfaces'
import type { TypeSchetOperatsii } from '@/common/models'

import { useEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  OperatsiiService,
  createOperatsiiSpravochnik,
  operatsiiQueryKeys
} from '@/app/super-admin/operatsii'
import { AutoComplete } from '@/common/components/auto-complete'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { useDebounceValue } from '@/common/hooks'

type Filter<T extends object> = { [K in keyof T]: T[K] extends number ? K : never }

export const withEditorProps = <Options extends object>(
  editorConstructor: <T extends object, Field extends keyof Filter<T> & string>(
    options: Options & { field: Field }
  ) => EditorComponent<T>
) => {
  return editorConstructor
}

export const createOperatsiiEditor = withEditorProps<{
  type_schet?: TypeSchetOperatsii
}>(({ field, type_schet }) => {
  return ({ tabIndex, id, value, errors, onChange, form }) => {
    const error = errors?.[field as keyof typeof errors]

    const inputRef = useRef<HTMLInputElement>(null)
    const editorState = useRef<{
      clickedOutside: boolean
    }>({
      clickedOutside: false
    })

    const [schet, setSchet] = useState<string>()
    const [schet6, setSchet6] = useState<string>()
    const [subschet, setSubschet] = useState<string>()

    const [debouncedSchet] = useDebounceValue(schet)

    const { t } = useTranslation()

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

    const { data: schetOptions, isFetching: isFetchingSchetOptions } = useQuery({
      queryKey: [
        operatsiiQueryKeys.getSchetOptions,
        {
          type_schet
        }
      ],
      queryFn: OperatsiiService.getSchetOptions
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
      queryFn: OperatsiiService.getAll,
      enabled: !!schet && !operatsiiSpravochnik.selected
    })
    const filteredOperatsiiOptions =
      operatsiiOptions?.data?.filter((o) => o.sub_schet?.includes(subschet ?? '')) ?? []

    useEffect(() => {
      if (operatsiiSpravochnik.selected) {
        setSchet(operatsiiSpravochnik.selected?.schet)
        setSubschet(operatsiiSpravochnik.selected?.sub_schet)
        setSchet6(operatsiiSpravochnik.selected?.schet6)
        form.setValue(`childs.${id}.schet`, operatsiiSpravochnik.selected?.schet)
        form.setValue(`childs.${id}.sub_schet`, operatsiiSpravochnik.selected?.sub_schet)
      }
    }, [operatsiiSpravochnik.selected])

    console.log({
      schet6,
      filteredSchetOptions
    })

    return (
      <div className="w-full grid grid-cols-2">
        <AutoComplete
          autoSelectSingleResult={false}
          isFetching={isFetchingSchetOptions}
          options={filteredSchetOptions}
          disabled={!!operatsiiSpravochnik.selected || !schet}
          getOptionLabel={(option) => `${option.schet} (${option.schet6 ?? ''})`}
          getOptionValue={(option) => option.schet}
          onSelect={(option) => {
            setSchet(option.schet)
            setSchet6(option.schet6)
            inputRef.current?.focus()
          }}
          className="border-r"
          popoverProps={{
            onCloseAutoFocus: (e) => e.preventDefault()
          }}
        >
          {({ open, close }) => (
            <div className="relative">
              <SpravochnikInput
                {...operatsiiSpravochnik}
                readOnly={false}
                clear={() => {
                  operatsiiSpravochnik.clear()
                  setSchet('')
                  setSchet6('')
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

                  const selectedOption = schetOptions?.data?.find((o) => o.schet === e.target.value)
                  if (selectedOption) {
                    setSchet6(selectedOption.schet6)
                  } else {
                    setSchet6('')
                  }
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
              {schet ? (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <span className="opacity-0">{schet}</span> ({schet6})
                </span>
              ) : null}
            </div>
          )}
        </AutoComplete>
        <AutoComplete
          autoSelectSingleResult={false}
          isFetching={isFetching}
          options={filteredOperatsiiOptions ?? []}
          disabled={(!!operatsiiSpravochnik.selected && subschet !== undefined) || !schet}
          value={value?.toString()}
          getOptionLabel={(option) => (
            <div>
              {option.sub_schet} - {option.name}
            </div>
          )}
          getOptionValue={(option) => option.id.toString()}
          onSelect={(option) => {
            if (value !== option.id) {
              onChange?.(option.id)
              setSchet(option.schet)
              setSubschet(option.sub_schet)
            }
          }}
          popoverProps={{
            className: 'w-[600px]',
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
              readOnly={false}
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
