import type { RaschetSchet } from '@/common/models'

import { useEffect, useState } from 'react'

import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { useLocationState, usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { ChooseSpravochnik, GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { SearchField, useSearch } from '@/common/features/search'
import { useToggle } from '@/common/hooks/use-toggle'

import { createOrganizationSpravochnik } from '../organization'
import { raschetSchetColumns } from './columns'
import { raschetSchetQueryKeys } from './constants'
import { RaschetSchetDialog } from './dialog'
import { raschetSchetService } from './service'

const RaschetSchetPage = () => {
  const [selected, setSelected] = useState<RaschetSchet | null>(null)
  const [orgId, setOrgId] = useLocationState<number | undefined>('org_id', undefined)

  const toggle = useToggle()
  const location = useLocation()
  const navigate = useNavigate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

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

  const { data: raschetSchets, isFetching } = useQuery({
    queryKey: [
      raschetSchetQueryKeys.getAll,
      {
        ...pagination,
        organ_id: orgId,
        search
      }
    ],
    queryFn: raschetSchetService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: raschetSchetService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [raschetSchetQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])

  useEffect(() => {
    setLayout({
      title: t('raschet-schet'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchField,
      onBack: location.state ? () => navigate(-1) : undefined,
      onCreate: orgId ? toggle.open : undefined
    })
  }, [setLayout, t, toggle.open, orgId, navigate, location.state])

  useEffect(() => {
    if (location.state?.org_id) {
      setOrgId(location.state.org_id)
    }
  }, [location.state, setOrgId])

  const handleClickEdit = (row: RaschetSchet) => {
    setSelected(row)
    setOrgId(row.account_number.spravochnik_organization_id)
    toggle.open()
  }
  const handleClickDelete = (row: RaschetSchet) => {
    confirm({
      onConfirm() {
        deleteMutation(row?.account_number?.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Header>
        <ChooseSpravochnik
          spravochnik={orgSpravochnik}
          placeholder="Выберите организацию"
          getName={(selected) => selected.name}
          getElements={(selected) => [
            { name: 'ИНН:', value: selected?.inn },
            { name: 'МФО:', value: selected?.mfo },
            {
              name: 'Расчетный счет:',
              value: selected?.account_numbers?.map((schet) => schet.raschet_schet).join(',')
            },
            { name: 'Банк:', value: selected?.bank_klient }
          ]}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={raschetSchets?.data ?? []}
          columnDefs={raschetSchetColumns}
          getRowId={(row) => row.account_number?.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={raschetSchets?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <RaschetSchetDialog
        data={selected}
        open={toggle.isOpen && !!orgId}
        onChangeOpen={toggle.setOpen}
        orgId={orgId!}
      />
    </ListView>
  )
}

export default RaschetSchetPage
