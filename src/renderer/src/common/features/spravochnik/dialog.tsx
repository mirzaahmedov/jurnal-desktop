import type { SpravochnikData } from './store'
import type { KeyboardEvent } from 'react'

import { useEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay, useTableSort } from '@/common/components'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Pagination } from '@/common/components/pagination'
import { Button } from '@/common/components/ui/button'
import { useToggle } from '@/common/hooks'
import { cn, extendObject } from '@/common/lib/utils'
import { normalizeEmptyFields } from '@/common/lib/validation'

type SpravochnikProps = {
  close: (id: string) => void
  spravochnik: SpravochnikData<{ id: number }>
}
export const Spravochnik = ({ close, spravochnik }: SpravochnikProps) => {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [state, setState] = useState<Record<string, unknown>>({})
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>({})
  const [selected, setSelected] = useState<{ id: number } | undefined>(undefined)

  const { t } = useTranslation()
  const { sorting, getColumnSorted, handleSort } = useTableSort()

  const dialogToggle = useToggle()

  const queryKey = spravochnik?.queryKeys?.getAll ?? spravochnik?.endpoint ?? 'spravochnik'

  console.log('Spravochnik render', JSON.stringify({ params: spravochnik?.params }))

  const { data, error, isFetching } = useQuery({
    queryKey: [
      queryKey,
      extendObject(
        {
          page,
          limit: pageSize,
          ...sorting,
          ...(spravochnik?.defaultFilters || {}),
          ...queryParams
        },
        spravochnik?.params ?? {}
      )
    ],
    queryFn: spravochnik?.service.getAll,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      setQueryParams(normalizeEmptyFields(values))
    }, 500)

    return () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    }
  }, [values])
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSelected(data.data[0])
    }
  }, [data?.data])
  useEffect(() => {
    setPage(1)
  }, [values])

  const getValue = (name: string): undefined | string => {
    return values[name] ? String(values[name]) : undefined
  }
  const setValue = (name: string, value: undefined | string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isFetching) {
      return
    }
    switch (e.key) {
      case 'Escape':
        close(spravochnik.id)
        spravochnik.onClose?.()
        return
      case 'Enter':
        e.preventDefault()
        e.stopPropagation()
        if (!selected || spravochnik.disabledIds.includes(selected.id)) {
          return
        }
        if (selected) {
          spravochnik.selectId?.(selected.id, selected)
        }
        close(spravochnik.id)
        spravochnik.onClose?.()
        return
      case 'ArrowDown':
        const currentIndex = data?.data?.findIndex((item) => item.id === selected?.id)
        if (
          currentIndex === undefined ||
          currentIndex === -1 ||
          currentIndex + 1 >= (data?.data?.length ?? 0)
        ) {
          return
        }

        setSelected?.(data?.data?.[currentIndex + 1])

        return
      case 'ArrowUp':
        const currentIndexUp = data?.data?.findIndex((item) => item.id === selected?.id)
        if (currentIndexUp === undefined || currentIndexUp - 1 < 0) {
          return
        }

        setSelected?.(data?.data?.[currentIndexUp - 1])
        return
    }
  }

  const CustomTable = spravochnik?.CustomTable
  const CustomDialog = spravochnik?.Dialog

  return (
    <>
      {CustomDialog ? (
        <CustomDialog
          open={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
          params={spravochnik.params}
          state={state}
          setState={setState}
        />
      ) : null}
      <DialogTrigger
        defaultOpen
        onOpenChange={(open) => {
          if (!open) {
            close(spravochnik.id)
            spravochnik.onClose?.()
          }
        }}
      >
        <DialogOverlay>
          <DialogContent
            {...spravochnik.dialogProps}
            className={cn(
              'max-w-screen-2xl w-full h-full max-h-[600px] p-0',
              spravochnik.dialogProps?.className
            )}
          >
            <div
              ref={(elem) => elem?.focus()}
              onKeyDown={handleKeyDown}
              className="flex flex-col gap-0 h-full overflow-auto"
            >
              <DialogHeader className="flex-0 p-5 flex items-center flex-row">
                <DialogTitle>{spravochnik?.title}</DialogTitle>

                <div className="flex-1 flex items-center gap-5 pl-10 pr-5">
                  {spravochnik?.filters?.map((FilterComponent, id) => (
                    <FilterComponent
                      key={id}
                      getValue={getValue}
                      setValue={setValue}
                    />
                  ))}
                  {CustomDialog ? (
                    <Button
                      onClick={dialogToggle.open}
                      className="ml-auto"
                    >
                      <Plus className="btn-icon icon-start" />
                      {t('add')}
                    </Button>
                  ) : null}
                </div>
              </DialogHeader>
              {error ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <h3 className="text-xl">Не удалось получить данные :(</h3>
                  <p className="text-sm text-slate-500">{error?.message}</p>
                </div>
              ) : Array.isArray(spravochnik?.columnDefs) ? (
                <>
                  <div className="flex-1 relative overflow-auto scrollbar scroll-pt-16">
                    {isFetching ? <LoadingOverlay /> : null}
                    {CustomTable ? (
                      <CustomTable
                        data={data?.data ?? []}
                        columnDefs={spravochnik.columnDefs}
                        activeRowId={String(selected?.id)}
                        disabledIds={spravochnik.disabledIds}
                        selectedIds={spravochnik.selectedId ? [spravochnik.selectedId] : []}
                        onClickRow={(row) => {
                          spravochnik.selectId?.(row.id, row)
                          close(spravochnik.id)
                          spravochnik.onClose?.()
                        }}
                        getRowId={spravochnik.getRowId ?? ((row) => row.id)}
                        state={state}
                        setState={setState}
                        dialogToggle={dialogToggle}
                      />
                    ) : (
                      <GenericTable
                        data={data?.data ?? []}
                        columnDefs={spravochnik?.columnDefs}
                        getRowId={spravochnik.getRowId ?? ((row) => String(row.id))}
                        activeRowId={String(selected?.id)}
                        onClickRow={(row) => {
                          spravochnik.selectId?.(row.id, row)
                          close(spravochnik.id)
                          spravochnik.onClose?.()
                        }}
                        getColumnSorted={getColumnSorted}
                        onSort={handleSort}
                        disabledIds={spravochnik.disabledIds}
                        selectedIds={spravochnik.selectedId ? [spravochnik.selectedId] : []}
                        {...spravochnik.tableProps}
                      />
                    )}
                  </div>
                  {spravochnik.pagination ? (
                    <div className="flex-0 p-5 flex items-center gap-10">
                      {data?.meta?.pageCount ? (
                        <Pagination
                          count={data.meta.count ?? 0}
                          pageCount={data.meta.pageCount ?? 0}
                          page={page}
                          limit={pageSize}
                          onChange={({ page, limit }) => {
                            if (page) {
                              setPage(page)
                            }
                            if (limit) {
                              setPageSize(limit)
                            }
                          }}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </>
  )
}
