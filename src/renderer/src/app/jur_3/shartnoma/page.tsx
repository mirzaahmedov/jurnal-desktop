import type { LocationState } from './config'
import type { Shartnoma } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { ChooseSpravochnik, GenericTable, useTableSort } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSpravochnik } from '@/common/features/spravochnik'
import { usePagination } from '@/common/hooks'
import { useLocationState } from '@/common/hooks/use-location-state'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { ShartnomaColumns } from './columns'
import { ShartnomaQueryKeys } from './config'
import { ContractService } from './service'

const ShartnomaPage = () => {
  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { t } = useTranslation(['app'])

  const [search] = useSearchFilter()
  const [organId, setOrganId] = useLocationState<undefined | number>('org_id')

  const navigate = useNavigate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: organId,
      onChange: (id) => {
        setOrganId(id)
        pagination.onChange({
          page: 1
        })
      }
    })
  )

  const { data: contracts, isFetching } = useQuery({
    queryKey: [
      ShartnomaQueryKeys.getAll,
      {
        search,
        budjet_id,
        main_schet_id,
        organ_id: organId,
        ...sorting,
        ...pagination
      }
    ],
    queryFn: ContractService.getAll
  })
  const { mutate: deleteContract, isPending } = useMutation({
    mutationKey: [ShartnomaQueryKeys.delete],
    mutationFn: ContractService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [ShartnomaQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: Shartnoma) => {
    navigate(`${row.id}`, {
      state: {
        organId: row.spravochnik_organization_id
      } satisfies LocationState
    })
  }
  const handleClickDelete = (row: Shartnoma) => {
    confirm({
      onConfirm() {
        deleteContract(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.shartnoma'),
      content: SearchFilterDebounced,
      onCreate: () => {
        navigate('create', {
          state: {
            organId: organId
          } satisfies LocationState
        })
      },
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ]
    })
  }, [setLayout, navigate, t, organId])

  return (
    <ListView>
      <ListView.Header>
        <div className="flex items-center">
          <ChooseSpravochnik
            spravochnik={organSpravochnik}
            placeholder={t('organization')}
            getName={(selected) => selected.name}
            getElements={(selected) => [
              { name: t('inn'), value: selected?.inn },
              { name: t('mfo'), value: selected?.mfo },
              {
                name: t('raschet-schet'),
                value: selected?.account_numbers.map((schet) => schet.raschet_schet).join(',')
              },
              { name: t('bank'), value: selected?.bank_klient }
            ]}
          />
        </div>
      </ListView.Header>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={contracts?.data ?? []}
          columnDefs={ShartnomaColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          placeholder={!organSpravochnik.selected ? t('organization') : undefined}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          actions={(row) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                navigate('create', {
                  state: {
                    original: row,
                    organId: row.spravochnik_organization_id
                  } satisfies LocationState
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
          count={contracts?.meta?.count ?? 0}
          pageCount={contracts?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default ShartnomaPage
