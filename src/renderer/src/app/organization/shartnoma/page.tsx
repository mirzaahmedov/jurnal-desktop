import type { Shartnoma } from '@renderer/common/models'

import { useEffect } from 'react'

import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { ChooseSpravochnik, GenericTable } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSearch } from '@renderer/common/features/search'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { shartnomaColumns } from './columns'
import { shartnomaQueryKeys } from './constants'
import { useOrgId } from './hooks'
import { shartnomaService } from './service'

const ShartnomaPage = () => {
  const [orgId, setOrgId] = useOrgId()

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: orgId,
      onChange: (id) => {
        setOrgId(id)
        pagination.onChange({
          page: 1
        })
      }
    })
  )

  const { data: shartnomaList, isFetching } = useQuery({
    queryKey: [
      shartnomaQueryKeys.getAll,
      {
        search,
        budjet_id,
        organization: orgId ? Number(orgId) : undefined,
        ...pagination
      }
    ],
    queryFn: shartnomaService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [shartnomaQueryKeys.delete],
    mutationFn: shartnomaService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: Shartnoma) => {
    navigate(`${row.id}?org_id=${row.spravochnik_organization_id}&org_selected=${!!orgId}`)
  }
  const handleClickDelete = (row: Shartnoma) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.shartnoma'),
      onCreate: orgId
        ? () => {
            navigate(`create?org_id=${orgId}&org_selected=true`)
          }
        : undefined,
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ]
    })
  }, [setLayout, navigate, t, orgId])

  return (
    <ListView>
      <ListView.Header>
        <div className="flex items-center">
          <ChooseSpravochnik
            spravochnik={orgSpravochnik}
            placeholder="Выберите организацию"
            getName={(selected) => selected.name}
            getElements={(selected) => [
              { name: 'ИНН:', value: selected?.inn },
              { name: 'МФО:', value: selected?.mfo },
              { name: 'Расчетный счет:', value: selected?.raschet_schet },
              { name: 'Банк:', value: selected?.bank_klient }
            ]}
          />
        </div>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={shartnomaList?.data ?? []}
          columnDefs={shartnomaColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          placeholder={!orgSpravochnik.selected ? 'Выберите организацию' : undefined}
          customActions={(row) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`create?org_id=${row.spravochnik_organization_id}`, {
                  state: {
                    original: row
                  }
                })
              }}
            >
              <CopyPlus className="size-4" />
            </Button>
          )}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={shartnomaList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default ShartnomaPage
