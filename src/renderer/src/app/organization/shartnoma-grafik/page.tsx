import { ChooseOrganization, GenericTable, Pagination } from '@/common/components'

import { ListView } from '@/common/views'
import type { ShartnomaGrafik } from '@/common/models'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { shartnomaGrafikColumns } from './columns'
import { shartnomaGrafikQueryKeys } from './constants'
import { shartnomaGrafikService } from './service'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { useNavigate } from 'react-router-dom'
import { useOrgId } from './hooks'
import { usePagination } from '@/common/hooks'
import { useQuery } from '@tanstack/react-query'
import { useSpravochnik } from '@/common/features/spravochnik'

const ShartnomaGrafikPage = () => {
  const [orgId, setOrgId] = useOrgId()

  const { main_schet } = useMainSchet()

  const navigate = useNavigate()
  const pagination = usePagination()

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: orgId,
      onChange: (id) => setOrgId(id)
    })
  )

  const { data: shartnomaGrafikList, isFetching } = useQuery({
    queryKey: [
      shartnomaGrafikQueryKeys.getAll,
      {
        budjet_id: main_schet?.budget_id,
        organization: orgSpravochnik.selected?.id,
        ...pagination
      }
    ],
    queryFn: shartnomaGrafikService.getAll
  })

  const handleClickEdit = (row: ShartnomaGrafik) => {
    navigate(`${row.id}?org_id=${row.spravochnik_organization_id}`)
  }

  useLayout({
    title: 'График договорах'
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
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={shartnomaGrafikList?.data ?? []}
          columns={shartnomaGrafikColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          placeholder={!orgSpravochnik.selected ? 'Выберите организацию' : undefined}
        />
      </ListView.Content>
      <ListView.Footer>
        <Pagination pageCount={shartnomaGrafikList?.meta?.pageCount ?? 0} />
      </ListView.Footer>
    </ListView>
  )
}

export default ShartnomaGrafikPage
