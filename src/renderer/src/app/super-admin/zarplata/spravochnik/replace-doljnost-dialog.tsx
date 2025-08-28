import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Pagination } from '@/common/components/pagination'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'

import { getZarplataSpravochnikColumnDefs } from './columns'
import { ZarplataSpravochnikType } from './config'
import { ZarplataSpravochnikService } from './service'

const { QueryKeys } = ZarplataSpravochnikService

export interface ReplaceDoljnostDialogProps extends Omit<DialogTriggerProps, 'children'> {}
export const ReplaceDoljnostDialog: FC<ReplaceDoljnostDialogProps> = (props) => {
  const { t } = useTranslation(['app'])

  const [searchLeft, setSearchLeft] = useState('')
  const [searchRight, setSearchRight] = useState('')

  const [paginationLeft, setPaginationLeft] = useState({ page: 1, limit: 50 })
  const [paginationRight, setPaginationRight] = useState({ page: 1, limit: 50 })

  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [targetId, setTargetId] = useState<number | null>(null)

  const zarplataSpravochnikLeftQuery = useQuery({
    queryKey: [
      QueryKeys.GetAll,
      {
        types_type_code: ZarplataSpravochnikType.Doljnost,
        search: searchLeft,
        page: paginationLeft.page,
        limit: paginationLeft.limit
      }
    ],
    queryFn: ZarplataSpravochnikService.getAll
  })
  const zarplataSpravochnikRightQuery = useQuery({
    queryKey: [
      QueryKeys.GetAll,
      {
        types_type_code: ZarplataSpravochnikType.Doljnost,
        search: searchRight,
        page: paginationRight.page,
        limit: paginationRight.limit
      }
    ],
    queryFn: ZarplataSpravochnikService.getAll
  })

  const replaceDoljnostMutation = useMutation({
    mutationFn: ZarplataSpravochnikService.replaceDoljnost
  })

  const handleReplace = async () => [
    replaceDoljnostMutation
      .mutateAsync({
        fromIds: selectedIds,
        toId: targetId!
      })
      .then(() => {
        setSelectedIds([])
        setTargetId(null)
        zarplataSpravochnikLeftQuery.refetch()
        zarplataSpravochnikRightQuery.refetch()
        props?.onOpenChange?.(false)
      })
  ]

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full max-h-full">
          <div className="h-full overflow-hidden flex flex-col">
            <DialogHeader className="pb-2.5">
              <DialogTitle>{t('replace_doljnost')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1">
              <Allotment>
                <Allotment.Pane>
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="p-2.5">
                      <SearchInputDebounced
                        value={searchLeft}
                        onValueChange={setSearchLeft}
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar">
                      <GenericTable
                        data={zarplataSpravochnikLeftQuery?.data?.data ?? []}
                        columnDefs={getZarplataSpravochnikColumnDefs(
                          ZarplataSpravochnikType.Doljnost!,
                          true
                        )}
                        className="table-generic-xs"
                        selectedIds={selectedIds}
                        onClickRow={(row) => {
                          const exits = selectedIds.find((id) => id === row.id)
                          if (exits) {
                            setSelectedIds((prev) => prev.filter((id) => id !== row.id))
                          } else {
                            setSelectedIds((prev) => [...prev, row.id])
                          }
                        }}
                      />
                    </div>
                    <div className="pt-5 border-t">
                      <Pagination
                        page={paginationLeft.page}
                        limit={paginationLeft.limit}
                        pageCount={zarplataSpravochnikLeftQuery?.data?.meta?.pageCount ?? 0}
                        count={zarplataSpravochnikLeftQuery?.data?.meta?.count ?? 0}
                        onChange={({ page, limit }) => {
                          if (page) {
                            setPaginationLeft((prev) => ({ ...prev, page }))
                          }
                          if (limit) {
                            setPaginationLeft((prev) => ({ ...prev, limit }))
                          }
                        }}
                        className="[&_*]:!text-xs gap-x-5"
                        paginateProps={{
                          className: 'gap-1'
                        }}
                      />
                    </div>
                  </div>
                </Allotment.Pane>
                <Allotment.Pane>
                  <div className="flex flex-col h-full overflow-hidden pl-px">
                    <div className="p-2.5">
                      <SearchInputDebounced
                        value={searchRight}
                        onValueChange={setSearchRight}
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar">
                      <GenericTable
                        data={zarplataSpravochnikRightQuery?.data?.data ?? []}
                        columnDefs={getZarplataSpravochnikColumnDefs(
                          ZarplataSpravochnikType.Doljnost!,
                          true
                        )}
                        selectedIds={targetId ? [targetId] : []}
                        onClickRow={(row) => {
                          setTargetId(row.id === targetId ? null : row.id)
                        }}
                        className="table-generic-xs"
                      />
                    </div>
                    <div className="pt-5 pl-5 border-t">
                      <Pagination
                        page={paginationRight.page}
                        limit={paginationRight.limit}
                        pageCount={zarplataSpravochnikRightQuery?.data?.meta?.pageCount ?? 0}
                        count={zarplataSpravochnikRightQuery?.data?.meta?.count ?? 0}
                        onChange={({ page, limit }) => {
                          if (page) {
                            setPaginationRight((prev) => ({ ...prev, page }))
                          }
                          if (limit) {
                            setPaginationRight((prev) => ({ ...prev, limit }))
                          }
                        }}
                        className="[&_*]:!text-xs gap-x-5"
                        paginateProps={{
                          className: 'gap-1'
                        }}
                      />
                    </div>
                  </div>
                </Allotment.Pane>
              </Allotment>
            </div>
            <DialogFooter>
              <Button onPress={handleReplace}>{t('save')}</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
