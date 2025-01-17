import { ChooseSpravochnik, GenericTable, Pagination } from '@/common/components'

import { ListView } from '@/common/views'
import type { ShartnomaGrafik } from '@/common/models'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { shartnomaGrafikColumns } from './columns'
import { shartnomaGrafikQueryKeys } from './constants'
import { shartnomaGrafikService } from './service'
import { useLayout } from '@/common/features/layout'
import { useNavigate } from 'react-router-dom'
import { useOrgId } from './hooks'
import { usePagination } from '@/common/hooks'
import { useQuery } from '@tanstack/react-query'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSpravochnik } from '@/common/features/spravochnik'

const ShartnomaGrafikPage = () => {
  const [orgId, setOrgId] = useOrgId()

  const budjet_id = useRequisitesStore((store) => store.budjet_id)
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
        budjet_id,
        organization: orgSpravochnik.selected?.id,
        ...pagination
      }
    ],
    queryFn: shartnomaGrafikService.getAll,
    enabled: !!budjet_id
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
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={shartnomaGrafikList?.data ?? []}
          columnDefs={shartnomaGrafikColumns}
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
