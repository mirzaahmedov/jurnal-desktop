import { ChooseSpravochnik, GenericTable } from '@renderer/common/components'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@renderer/common/components/ui/button'
import { CopyPlus } from 'lucide-react'
import { ListView } from '@renderer/common/views'
import type { Shartnoma } from '@renderer/common/models'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { shartnomaColumns } from './columns'
import { shartnomaQueryKeys } from './constants'
import { shartnomaService } from './service'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useOrgId } from './hooks'
import { usePagination } from '@renderer/common/hooks'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSpravochnik } from '@renderer/common/features/spravochnik'

const ShartnomaPage = () => {
  const [orgId, setOrgId] = useOrgId()

  const { confirm } = useConfirm()
  const { search } = useSearch()

  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

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
    navigate(`${row.id}?org_id=${row.spravochnik_organization_id}`)
  }
  const handleClickDelete = (row: Shartnoma) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  useLayout({
    title: 'Договоры',
    content: SearchField,
    onCreate: orgSpravochnik.selected?.id
      ? () => {
          navigate(`create?org_id=${orgSpravochnik.selected?.id}`)
        }
      : undefined
  })

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
