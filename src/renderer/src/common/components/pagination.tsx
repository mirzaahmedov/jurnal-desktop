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
  disablePageSize?: boolean
  pageCount: number
  count: number
  onChange: (values: Partial<PaginationValues>) => void
}
export const Pagination = ({
  disablePageSize = false,
  page,
  limit,
  count,
  pageCount,
  onChange
}: PaginationProps) => {
  const { t } = useTranslation()

  const pageCountValue = Math.max(pageCount, 1)
  const pageValue = Math.max(page, 1)
  const onChangeEvent = useEventCallback(onChange)

  useEffect(() => {
    if (pageCountValue && pageValue > pageCountValue) {
      onChangeEvent({ page: pageValue > 1 ? pageValue - 1 : 1 })
    }
  }, [pageCountValue, pageValue, onChangeEvent])

  return (
    <div className="flex items-center justify-start gap-20">
      <Paginate
        className="flex gap-4"
        pageRangeDisplayed={2}
        breakLabel="..."
        forcePage={pageValue - 1 === 0 ? 1 : pageValue - 1}
        onPageChange={({ selected }) => onChange({ page: selected + 1 })}
        pageLabelBuilder={(pageNumber) => (
          <Button
            variant={pageNumber === pageValue ? 'default' : 'ghost'}
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
        pageCount={pageCountValue}
      />
      {!disablePageSize && (
        <div className="flex items-center gap-10">
          <span className="whitespace-nowrap text-sm font-medium text-slate-600">
            {t('pagination.range', {
              from: (pageValue - 1) * limit + 1,
              to: pageValue * limit,
              total: count
            })}
          </span>
          <div className="flex items-center gap-5">
            <span className="whitespace-nowrap text-sm font-medium text-slate-600">
              {t('pagination.page_size')}
            </span>
            <JollySelect
              items={pageSizeOptions}
              selectedKey={limit}
              onSelectionChange={(value) => onChange({ limit: Number(value) })}
              className="w-20 gap-0"
            >
              {(item) => <SelectItem id={item.value}>{item.value}</SelectItem>}
            </JollySelect>
          </div>
        </div>
      )}
    </div>
  )
}
