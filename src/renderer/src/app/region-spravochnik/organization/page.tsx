import { useEffect, useState } from 'react'

import { LoadingOverlay } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination, useToggle } from '@renderer/common/hooks'
import { Organization } from '@renderer/common/models'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus } from 'lucide-react'

import { CreateOrganizationDialog } from './components/create-dialog'
import { organizationQueryKeys } from './config'
import { useParentId } from './hooks'
import { organizationService } from './service'
import { OrganizationTable } from './table'
import { UpdateOrganizationDrawer } from './update-drawer'

const OrganizationPage = () => {
  const [, setParentId] = useParentId()
  const [original, setOriginal] = useState<Organization>()

  const { confirm } = useConfirm()
  const { search } = useSearch()

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const { data: organizations, isFetching } = useQuery({
    queryKey: [
      organizationQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: organizationService.getAll
  })
  const { mutate: deleteOrganization, isPending } = useMutation({
    mutationKey: [organizationQueryKeys.delete],
    mutationFn: organizationService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
    }
  })

  useLayout({
    title: 'Организации',
    content: SearchField,
    onCreate: () => {
      dialogToggle.open()
    }
  })

  const handleClickEdit = (row: Organization) => {
    setParentId(row.id)
  }
  const handleClickDelete = (row: Organization) => {
    confirm({
      onConfirm() {
        deleteOrganization(row.id)
      }
    })
  }

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setOriginal(undefined)
    }
  }, [dialogToggle.isOpen])

  return (
    <ListView className="relative">
      <div className="flex-1 overflow-auto scrollbar">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <OrganizationTable
          data={organizations?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          customActions={(row) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setOriginal(row)
                dialogToggle?.open()
              }}
            >
              <CopyPlus className="size-4" />
            </Button>
          )}
        />
      </div>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={organizations?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
      <UpdateOrganizationDrawer />
      <CreateOrganizationDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        state={{
          original
        }}
      />
    </ListView>
  )
}

export default OrganizationPage
