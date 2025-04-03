import type { LocationState } from './config'
import type { Shartnoma } from '@renderer/common/models'

import { useEffect } from 'react'

import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { ChooseSpravochnik, GenericTable, useTableSort } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import { useConfirm } from '@renderer/common/features/confirm'
import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSpravochnik } from '@renderer/common/features/spravochnik'
import { usePagination } from '@renderer/common/hooks'
import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { shartnomaColumns } from './columns'
import { shartnomaQueryKeys } from './config'
import { shartnomaService } from './service'

const ShartnomaPage = () => {
  const [organId, setOrganId] = useLocationState<undefined | number>('org_id')

  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { t } = useTranslation(['app'])

  const [search] = useSearchFilter()

  const navigate = useNavigate()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

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

  const { data: shartnomaList, isFetching } = useQuery({
    queryKey: [
      shartnomaQueryKeys.getAll,
      {
        search,
        budjet_id,
        organ_id: organId,
        ...sorting,
        ...pagination
      }
    ],
    queryFn: shartnomaService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [shartnomaQueryKeys.delete],
    mutationFn: shartnomaService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [shartnomaQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: Shartnoma) => {
    navigate(`${row.id}`, {
      state: {
        orgId: row.spravochnik_organization_id
      } satisfies LocationState
    })
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
      content: SearchFilterDebounced,
      onCreate: organId
        ? () => {
            navigate('create', {
              state: {
                orgId: organId
              } satisfies LocationState
            })
          }
        : undefined,
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
            placeholder={t('choose', { what: t('organization') })}
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
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={shartnomaList?.data ?? []}
          columnDefs={shartnomaColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          placeholder={!organSpravochnik.selected ? 'Выберите организацию' : undefined}
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
                    orgId: row.spravochnik_organization_id
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
          pageCount={shartnomaList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default ShartnomaPage
