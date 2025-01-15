import type { SpravochnikData, SpravochnikStore } from './store'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import type { RefObject } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSpravochnikStore } from './store'

type SpravochnikHookCallbacks<T> = {
  onChange?: (id: number, data?: T) => void
  onClose?: () => void
}

export type SpravochnikHookOptions<T extends { id: number }> = SpravochnikHookCallbacks<T> &
  Omit<SpravochnikData<T>, 'id'> & {
    value?: number
    enabled?: boolean
    includeParamsInGetById?: boolean
  }

export type UseSpravochnikReturn<T> = {
  selected: T | undefined
  loading: boolean
  isOpen: boolean
  open: () => void
  clear: () => void
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

  const [selectedId, setSelectedId] = useState<undefined | number>()

  const { isOpen, open, close } = useSpravochnikStore() as SpravochnikStore<T>

  const queryKey = options.queryKeys?.getAll ?? options.endpoint ?? 'spravochnik/id'

  const { data: selected, isLoading: loading } = useQuery({
    queryKey: [queryKey, selectedId, options.includeParamsInGetById ? options.params : undefined],
    queryFn: options.service.getById,
    enabled: !!selectedId,
    placeholderData: undefined,
    refetchOnMount: false
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
    if (!options.service || !options.columns) {
      return
    }
    open({
      id,
      title: options.title ?? 'Выберите',
      endpoint: options.endpoint,
      filters: options.filters,
      defaultFilters: options.defaultFilters,
      params: options.params,
      columns: options.columns,
      service: options.service,
      queryKeys: options.queryKeys,
      onClose: () => {
        callbacksRef.current.onClose?.()
        inputRef.current?.focus()
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
    options.columns,
    options.service,
    options.title,
    options.endpoint,
    options.filters,
    options.params,
    options.CustomTable,
    options.Dialog,
    options.queryKeys,
    open,
    close
  ])

  const handleClearState = useCallback(() => {
    setSelectedId(0)
    callbacksRef.current.onChange?.(0, undefined)
  }, [])

  return {
    selected: selected?.data,
    loading,
    isOpen: isOpen(id),
    inputRef,
    open: handleOpenDialog,
    clear: handleClearState
  }
}
