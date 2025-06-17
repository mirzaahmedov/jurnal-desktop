import type { SpravochnikData, SpravochnikStore } from './store'
import type { RefObject } from 'react'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { useSpravochnikStore } from './store'

interface SpravochnikHookCallbacks<T> {
  onChange?: (id: number | undefined, data?: T) => void
  onClose?: VoidFunction
}

export type SpravochnikHookOptions<T extends { id: number }> = SpravochnikHookCallbacks<T> &
  Omit<SpravochnikData<T>, 'id' | 'disabledIds'> & {
    value?: number
    enabled?: boolean
    includeParamsInGetById?: boolean
    disabledIds?: number[]
  }

export type UseSpravochnikReturn<T> = {
  selected: T | undefined
  loading: boolean
  isOpen: boolean
  open: VoidFunction
  clear: VoidFunction
  inputRef: RefObject<HTMLInputElement>
}

export const useSpravochnik = <T extends { id: number }>(
  options: SpravochnikHookOptions<T>
): UseSpravochnikReturn<T> => {
  const id = useId()

  const inputRef = useRef<HTMLInputElement>(null)
  const callbacksRef = useRef<SpravochnikHookCallbacks<T>>({
    onChange: options.onChange,
    onClose: options.onClose
  })
  const paramsRef = useRef<Pick<SpravochnikData<T>, 'disabledIds'>>({
    disabledIds: options.disabledIds ?? []
  })

  useLayoutEffect(() => {
    paramsRef.current = {
      disabledIds: options.disabledIds ?? []
    }
  })

  const [selectedId, setSelectedId] = useState<undefined | number>()

  const { isOpen, open, close } = useSpravochnikStore() as SpravochnikStore<T>

  const queryKey = options.queryKeys?.getById ?? options.endpoint ?? 'spravochnik/id'

  const { data: selected, isFetching: loading } = useQuery({
    queryKey: [queryKey, selectedId, options.includeParamsInGetById ? options.params : undefined],
    queryFn: options.service.getById,
    enabled: !!selectedId,
    placeholderData: undefined,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  })

  useLayoutEffect(() => {
    callbacksRef.current = {
      onChange: options.onChange,
      onClose: options.onClose
    }
  })

  useEffect(() => {
    if (!options.value) {
      setSelectedId(undefined)
      return
    }
    setSelectedId(options.value)
  }, [options.value])

  const handleOpenDialog = useCallback(() => {
    if (!options.service || !options.columnDefs) {
      return
    }
    open({
      id,
      title: options.title ?? 'Выберите',
      endpoint: options.endpoint,
      filters: options.filters,
      defaultFilters: options.defaultFilters,
      params: options.params,
      columnDefs: options.columnDefs,
      service: options.service,
      queryKeys: options.queryKeys,
      getRowId: options.getRowId,
      disabledIds: paramsRef.current.disabledIds,
      selectedId,
      onClose: () => {
        callbacksRef.current.onClose?.()
        if (inputRef.current) {
          const input = inputRef.current
          setTimeout(() => {
            input.focus()
          }, 300)
        }
      },
      selectId: (selectedId, values) => {
        setSelectedId(selectedId)
        callbacksRef.current?.onChange?.(selectedId, values)
        close(id)
      },
      CustomTable: options.CustomTable,
      Dialog: options.Dialog
    })
  }, [
    id,
    options.columnDefs,
    options.service,
    options.title,
    options.endpoint,
    options.filters,
    options.params,
    options.CustomTable,
    options.Dialog,
    options.queryKeys,
    options.getRowId,
    selectedId,
    open,
    close
  ])

  const handleClearState = useCallback(() => {
    setSelectedId(undefined)
    callbacksRef.current.onChange?.(undefined, undefined)
  }, [])

  return {
    selected: selected?.data ?? undefined,
    loading,
    isOpen: isOpen(id),
    inputRef,
    open: handleOpenDialog,
    clear: handleClearState
  }
}
