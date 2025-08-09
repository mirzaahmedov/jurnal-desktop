import type { AdminKassaDocument } from '../jur_1/interfaces'
import type { AdminBankDocument } from '../jur_2/interfaces'
import type { AdminOrgan152Document } from '../jur_3/152/interfaces'
import type { AdminOrgan159Document } from '../jur_3/159/interfaces'
import type { AdminPodotchetDocument } from '../jur_4/interfaces'
import type { AdminMaterialDocument } from '../jur_7/interfaces'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useState } from 'react'

import 'paginate-array'
import { Trans, useTranslation } from 'react-i18next'

import { type ColumnDef, Copyable, GenericTable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Pagination } from '@/common/components/pagination'
import { ProvodkaBadge } from '@/common/components/provodka-badge'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { UserCell } from '@/common/components/table/renderers/user'
import { Badge } from '@/common/components/ui/badge'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

export enum AdminDocumentsType {
  Kassa = 'kassa',
  Bank = 'bank',
  Organ152 = 'organ_152',
  Organ159 = 'organ_159',
  Podotchet = 'podotchet',
  Material = 'material'
}

interface ViewDocumentsModalProps extends Omit<DialogTriggerProps, 'children'> {
  type: AdminDocumentsType
  docs: (
    | AdminKassaDocument
    | AdminBankDocument
    | AdminOrgan152Document
    | AdminOrgan159Document
    | AdminPodotchetDocument
    | AdminMaterialDocument
  )[]
}
export const ViewDocumentsModal: FC<ViewDocumentsModalProps> = ({ type, docs, ...props }) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { t } = useTranslation()
  const { currentData, totalPages, totalCount } = usePagination(docs ?? [], page, limit)

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent className="w-full max-w-full h-full max-h-[800px] overflow-hidden">
          <div className="h-full overflow-hidden flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>{t('documents')}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto scrollbar">
              <GenericTable
                data={currentData}
                getRowKey={(row) =>
                  type === AdminDocumentsType.Material
                    ? `${row.type} ${row.product_id}`
                    : `${row.type} ${row.id}`
                }
                columnDefs={
                  type === AdminDocumentsType.Kassa
                    ? CommonDocumentColumnDefs<AdminKassaDocument>([
                        {
                          width: 250,
                          minWidth: 250,
                          key: 'spravochnik_podotchet_litso_name',
                          header: 'podotchet-litso'
                        },
                        {
                          width: 250,
                          minWidth: 250,
                          key: 'organization_name',
                          header: 'organization'
                        },
                        {
                          width: 200,
                          minWidth: 200,
                          key: 'prixod_sum',
                          header: 'prixod',
                          renderCell: (row) => <SummaCell summa={row.prixod_sum} />
                        },
                        {
                          width: 200,
                          minWidth: 200,
                          key: 'rasxod_sum',
                          header: 'rasxod',
                          renderCell: (row) => <SummaCell summa={row.rasxod_sum} />
                        },
                        {
                          minWidth: 200,
                          key: 'provodka',
                          renderCell: (row) => <ProvodkaCell provodki={row.provodki_array} />
                        }
                      ])
                    : type === AdminDocumentsType.Bank
                      ? CommonDocumentColumnDefs<AdminBankDocument>([
                          {
                            key: 'id_spravochnik_organization',
                            header: 'organization',
                            width: 300,
                            minWidth: 300,
                            renderCell: (row) => (
                              <HoverInfoCell
                                title={row.spravochnik_organization_name}
                                secondaryText={
                                  <Copyable value={row.spravochnik_organization_inn}>
                                    #{row.spravochnik_organization_inn}
                                  </Copyable>
                                }
                                tooltipContent={
                                  <DataList
                                    items={[
                                      {
                                        name: <Trans>id</Trans>,
                                        value: (
                                          <Copyable
                                            side="start"
                                            value={row.id_spravochnik_organization}
                                          >
                                            #{row.id_spravochnik_organization}
                                          </Copyable>
                                        )
                                      },
                                      {
                                        name: <Trans>name</Trans>,
                                        value: row.spravochnik_organization_name
                                      },
                                      {
                                        name: <Trans>inn</Trans>,
                                        value: row.spravochnik_organization_inn
                                      },
                                      {
                                        name: <Trans>raschet-schet</Trans>,
                                        value: row.spravochnik_organization_raschet_schet
                                      }
                                    ]}
                                  />
                                }
                              />
                            )
                          },
                          {
                            width: 200,
                            minWidth: 200,
                            key: 'prixod_sum',
                            header: 'prixod',
                            renderCell: (row) => <SummaCell summa={row.prixod_sum} />
                          },
                          {
                            width: 200,
                            minWidth: 200,
                            key: 'rasxod_sum',
                            header: 'rasxod',
                            renderCell: (row) => <SummaCell summa={row.rasxod_sum} />
                          },
                          {
                            minWidth: 200,
                            key: 'provodka',
                            renderCell: (row) => <ProvodkaCell provodki={row.provodki_array} />
                          }
                        ])
                      : type === AdminDocumentsType.Organ152
                        ? CommonDocumentColumnDefs<AdminOrgan152Document>([
                            {
                              key: 'organ_id',
                              header: 'organization',
                              width: 300,
                              minWidth: 300,
                              renderCell: (row) => (
                                <HoverInfoCell
                                  title={row.organ_name}
                                  secondaryText={
                                    <Copyable value={row.organ_inn}>#{row.organ_inn}</Copyable>
                                  }
                                  tooltipContent={
                                    <DataList
                                      items={[
                                        {
                                          name: <Trans>id</Trans>,
                                          value: (
                                            <Copyable
                                              side="start"
                                              value={row.organ_id}
                                            >
                                              #{row.organ_id}
                                            </Copyable>
                                          )
                                        },
                                        {
                                          name: <Trans>name</Trans>,
                                          value: row.organ_name
                                        },
                                        {
                                          name: <Trans>inn</Trans>,
                                          value: row.organ_inn
                                        }
                                      ]}
                                    />
                                  }
                                />
                              )
                            },
                            {
                              key: 'type',
                              renderCell: (row) => <ProvodkaBadge type={row.type} />
                            },
                            {
                              width: 200,
                              minWidth: 200,
                              key: 'summa_prixod',
                              header: 'prixod',
                              renderCell: (row) => <SummaCell summa={row.summa_prixod} />
                            },
                            {
                              width: 200,
                              minWidth: 200,
                              key: 'summa_rasxod',
                              header: 'rasxod',
                              renderCell: (row) => <SummaCell summa={row.summa_rasxod} />
                            },
                            {
                              minWidth: 200,
                              key: 'provodka',
                              renderCell: (row) => (
                                <ProvodkaCell
                                  provodki={[
                                    {
                                      provodki_schet: row.provodki_schet,
                                      provodki_sub_schet: row.provodki_sub_schet
                                    }
                                  ]}
                                />
                              )
                            }
                          ])
                        : type === AdminDocumentsType.Organ159
                          ? CommonDocumentColumnDefs<AdminOrgan159Document>([
                              {
                                key: 'organ_id',
                                header: 'organization',
                                width: 300,
                                minWidth: 300,
                                renderCell: (row) => (
                                  <HoverInfoCell
                                    title={row.organ_name}
                                    secondaryText={
                                      <Copyable value={row.organ_inn}>#{row.organ_inn}</Copyable>
                                    }
                                    tooltipContent={
                                      <DataList
                                        items={[
                                          {
                                            name: <Trans>id</Trans>,
                                            value: (
                                              <Copyable
                                                side="start"
                                                value={row.organ_id}
                                              >
                                                #{row.organ_id}
                                              </Copyable>
                                            )
                                          },
                                          {
                                            name: <Trans>name</Trans>,
                                            value: row.organ_name
                                          },
                                          {
                                            name: <Trans>inn</Trans>,
                                            value: row.organ_inn
                                          }
                                        ]}
                                      />
                                    }
                                  />
                                )
                              },
                              {
                                key: 'type',
                                renderCell: (row) => <ProvodkaBadge type={row.type} />
                              },
                              {
                                width: 200,
                                minWidth: 200,
                                key: 'summa_prixod',
                                header: 'prixod',
                                renderCell: (row) => <SummaCell summa={row.summa_prixod} />
                              },
                              {
                                width: 200,
                                minWidth: 200,
                                key: 'summa_rasxod',
                                header: 'rasxod',
                                renderCell: (row) => <SummaCell summa={row.summa_rasxod} />
                              },
                              {
                                minWidth: 200,
                                key: 'provodka',
                                renderCell: (row) => (
                                  <ProvodkaCell
                                    provodki={[
                                      {
                                        provodki_schet: row.provodki_schet,
                                        provodki_sub_schet: row.provodki_sub_schet
                                      }
                                    ]}
                                  />
                                )
                              }
                            ])
                          : type === AdminDocumentsType.Podotchet
                            ? CommonDocumentColumnDefs<AdminPodotchetDocument>([
                                {
                                  key: 'type',
                                  renderCell: (row) => <ProvodkaBadge type={row.type} />
                                },
                                {
                                  key: 'podotchet_id',
                                  header: 'podotchet-litso',
                                  width: 300,
                                  minWidth: 300,
                                  renderCell: (row) => (
                                    <HoverInfoCell
                                      title={row.podotchet_name}
                                      secondaryText={row.podotchet_rayon}
                                      tooltipContent={
                                        <DataList
                                          items={[
                                            {
                                              name: <Trans>id</Trans>,
                                              value: (
                                                <Copyable
                                                  side="start"
                                                  value={row.podotchet_id}
                                                >
                                                  #{row.podotchet_id}
                                                </Copyable>
                                              )
                                            },
                                            {
                                              name: <Trans>name</Trans>,
                                              value: row.podotchet_name
                                            },
                                            {
                                              name: <Trans>rayon</Trans>,
                                              value: row.podotchet_rayon
                                            }
                                          ]}
                                        />
                                      }
                                    />
                                  )
                                },
                                {
                                  width: 200,
                                  minWidth: 200,
                                  key: 'prixod_sum',
                                  header: 'prixod',
                                  renderCell: (row) => <SummaCell summa={row.prixod_sum} />
                                },
                                {
                                  width: 200,
                                  minWidth: 200,
                                  key: 'rasxod_sum',
                                  header: 'rasxod',
                                  renderCell: (row) => <SummaCell summa={row.rasxod_sum} />
                                },
                                {
                                  minWidth: 200,
                                  key: 'provodka',
                                  renderCell: (row) => (
                                    <ProvodkaCell
                                      provodki={[
                                        {
                                          provodki_schet: row.provodki_schet,
                                          provodki_sub_schet: row.provodki_sub_schet
                                        }
                                      ]}
                                    />
                                  )
                                }
                              ])
                            : ([
                                {
                                  key: 'debet_schet',
                                  header: `${t('debet')} ${t('schet')}`
                                },
                                {
                                  key: 'debet_sub_schet',
                                  header: `${t('debet')} ${t('subschet')}`
                                },
                                {
                                  key: 'kredit_schet',
                                  header: `${t('kredit')} ${t('schet')}`
                                },
                                {
                                  key: 'kredit_sub_schet',
                                  header: `${t('kredit')} ${t('subschet')}`
                                },
                                {
                                  key: 'type',
                                  renderCell: (row) => (
                                    <Badge
                                      className={cn(
                                        row.type === 'prixod' && 'bg-emerald-500',
                                        row.type === 'rasxod' && 'bg-red-500'
                                      )}
                                    >
                                      {row.type === 'prixod' ? (
                                        <Trans>prixod</Trans>
                                      ) : row.type === 'rasxod' ? (
                                        <Trans>rasxod</Trans>
                                      ) : (
                                        <Trans>internal</Trans>
                                      )}
                                    </Badge>
                                  )
                                },
                                {
                                  key: 'kol',
                                  numeric: true,
                                  renderCell: (row) => formatNumber(row.summa)
                                },
                                {
                                  key: 'summa',
                                  numeric: true,
                                  renderCell: (row) => <SummaCell summa={row.summa} />
                                },
                                {
                                  key: 'iznos_summa',
                                  header: 'iznos'
                                }
                              ] satisfies ColumnDef<AdminMaterialDocument>[])
                }
                className="table-generic-xs"
              />
            </div>
            <div>
              <Pagination
                pageCount={totalPages}
                count={totalCount}
                page={page}
                limit={limit}
                onChange={({ page, limit }) => {
                  if (page) {
                    setPage(page)
                  }
                  if (limit) {
                    setLimit(limit)
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

export const usePagination = (data: any[], currentPage: number, itemsPerPage: number) => {
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const currentData = data.slice(start, end)

  return {
    currentData,
    totalPages,
    totalCount: data.length,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null
  }
}
const CommonDocumentColumnDefs = <
  T extends {
    id: number
    type: string
    doc_num: string
    doc_date: string
    opisanie: string
    login: string
    fio: string
    user_id: number
  }
>(
  extraColumnDefs: ColumnDef<T>[]
) => {
  return [
    {
      key: 'doc_num',
      width: 150
    },
    {
      key: 'doc_date',
      width: 100,
      renderCell: (row) => formatLocaleDate(row.doc_date)
    },
    ...extraColumnDefs,
    {
      width: 250,
      minWidth: 250,
      key: 'opisanie'
    },
    {
      fit: true,
      key: 'user_id',
      minWidth: 200,
      header: 'created-by-user',
      renderCell: (row) => (
        <UserCell
          id={row.user_id}
          fio={row.fio}
          login={row.login}
        />
      )
    }
  ] satisfies ColumnDef<T>[] as ColumnDef<T>[]
}
