import { ArrowDownLeft } from 'lucide-react'
import { Trans } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import { Button } from '@/common/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'

interface ProvodkaChild {
  provodki_schet: string
  provodki_sub_schet: string
}

export interface ProvodkaOperatsiiCellProps {
  provodki: ProvodkaChild[]
}
export const ProvodkaOperatsiiCell = ({ provodki }: ProvodkaOperatsiiCellProps) => {
  return <DetailsCell provodki={provodki} />
}

const DetailsCell = ({ provodki }: ProvodkaOperatsiiCellProps) => {
  return (
    <div className="flex flex-col items-end">
      <div className="w-full">
        <DataList
          className="text-sm"
          list={provodki.slice(0, 2).map((provodka, index) => ({
            name: index + 1,
            value: (
              <div className="flex items-center">
                <span>{provodka.provodki_schet}</span>-<span>{provodka.provodki_sub_schet}</span>
              </div>
            )
          }))}
        />
      </div>
      {provodki.length > 2 ? (
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
              list={provodki.map((provodka, index) => ({
                name: index + 1,
                value: (
                  <div className="flex items-center">
                    <span>{provodka.provodki_schet}</span> -
                    <span>{provodka.provodki_sub_schet}</span>
                  </div>
                )
              }))}
            />
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  )
}
