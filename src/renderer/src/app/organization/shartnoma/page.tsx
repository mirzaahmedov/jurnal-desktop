import { ChooseOrganization, GenericTable } from '@/common/components'
import { SearchField, useSearch } from '@/common/features/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ListView } from '@/common/views'
import type { Shartnoma } from '@/common/models'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { shartnomaColumns } from './columns'
import { shartnomaQueryKeys } from './constants'
import { shartnomaService } from './service'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { useNavigate } from 'react-router-dom'
import { useOrgId } from './hooks'
import { usePagination } from '@/common/hooks'
import { useSpravochnik } from '@/common/features/spravochnik'

const ShartnomaPage = () => {
  const [orgId, setOrgId] = useOrgId()

  const { main_schet } = useMainSchet()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: orgId,
      onChange: (id) => setOrgId(id)
    })
  )

  const { data: shartnomaList, isFetching } = useQuery({
    queryKey: [
      shartnomaQueryKeys.getAll,
      {
        search,
        budjet_id: main_schet?.budget_id,
        organization: orgSpravochnik.selected?.id,
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
          <ChooseOrganization
            selected={orgSpravochnik.selected}
            open={orgSpravochnik.open}
            clear={orgSpravochnik.clear}
          />
        </div>
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={shartnomaList?.data ?? []}
          columns={shartnomaColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          placeholder={!orgSpravochnik.selected ? 'Выберите организацию' : undefined}
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
