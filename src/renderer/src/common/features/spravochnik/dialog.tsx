import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/common/components/ui/button'
import type { KeyboardEvent } from 'react'
import Paginate from 'react-paginate'
import { ScrollArea } from '@renderer/common/components/ui/scroll-area'
import type { SpravochnikStoreType } from './store'
import { extendObject } from '@/common/lib/utils'
import { normalizeEmptyFields } from '@/common/lib/validation'
import { useQuery } from '@tanstack/react-query'
import { useSpravochnikStore } from './store'

export const Spravochnik = () => {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const [page, setPage] = useState<number>(1)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [queryParams, setQueryParams] = useState<Record<string, unknown>>({})
  const [selected, setSelected] = useState<{ id: number } | undefined>(undefined)

  const {
    isOpen,
    setOpen,
    close,
    selectId,
    data: spravochnik
  } = useSpravochnikStore() as SpravochnikStoreType<{ id: number }>

  const { data, error, isFetching } = useQuery({
    queryKey: [
      spravochnik?.endpoint ?? 'spravochnik',
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
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: isOpen
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
    if (!isOpen) {
      setPage(1)
      setValues({})
    }
  }, [isOpen])
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
    if (!isOpen) {
      return
    }
    switch (e.key) {
      case 'Escape':
        close()
        return
      case 'Enter':
        e.preventDefault()
        e.stopPropagation()
        if (selected) {
          selectId?.(selected.id, selected)
        }
        close()
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setOpen}
    >
      <DialogContent
        className="max-w-screen-2xl w-full p-0 gap-0 h-3/5 overflow-auto flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {isFetching ? <LoadingOverlay /> : null}
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
          </div>
        </DialogHeader>
        {error ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <h3 className="text-xl">Не удалось получить данные :(</h3>
            <p className="text-sm text-slate-500">{error?.message}</p>
          </div>
        ) : Array.isArray(spravochnik?.columns) ? (
          <>
            <ScrollArea className="flex-1">
              {CustomTable ? (
                <CustomTable
                  data={data?.data ?? []}
                  columns={spravochnik.columns}
                  selectedRowId={String(selected?.id)}
                  onClickRow={(row) => {
                    selectId?.(row.id, row)
                    close()
                  }}
                />
              ) : (
                <GenericTable
                  data={data?.data ?? []}
                  columns={spravochnik?.columns}
                  getRowId={(row) => String(row.id)}
                  selectedRowId={String(selected?.id)}
                  onClickRow={(row) => {
                    selectId?.(row.id, row)
                    close()
                  }}
                />
              )}
            </ScrollArea>
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
  )
}
