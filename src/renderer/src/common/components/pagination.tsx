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
  displayPageSize?: boolean
  pageCount: number
  count: number
  onChange: (values: Partial<PaginationValues>) => void
}
export const Pagination = (props: PaginationProps) => {
  const { t } = useTranslation()

  const pageCount = Math.max(props.pageCount, 1)
  const page = Math.max(props.page, 1)
  const onChangeEvent = useEventCallback(props.onChange)

  useEffect(() => {
    if (pageCount && page > pageCount) {
      onChangeEvent({ page: page > 1 ? page - 1 : 1 })
    }
  }, [pageCount, page, onChangeEvent])

  return (
    <div className="flex items-center justify-start gap-20">
      <Paginate
        className="flex gap-4"
        pageRangeDisplayed={2}
        breakLabel="..."
        forcePage={page - 1 === 0 ? 1 : page - 1}
        onPageChange={({ selected }) => props.onChange({ page: selected + 1 })}
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
      />
      {props.displayPageSize && (
        <div className="flex items-center gap-10">
          <span className="whitespace-nowrap text-sm font-medium text-slate-600">
            {t('pagination.range', {
              from: (page - 1) * props.limit + 1,
              to: page * props.limit,
              total: props.count
            })}
          </span>
          <div className="flex items-center gap-5">
            <span className="whitespace-nowrap text-sm font-medium text-slate-600">
              {t('pagination.page_size')}
            </span>
            <JollySelect
              items={pageSizeOptions}
              selectedKey={props.limit}
              onSelectionChange={(value) => props.onChange({ limit: Number(value) })}
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
