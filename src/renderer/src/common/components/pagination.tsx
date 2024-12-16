import Paginate from 'react-paginate'
import { parseAsInteger, useQueryStates } from 'nuqs'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { SelectField } from './select-field'
import { useCallback } from 'react'

const itemsPerPageOptions = [5, 10, 15, 20, 50, 100]

export const usePagination = () => {
  const [pagination, setPagination] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10)
  })

  const setCurrentPage = useCallback(
    (currentPage: number) => {
      setPagination({ page: currentPage })
    },
    [setPagination]
  )
  const setItemsPerPage = useCallback(
    (itemsPerPage: number) => {
      setPagination({ limit: itemsPerPage })
    },
    [setPagination]
  )

  return {
    currentPage: pagination.page,
    setCurrentPage,
    itemsPerPage: pagination.limit,
    setItemsPerPage
  }
}

export type PaginationProps = {
  pageCount: number
  value?: number
  onValueChange?: (value: number) => void
  limit?: number
  onLimitChange?: (value: number) => void
}
export const Pagination = (props: PaginationProps) => {
  const { pageCount, value, onValueChange, limit, onLimitChange } = props

  const { currentPage, setCurrentPage, itemsPerPage, setItemsPerPage } = usePagination()

  const page = value ?? currentPage
  const setPage = onValueChange ?? setCurrentPage

  const limitValue = limit ?? itemsPerPage
  const setLimit = onLimitChange ?? setItemsPerPage

  return (
    <div className="flex items-center justify-start gap-5">
      <Paginate
        className="flex gap-4"
        pageRangeDisplayed={2}
        breakLabel="..."
        forcePage={page - 1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        pageLabelBuilder={(page) => (
          <Button variant={currentPage === page ? 'outline' : 'ghost'} size="icon">
            {page}
          </Button>
        )}
        nextLabel={
          <Button variant="ghost" size="icon">
            <ArrowRight className="btn-icon !ml-0" />
          </Button>
        }
        previousLabel={
          <Button variant="ghost" size="icon">
            <ArrowLeft className="btn-icon !ml-0" />
          </Button>
        }
        pageCount={pageCount}
        renderOnZeroPageCount={null}
      />
      {pageCount > 0 && (
        <>
          <span className="whitespace-nowrap text-sm text-slate-400">Элементов на странице</span>
          <div>
            <SelectField
              placeholder="Элементов на странице"
              value={String(limitValue)}
              onValueChange={(value) => setLimit(Number(value))}
              options={itemsPerPageOptions}
              getOptionValue={String}
              getOptionLabel={String}
              triggerClassName="min-w-[100px]"
            />
          </div>
        </>
      )}
    </div>
  )
}
