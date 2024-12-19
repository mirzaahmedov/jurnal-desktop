import { SearchField, useSearch } from '@/common/features/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePagination, useToggle } from '@/common/hooks'

import { CreateOrganizationDialog } from './create-dialog'
import { ListView } from '@/common/views'
import { Organization } from '@/common/models'
import { OrganizationTable } from './table'
import { UpdateOrganizationDrawer } from './update-drawer'
import { organizationQueryKeys } from './config'
import { organizationService } from './service'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useParentId } from './hooks'

const OrganizationPage = () => {
  const [, setParentId] = useParentId()

  const { confirm } = useConfirm()
  const { search } = useSearch()

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const { data: orgList, isFetching } = useQuery({
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
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <OrganizationTable
          data={orgList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={orgList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
      <UpdateOrganizationDrawer />
      <CreateOrganizationDialog
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setIsOpen}
      />
    </ListView>
  )
}

export default OrganizationPage
