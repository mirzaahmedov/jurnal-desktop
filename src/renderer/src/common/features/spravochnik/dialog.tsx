import type { SpravochnikData } from './store'
import type { KeyboardEvent } from 'react'

import { useEffect, useRef, useState } from 'react'

import { useToggle } from '@renderer/common/hooks'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Paginate from 'react-paginate'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { extendObject } from '@/common/lib/utils'
import { normalizeEmptyFields } from '@/common/lib/validation'

type SpravochnikProps = {
  close: (id: string) => void
  spravochnik: SpravochnikData<{ id: number }>
}
export const Spravochnik = ({ close, spravochnik }: SpravochnikProps) => {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const [page, setPage] = useState<number>(1)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [state, setState] = useState<Record<string, unknown>>({})
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>({})
  const [selected, setSelected] = useState<{ id: number } | undefined>(undefined)

  const dialogToggle = useToggle()

  const queryKey = spravochnik?.queryKeys?.getAll ?? spravochnik?.endpoint ?? 'spravochnik'

  const { data, error, isFetching } = useQuery({
    queryKey: [
      queryKey,
      extendObject(
        {
          page,
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
      <Dialog
        defaultOpen
        onOpenChange={(open) => {
          if (!open) {
            close(spravochnik.id)
            spravochnik.onClose?.()
          }
        }}
      >
        <DialogContent
          className="max-w-screen-2xl w-full p-0 gap-0 h-3/5 overflow-auto flex flex-col"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader className="flex-0 p-5 flex items-center flex-row">
            <DialogTitle>{spravochnik?.title}</DialogTitle>

            <div className="flex-1 flex items-center gap-5 px-10">
              {spravochnik?.filters?.map((FilterComponent, id) => (
                <FilterComponent
                  key={id}
                  getValue={getValue}
                  setValue={setValue}
                />
              ))}
              {CustomDialog ? (
                <>
                  <Button onClick={dialogToggle.open}>Добавить</Button>
                </>
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
              <div className="flex-1 relative overflow-auto scrollbar">
                {isFetching ? <LoadingOverlay /> : null}
                {CustomTable ? (
                  <CustomTable
                    data={data?.data ?? []}
                    columnDefs={spravochnik.columnDefs}
                    activeRowId={String(selected?.id)}
                    disabledIds={spravochnik.disabledIds}
                    selectedId={spravochnik.selectedId}
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
                    disabledIds={spravochnik.disabledIds}
                    selectedId={spravochnik.selectedId}
                    {...spravochnik.tableProps}
                  />
                )}
              </div>
              <div className="flex-0 p-5">
                {data?.meta?.pageCount ? (
                  <Paginate
                    className="flex gap-4"
                    pageRangeDisplayed={2}
                    breakLabel="..."
                    forcePage={page - 1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    pageLabelBuilder={(item) => (
                      <Button
                        variant={page === item ? 'outline' : 'ghost'}
                        size="icon"
                      >
                        {item}
                      </Button>
                    )}
                    nextLabel={
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <ArrowRight className="btn-icon !ml-0" />
                      </Button>
                    }
                    previousLabel={
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <ArrowLeft className="btn-icon !ml-0" />
                      </Button>
                    }
                    pageCount={data?.meta?.pageCount ?? 0}
                    renderOnZeroPageCount={null}
                  />
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
