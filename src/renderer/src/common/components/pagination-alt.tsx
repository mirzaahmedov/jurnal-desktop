import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Paginate from 'react-paginate'
import { SelectField } from './select-field'
import { Button } from './ui/button'

export interface PaginationValues {
  page: number
  limit: number
}
export interface PaginationProps extends PaginationValues {
  pageCount: number
  onChange: (values: Partial<PaginationValues>) => void
}
export const Pagination = ({ page, pageCount, limit, onChange }: PaginationProps) => {
  const { t } = useTranslation()

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
            variant={pageNumber === page ? 'outline' : 'ghost'}
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
      {pageCount > 0 && (
        <>
          <span className="whitespace-nowrap text-sm text-slate-400">{t('elements-per-page')}</span>
          <div>
            <SelectField
              placeholder="Элементов на странице"
              value={String(limit)}
              onValueChange={(value) => onChange({ limit: Number(value) })}
              options={[5, 10, 15, 20, 25, 50, 100]}
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
