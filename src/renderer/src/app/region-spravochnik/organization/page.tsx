import type { OrganizationFormValues } from './config'
import type { Organization } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus, ListTree } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button } from '@/common/components/ui/button'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile, ImportFile } from '@/common/features/file'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { OrganizationQueryKeys, defaultValues } from './config'
import { OrganizationDialog } from './dialog'
import { OrganizationService } from './service'
import { SubordinateOrganizations } from './subordinate-organization'
import { OrganizationTable } from './table'

const OrganizationPage = () => {
  const [selected, setSelected] = useState<Organization>()
  const [original, setOriginal] = useState<OrganizationFormValues>()
  const [parentId, setParentId] = useState<number>()

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayout()

  const { data: organizations, isFetching } = useQuery({
    queryKey: [
      OrganizationQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: OrganizationService.getAll
  })
  const { mutate: deleteOrganization, isPending } = useMutation({
    mutationKey: [OrganizationQueryKeys.delete],
    mutationFn: OrganizationService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganizationQueryKeys.getAll]
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
      content: SearchFilterDebounced,
      onCreate: () => {
        dialogToggle.open()
      }
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: Organization) => {
    dialogToggle.open()
    setSelected(row)
  }
  const handleClickDelete = (row: Organization) => {
    confirm({
      onConfirm() {
        deleteOrganization(row.id)
      }
    })
  }
  const handleClickDuplicate = (row: Organization) => {
    setOriginal({
      name: row.name,
      bank_klient: row.bank_klient,
      inn: row.inn,
      mfo: row.mfo,
      okonx: row.mfo,
      account_numbers: defaultValues.account_numbers,
      gaznas: defaultValues.gaznas
    })
    dialogToggle?.open()
  }
  const handleClickChildren = (row: Organization) => {
    setParentId(row.id)
  }

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(undefined)
      setOriginal(undefined)
    }
  }, [dialogToggle.isOpen])

  return (
    <ListView>
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
          <DownloadFile
            variant="ghost"
            params={{}}
            url="/spravochnik/organization/export"
            fileName={`${t('organization')}.xlsx`}
            buttonText={t('export-excel')}
          />
          <ImportFile url="/spravochnik/organization/import" />
        </ButtonGroup>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <OrganizationTable
          data={organizations?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          actions={(row) => (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClickDuplicate(row)
                }}
              >
                <CopyPlus className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClickChildren(row)
                }}
              >
                <ListTree className="size-4" />
              </Button>
            </>
          )}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={organizations?.meta?.count ?? 0}
          pageCount={organizations?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <OrganizationDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
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
