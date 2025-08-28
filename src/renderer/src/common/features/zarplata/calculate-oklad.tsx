import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Calculator } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { CalculateParamsColumnDefs } from '@/app/jur_5/calculate-params/colums'
import { CalculateParamsService } from '@/app/jur_5/calculate-params/service'
import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { Pagination } from '@/common/components/pagination'

import { useConfirm } from '../confirm'

const { QueryKeys } = CalculateParamsService

export const CalculateOklad = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const calcParamsQuery = useQuery({
    queryKey: [
      QueryKeys.GetAll,
      {
        PageIndex: page,
        PageSize: limit
      }
    ],
    queryFn: CalculateParamsService.getCalcParameters
  })

  const calculateOkladMutation = useMutation({
    mutationFn: CalculateParamsService.calculateOklad,
    onSuccess: () => {
      toast.success(t('update_success'))
    }
  })

  const handleCalculate = () => {
    confirm({
      title: t('are_you_sure_to_calculate'),
      danger: false,
      onConfirm: () => {
        calculateOkladMutation.mutate(selectedId!)
      }
    })
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-auto scrollbar">
        <GenericTable
          columnDefs={CalculateParamsColumnDefs}
          data={calcParamsQuery.data?.data ?? []}
          selectedIds={selectedId ? [selectedId] : []}
          onClickRow={(row) => setSelectedId(row.id)}
          className="table-generic-xs"
        />
      </div>
      <div className="p-5 flex items-center justify-between">
        <Pagination
          count={calcParamsQuery.data?.totalCount ?? 0}
          pageCount={Math.ceil((calcParamsQuery.data?.totalCount ?? 0) / limit)}
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
        <Button
          onPress={handleCalculate}
          IconStart={Calculator}
          isPending={calculateOkladMutation.isPending}
        >
          {t('calculate')}
        </Button>
      </div>
    </div>
  )
}
