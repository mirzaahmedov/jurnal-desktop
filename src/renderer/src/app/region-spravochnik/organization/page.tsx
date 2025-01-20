import { SearchField, useSearch } from '@renderer/common/features/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePagination, useToggle } from '@renderer/common/hooks'

import { CreateOrganizationDialog } from './create-dialog'
import { ListView } from '@renderer/common/views'
import { LoadingOverlay } from '@renderer/common/components'
import { Organization } from '@renderer/common/models'
import { OrganizationTable } from './table'
import { UpdateOrganizationDrawer } from './update-drawer'
import { organizationQueryKeys } from './config'
import { organizationService } from './service'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useParentId } from './hooks'

const OrganizationPage = () => {
  const [, setParentId] = useParentId()

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

  return (
    <ListView className="relative">
      <div className="flex-1 overflow-auto scrollbar">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <OrganizationTable
          data={organizations?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
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
      />
    </ListView>
  )
}

export default OrganizationPage
