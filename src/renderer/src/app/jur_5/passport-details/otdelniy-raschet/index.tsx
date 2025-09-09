import type { MainZarplata } from '@/common/models'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { YearMonthCombo } from '@/common/components/year-month-combo'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks'
import { ListView } from '@/common/views'

import { DopOplataColumnDefs } from './columns'
import { OtdelniyRaschetDetails } from './otdelniy-raschet-details'
import { OtdelniyRaschetDialog } from './otdelniy-raschet-dialog'
import { type OtdelniyRaschet, OtdelniyRaschetService } from './service'

interface OtdelniyRaschetContainerProps {
  mainZarplata: MainZarplata
}
export const OtdelniyRaschetContainer = ({ mainZarplata }: OtdelniyRaschetContainerProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()

  const [year, setYear] = useState<number | undefined>(undefined)
  const [month, setMonth] = useState<number | undefined>(undefined)
  const [otdelniyRaschetData, setOtdelniyRaschetData] = useState<OtdelniyRaschet | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const viewToggle = useToggle()

  const dopOplataQuery = useQuery({
    queryKey: [OtdelniyRaschetService.QueryKeys.GetByMainZarplataId, mainZarplata.id],
    queryFn: OtdelniyRaschetService.getAll
  })

  const dopOplataDeleteMutation = useMutation({
    mutationFn: OtdelniyRaschetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OtdelniyRaschetService.QueryKeys.GetByMainZarplataId]
      })
      toast.success(t('delete_success'))
    }
  })

  const handleOtdelniyRaschetDelete = (row: OtdelniyRaschet) => {
    confirm({
      onConfirm() {
        dopOplataDeleteMutation.mutate(row.id)
      }
    })
  }

  const handleOtdelniyRaschetCreate = () => {
    dialogToggle.open()
  }

  const handleOtdelniyRaschetView = (row: OtdelniyRaschet) => {
    setOtdelniyRaschetData(row)
    viewToggle.open()
  }

  return (
    <ListView>
      <ListView.Header className="justify-between">
        <YearMonthCombo
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
        <Button onClick={handleOtdelniyRaschetCreate}>
          <Plus className="btn-icon icon-start" /> {t('add')}
        </Button>
      </ListView.Header>
      <ListView.Content isLoading={dopOplataQuery.isFetching}>
        <GenericTable
          columnDefs={DopOplataColumnDefs}
          data={dopOplataQuery.data ?? []}
          className="table-generic-xs"
          onDelete={handleOtdelniyRaschetDelete}
          onView={handleOtdelniyRaschetView}
        />
      </ListView.Content>

      <OtdelniyRaschetDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        mainZarplata={mainZarplata}
      />

      <OtdelniyRaschetDetails
        isOpen={viewToggle.isOpen}
        onOpenChange={viewToggle.setOpen}
        payments={otdelniyRaschetData?.otdelniyRaschetPaymentDtos ?? []}
        deductions={otdelniyRaschetData?.otdelniyRaschetDeductionDtos ?? []}
      />
    </ListView>
  )
}
