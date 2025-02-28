import type { Organization } from '@renderer/common/models'

import { useEffect, useState } from 'react'

import { Button } from '@renderer/common/components/ui/button'
import { ButtonGroup } from '@renderer/common/components/ui/button-group'
import { useConfirm } from '@renderer/common/features/confirm'
import { DownloadFile, ImportFile } from '@renderer/common/features/file'
import { useLayoutStore } from '@renderer/common/features/layout'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination, useToggle } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus, LayoutList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { CreateOrganizationDialog } from './components/create-dialog'
import { organizationQueryKeys } from './config'
import { organizationService } from './service'
import { SubordinateOrganizations } from './subordinate-organization'
import { OrganizationTable } from './table'
import { UpdateOrganizationDrawer } from './update-drawer'

const OrganizationPage = () => {
  const [original, setOriginal] = useState<Organization>()

  const [parentId, setParentId] = useState<number>()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

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
      toast.success(t('delete-success'))
      queryClient.invalidateQueries({
        queryKey: [organizationQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.organization'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchField,
      onCreate: () => {
        dialogToggle.open()
      }
    })
  }, [setLayout, t, dialogToggle.open])

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
      <ListView.Header className="flex justify-end">
        <ButtonGroup className="flex items-center gap-2.5">
          <DownloadFile
            fileName={`${t('organization')}-${t('import')}-${t('template')}.xlsx`}
            url="/spravochnik/organization/template"
            buttonText={t('download-something', { something: t('template') })}
            params={{
              excel: true
            }}
          />
          <ImportFile url="/spravochnik/organization/import" />
        </ButtonGroup>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <OrganizationTable
          data={organizations?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          customActions={(row) => (
            <>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  setParentId(row.id)
                }}
              >
                <LayoutList className="size-4" />
              </Button>
            </>
          )}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={organizations?.meta?.pageCount ?? 0}
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
      <SubordinateOrganizations
        parentId={parentId}
        open={!!parentId}
        onOpenChange={(open) => {
          if (!open) {
            setParentId(undefined)
          }
        }}
      />
    </ListView>
  )
}

export default OrganizationPage
