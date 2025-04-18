import { useEffect } from 'react'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Paginate from 'react-paginate'

import { useEventCallback } from '../hooks'
import { JollySelect, SelectItem } from './jolly/select'
import { Button } from './ui/button'

const pageSizeOptions = [
  { value: 5 },
  { value: 10 },
  { value: 15 },
  { value: 20 },
  { value: 25 },
  { value: 50 },
  { value: 100 }
]

export interface PaginationValues {
  page: number
  limit: number
}
export interface PaginationProps extends PaginationValues {
  displayLimit?: boolean
  pageCount: number
  count: number
  onChange: (values: Partial<PaginationValues>) => void
}
export const Pagination = ({
  displayLimit = true,
  page,
  pageCount,
  count,
  limit,
  onChange
}: PaginationProps) => {
  const { t } = useTranslation()

  const onChangeEvent = useEventCallback(onChange)

  useEffect(() => {
    if (pageCount && page > pageCount) {
      onChangeEvent({ page: page > 1 ? page - 1 : 1 })
    }
  }, [pageCount, page, onChangeEvent])

  return (
    <div className="flex items-center justify-start gap-5">
      <Paginate
        className="flex gap-4"
        pageRangeDisplayed={2}
        breakLabel="..."
        forcePage={page - 1}
        onPageChange={({ selected }) => onChange({ page: selected + 1 })}
        pageLabelBuilder={(pageNumber) => (
          <Button
            variant={pageNumber === page ? 'default' : 'ghost'}
            size="icon"
          >
            {pageNumber}
          </Button>
        )}
        nextLabel={
          <Button
            variant="ghost"
            size="icon"
          >
            <ArrowRight className="btn-icon !ml-0" />
          </Button>
        }
        previousLabel={
          <Button
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="btn-icon !ml-0" />
          </Button>
        }
        pageCount={pageCount}
        renderOnZeroPageCount={null}
      />
      {pageCount > 0 && displayLimit && (
        <div className="flex items-center gap-10">
          <p className="whitespace-nowrap text-sm font-medium">{t('elements_per_page')}</p>
          <JollySelect
            items={pageSizeOptions}
            selectedKey={limit}
            onSelectionChange={(value) => onChange({ limit: Number(value) })}
            className="w-24 gap-0"
          >
            {(item) => <SelectItem id={item.value}>{item.value}</SelectItem>}
          </JollySelect>
          <p className="whitespace-nowrap text-sm font-medium">
            {t('elements_total')}: {count}
          </p>
        </div>
      )}
    </div>
  )
}
