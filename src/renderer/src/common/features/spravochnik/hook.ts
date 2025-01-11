import type { APIEndpoints, CRUDService } from '@/common/features/crud'
import type { ComponentType, RefObject } from 'react'
import type { FilterComponentProps, SpravochnikStoreType } from './store'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import type { ColumnDef } from '@/common/components'
import { useQuery } from '@tanstack/react-query'
import { useSpravochnikStore } from './store'

type SpravochnikHookCallbacksType<T> = {
  onChange?: (id: number, data?: T) => void
  onClose?: () => void
}

export type SpravochnikHookOptions<T extends { id: number }> = SpravochnikHookCallbacksType<T> & {
  endpoint: APIEndpoints
  value?: number
  title?: string
  columns: ColumnDef<T>[]
  service: CRUDService<T, any>
  enabled?: boolean
  params?: Record<string, unknown>
  includeParamsInGetById?: boolean
  filters?: ComponentType<FilterComponentProps>[]
  defaultFilters?: Record<string, unknown>
  search?: boolean
  CustomTable?: (props: {
    data: T[]
    columns: ColumnDef<T>[]
    selectedRowId?: string
    onClickRow(row: T): void
  }) => JSX.Element
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
  const isInitialMount = useRef(true)
  const callbacksRef = useRef<SpravochnikHookCallbacksType<T>>({
    onChange: options.onChange,
    onClose: options.onClose
  })

  const [selectedId, setSelectedId] = useState<undefined | number>()

  const { isOpen, open, close, setSpravochnik, setSelectId, spravochnikId, setSpravochnikId } =
    useSpravochnikStore() as SpravochnikStoreType<T>

  const { data: selected, isLoading: loading } = useQuery({
    queryKey: [
      options.endpoint,
      selectedId,
      options.includeParamsInGetById ? options.params : undefined
    ],
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

  useEffect(() => {
    if (!isOpen && !isInitialMount.current && id === spravochnikId) {
      callbacksRef.current.onClose?.()
      inputRef.current?.focus()
      setSpravochnikId()
    }
    isInitialMount.current = false
  }, [id, spravochnikId, isOpen, setSpravochnikId])

  const handleOpenDialog = useCallback(() => {
    if (!options.service || !options.columns) {
      return
    }
    setSpravochnik({
      title: options.title ?? 'Выберите',
      endpoint: options.endpoint,
      filters: options.filters,
      defaultFilters: options.defaultFilters,
      params: options.params,
      columns: options.columns,
      service: options.service,
      CustomTable: options.CustomTable
    })
    setSelectId((id, data) => {
      setSelectedId(id)
      callbacksRef.current?.onChange?.(id, data)
      close()
    })
    setSpravochnikId(id)

    open()
  }, [
    id,
    setSpravochnikId,
    options.columns,
    options.service,
    options.title,
    options.endpoint,
    options.filters,
    options.params,
    options.CustomTable,
    open,
    close,
    setSpravochnik,
    setSelectId
  ])

  const handleClearState = useCallback(() => {
    setSelectedId(0)
    callbacksRef.current.onChange?.(0, undefined)
  }, [])

  return {
    selected: selected?.data,
    loading,
    isOpen,
    inputRef,
    open: handleOpenDialog,
    clear: handleClearState
  }
}
