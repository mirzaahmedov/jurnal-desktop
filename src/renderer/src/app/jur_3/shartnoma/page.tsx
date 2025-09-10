import type { LocationState } from './config'
import type { Shartnoma } from '@/common/models'
import type { DialogTriggerProps } from 'react-aria-components'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CopyPlus, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import {
  ChooseSpravochnik,
  FooterCell,
  FooterRow,
  GenericTable,
  useTableSort
} from '@/common/components'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useDates, usePagination } from '@/common/hooks'
import { useLocationState } from '@/common/hooks/use-location-state'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { ShartnomaColumns } from './columns'
import { ShartnomaQueryKeys } from './config'
import { ContractService } from './service'
import { ShartnomaBySmetaDialog } from './shartnoma-by-smeta-dialog'

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
        <div className="w-full flex items-center justify-between">
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
          <div className="ml-auto flex items-center gap-5">
            <ShartnomaBySmetaDialog />

            {main_schet_id ? <ByContractDialog main_schet_id={main_schet_id} /> : null}

            <DownloadFile
              url="/shartnoma"
              params={{
                page: pagination.page,
                limit: pagination.limit,
                budjet_id,
                main_schet_id,
                excel: true
              }}
              buttonText={t('export-excel')}
              fileName={`${t('contract')}_${t('report')}_${pagination.page}-${pagination.limit}.xlsx`}
            />
          </div>
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
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total_page')}
                  colSpan={6}
                />
                <FooterCell
                  content={formatNumber(contracts?.meta?.page_summa ?? 0)}
                  colSpan={1}
                />
              </FooterRow>
              {(contracts?.meta?.pageCount ?? 0) > 1 ? (
                <>
                  <FooterRow>
                    <FooterCell
                      title={t('total_period')}
                      colSpan={6}
                    />
                    <FooterCell
                      content={formatNumber(contracts?.meta?.summa ?? 0)}
                      colSpan={1}
                    />
                  </FooterRow>
                </>
              ) : null}
            </>
          }
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

export interface ByContractDialogProps extends Omit<DialogTriggerProps, 'children'> {
  main_schet_id: number
  defaultFrom?: string
  defaultTo?: string
}
export const ByContractDialog = ({
  isOpen,
  onOpenChange,
  main_schet_id,
  defaultFrom,
  defaultTo
}: ByContractDialogProps) => {
  const defaultDates = useDates()

  const { t } = useTranslation(['app'])

  const [dates, setDates] = useState({
    from: defaultFrom || defaultDates.from,
    to: defaultTo || defaultDates.to
  })

  useEffect(() => {
    if (isOpen) {
      setDates({
        from: defaultFrom || defaultDates.from,
        to: defaultTo || defaultDates.to
      })
    }
  }, [isOpen, defaultFrom, defaultTo])

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Button variant="ghost">
        <Download className="btn-icon icon-start" /> {t('by_contract')}
      </Button>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('by_contract')}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-5 pb-5">
            <JollyDatePicker
              value={dates.from}
              onChange={(value) => {
                setDates((prev) => ({
                  ...prev,
                  from: value
                }))
              }}
            />
            -
            <JollyDatePicker
              value={dates.to}
              onChange={(value) => {
                setDates((prev) => ({
                  ...prev,
                  to: value
                }))
              }}
            />
          </div>
          <DialogFooter>
            <DownloadFile
              fileName={`${t('pages.bank')}-${t('by_contract')}_${dates.from}&${dates.to}.xlsx`}
              url="/bank/monitoring/by-contract"
              buttonText={t('by_contract')}
              params={{
                main_schet_id,
                from: dates.from,
                to: dates.to,
                excel: true
              }}
            />
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
