import type { Organization } from '@/common/models'
import type { DialogProps } from '@radix-ui/react-dialog'

import { useEffect, useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
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
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'

import { OrganizationColumns } from './columns'
import { OrganizationQueryKeys } from './config'
import { OrganizationService } from './service'

enum TabOption {
  SELECTED = 'SELECTED',
  ALL = 'ALL'
}

interface SubordinateOrganizationsProps extends DialogProps {
  parentId?: number
}
export const SubordinateOrganizations = ({
  parentId,
  open,
  onOpenChange
}: SubordinateOrganizationsProps) => {
  const queryClient = useQueryClient()

  const [tabValue, setTabValue] = useState(TabOption.SELECTED)
  const [selected, setSelected] = useState<Organization[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const { t } = useTranslation()

  const { data: organization, isFetching } = useQuery({
    queryKey: [OrganizationQueryKeys.getById, parentId],
    queryFn: OrganizationService.getById,
    enabled: !!parentId && open
  })
  const { data: organizations, isFetching: isFetchingOrganizations } = useQuery({
    queryKey: [
      OrganizationQueryKeys.getAll,
      {
        page,
        limit,
        parent: false,
        parent_id: parentId,
        search: search ? search : undefined
      }
    ],
    queryFn: OrganizationService.getAll
  })

  const { mutate: updateChildOrganizations, isPending } = useMutation({
    mutationKey: [OrganizationQueryKeys.update],
    mutationFn: OrganizationService.updateChild,
    onSuccess(res) {
      onOpenChange?.(false)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganizationQueryKeys.getById, parentId]
      })
    }
  })

  useEffect(() => {
    if (!organization?.data?.childs) {
      return
    }
    setSelected(organization.data.childs)
  }, [organization])
  useEffect(() => {
    if (!open) {
      setPage(1)
      setTabValue(TabOption.SELECTED)
    }
  }, [open])

  const selectedIds = useMemo(() => selected.map((o) => o.id), [selected])

  return (
    <DialogTrigger
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="max-w-screen-2xl w-full p-0 h-3/5 overflow-hidden">
          <div className="w-full h-full min-h-0 gap-0 flex flex-col overflow-hidden">
            <div className="flex-1 w-full h-full min-h-0">
              <Tabs
                value={tabValue}
                onValueChange={(value) => setTabValue(value as TabOption)}
                className="flex flex-col w-full h-full"
              >
                <DialogHeader className="flex-0 px-5 py-1 flex gap-10 items-center flex-row">
                  <DialogTitle>{t('subordinate_organizations')}</DialogTitle>
                  <TabsList>
                    <TabsTrigger
                      value={TabOption.SELECTED}
                      className="flex items-center gap-5"
                    >
                      {t('selected_organizations')}
                      {selected.length ? <Badge className="-m-2">{selected.length}</Badge> : null}
                    </TabsTrigger>
                    <TabsTrigger value={TabOption.ALL}>{t('add')}</TabsTrigger>
                  </TabsList>

                  {tabValue === TabOption.ALL ? (
                    <SearchInputDebounced
                      value={search}
                      onValueChange={setSearch}
                    />
                  ) : null}
                </DialogHeader>
                <TabsContent
                  value={TabOption.SELECTED}
                  className="data-[state=active]:flex-1 flex flex-col overflow-hidden relative"
                >
                  {isFetching || isFetchingOrganizations ? <LoadingOverlay /> : null}
                  <div className="flex-1 overflow-auto scrollbar">
                    <GenericTable
                      columnDefs={OrganizationColumns}
                      data={selected ?? []}
                      onDelete={(organization) => {
                        setSelected((prev) => {
                          if (prev.find((o) => o.id === organization.id)) {
                            return prev.filter((o) => o.id !== organization.id)
                          }
                          return prev
                        })
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent
                  value={TabOption.ALL}
                  className="data-[state=active]:flex-1 data-[state=active]:flex flex-col overflow-hidden relative"
                >
                  {isFetching || isFetchingOrganizations ? <LoadingOverlay /> : null}
                  <div className="flex-1 overflow-auto scrollbar">
                    <GenericTable
                      selectedIds={selectedIds}
                      columnDefs={OrganizationColumns}
                      data={organizations?.data ?? []}
                      onClickRow={(organization) => {
                        setSelected((prev) => {
                          if (prev.find((o) => o.id === organization.id)) {
                            return prev.filter((o) => o.id !== organization.id)
                          }
                          return [...prev, organization]
                        })
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="p-0 m-0">
              <div className="w-full p-5 flex items-center">
                {tabValue === TabOption.ALL ? (
                  <Pagination
                    page={page}
                    limit={limit}
                    onChange={({ page, limit }) => {
                      if (page) {
                        setPage(page)
                      }
                      if (limit) {
                        setLimit(limit)
                      }
                    }}
                    count={organizations?.meta?.count ?? 0}
                    pageCount={organizations?.meta?.pageCount ?? 0}
                  />
                ) : null}
                <Button
                  disabled={!parentId}
                  isPending={isPending}
                  onClick={() => {
                    if (!parentId) {
                      return
                    }
                    updateChildOrganizations({
                      parentId,
                      childs: selectedIds.map((id) => ({
                        id
                      }))
                    })
                  }}
                  className="ml-auto"
                >
                  {t('save')}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
