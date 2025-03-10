import type { DialogProps } from '@radix-ui/react-dialog'
import type { Organization } from '@renderer/common/models'

import { useEffect, useMemo, useState } from 'react'

import { Pagination } from '@renderer/common/components/pagination'
import { SearchInputDebounced } from '@renderer/common/components/search-input-debounced'
import { Badge } from '@renderer/common/components/ui/badge'
import { Button } from '@renderer/common/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/common/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/common/components/ui/tabs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'

import { organizationColumns } from './columns'
import { organizationQueryKeys } from './config'
import { organizationService, updateChildOrganizationsQuery } from './service'

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
    queryKey: [organizationQueryKeys.getById, parentId],
    queryFn: organizationService.getById,
    enabled: !!parentId && open
  })
  const { data: organizations, isFetching: isFetchingOrganizations } = useQuery({
    queryKey: [
      organizationQueryKeys.getAll,
      {
        page,
        limit,
        parent: false,
        parent_id: parentId,
        search: search ? search : undefined
      }
    ],
    queryFn: organizationService.getAll
  })

  const { mutate: updateChildOrganizations, isPending } = useMutation({
    mutationKey: [organizationQueryKeys.update],
    mutationFn: updateChildOrganizationsQuery,
    onSuccess(res) {
      onOpenChange?.(false)
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getById, parentId]
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-screen-2xl w-full p-0 h-3/5 overflow-hidden gap-0 flex flex-col">
        <Tabs
          value={tabValue}
          onValueChange={(value) => setTabValue(value as TabOption)}
          className="flex flex-col h-full overflow-hidden"
        >
          <DialogHeader className="flex-0 px-5 py-1 flex gap-10 items-center flex-row">
            <DialogTitle>{t('subordinate_organizations')}</DialogTitle>
            <TabsList>
              <TabsTrigger
                value={TabOption.SELECTED}
                className="flex items-center gap-5"
              >
                {t('selected_organizations')}
                {selected.length ? <Badge>{selected.length}</Badge> : null}
              </TabsTrigger>
              <TabsTrigger value={TabOption.ALL}>{t('add')}</TabsTrigger>
            </TabsList>

            {tabValue === TabOption.ALL ? (
              <SearchInputDebounced
                value={search}
                onChangeValue={setSearch}
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
                columnDefs={organizationColumns}
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
                columnDefs={organizationColumns}
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
                pageCount={organizations?.meta?.pageCount ?? 0}
              />
            ) : null}
            <Button
              disabled={!parentId}
              loading={isPending}
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
      </DialogContent>
    </Dialog>
  )
}
