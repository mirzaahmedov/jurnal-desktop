import type { ColumnDef } from '@/common/components'
import type { Organization } from '@/common/models'

import { PopoverTrigger } from '@radix-ui/react-popover'
import { DataList } from '@renderer/common/components/data-list'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { Button } from '@renderer/common/components/ui/button'
import { Popover, PopoverContent } from '@renderer/common/components/ui/popover'
import { ArrowDownLeft } from 'lucide-react'
import { Trans } from 'react-i18next'

import { Copyable } from '@/common/components'

export const organizationColumns: ColumnDef<Organization>[] = [
  {
    key: 'id',
    className: 'pr-1',
    renderCell: IDCell
  },
  {
    key: 'name',
    className: 'min-w-[300px]'
  },
  {
    key: 'inn',
    className: 'pr-0',
    renderCell(row) {
      return (
        <Copyable
          value={row.inn}
          className="gap-0"
        >
          {row.inn}
        </Copyable>
      )
    }
  },
  {
    key: 'mfo',
    className: 'pr-0',
    renderCell(row) {
      return (
        <Copyable
          value={row.mfo}
          className="gap-0"
        >
          {row.mfo}
        </Copyable>
      )
    }
  },
  {
    key: 'bank_klient',
    header: 'bank',
    className: 'min-w-[300px] break-all'
  },
  {
    fit: true,
    key: 'raschet_schet',
    header: 'raschet-schet',
    className: 'py-2',
    renderCell(row) {
      return (
        <div className="flex flex-col items-end">
          <div className="w-full">
            <DataList
              className="text-sm"
              list={row.account_numbers.slice(0, 2).map((schet, index) => ({
                name: index + 1,
                value: (
                  <Copyable
                    side="start"
                    className="gap-0 text-sm"
                    value={schet.raschet_schet}
                  >
                    {schet.raschet_schet}
                  </Copyable>
                )
              }))}
            />
          </div>
          {row.account_numbers.length > 2 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="link"
                  className="p-0 text-xs text-brand gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowDownLeft className="size-4" />
                  <Trans>view_all</Trans>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <DataList
                  list={row.account_numbers.map((schet, index) => ({
                    name: index + 1,
                    value: (
                      <Copyable
                        side="start"
                        className="gap-0 text-sm"
                        value={schet.raschet_schet}
                      >
                        {schet.raschet_schet}
                      </Copyable>
                    )
                  }))}
                />
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
      )
    }
  },
  {
    fit: true,
    key: 'raschet_schet_gazna',
    header: 'raschet-schet-gazna',
    className: 'py-2',
    renderCell(row) {
      return (
        <div className="flex flex-col items-end">
          <div className="w-full">
            <DataList
              className="text-sm"
              list={row.gaznas.slice(0, 2).map((schet, index) => ({
                name: index + 1,
                value: (
                  <Copyable
                    side="start"
                    className="gap-0 text-sm"
                    value={schet.raschet_schet_gazna}
                  >
                    {schet.raschet_schet_gazna}
                  </Copyable>
                )
              }))}
            />
          </div>
          {row.gaznas.length > 2 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="link"
                  className="p-0 text-xs text-brand gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowDownLeft className="size-4" />
                  <Trans>view_all</Trans>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <DataList
                  list={row.gaznas.map((schet, index) => ({
                    name: index + 1,
                    value: (
                      <Copyable
                        side="start"
                        className="gap-0 text-sm"
                        value={schet.raschet_schet_gazna}
                      >
                        {schet.raschet_schet_gazna}
                      </Copyable>
                    )
                  }))}
                />
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
      )
    }
  }
]
