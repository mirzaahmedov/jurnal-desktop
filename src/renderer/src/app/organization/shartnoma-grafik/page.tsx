import type { ShartnomaGrafik } from '@/common/models'

import { useEffect } from 'react'

import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ChooseSpravochnik, GenericTable } from '@/common/components'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { usePagination } from '@/common/hooks'
import { ListView } from '@/common/views'

import { shartnomaGrafikColumns } from './columns'
import { shartnomaGrafikQueryKeys } from './constants'
import { useOrgId } from './hooks'
import { shartnomaGrafikService } from './service'

const ShartnomaGrafikPage = () => {
  const [orgId, setOrgId] = useOrgId()

  const navigate = useNavigate()
  const pagination = usePagination()

  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])

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
    navigate(`${row.id}?org_id=${row.spravochnik_organization_id}&org_selected=${!!orgId}`)
  }

  useEffect(() => {
    setLayout({
      title: t('pages.shartnoma-grafik'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ]
    })
  }, [setLayout, navigate, t])

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
        <ListView.Pagination
          {...pagination}
          pageCount={shartnomaGrafikList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default ShartnomaGrafikPage
