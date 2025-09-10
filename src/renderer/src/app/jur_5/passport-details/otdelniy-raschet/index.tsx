import type { MainZarplata } from '@/common/models'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'

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
import { OtdelniyRaschetService } from './service'

interface OtdelniyRaschetContainerProps {
  mainZarplata: MainZarplata
}
export const OtdelniyRaschetContainer = ({ mainZarplata }: OtdelniyRaschetContainerProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()

  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [currentIndex, setCurrentIndex] = useState(0)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const viewToggle = useToggle()

  const otdelniyRaschetQuery = useQuery({
    queryKey: [
      OtdelniyRaschetService.QueryKeys.GetByMainZarplataId,
      mainZarplata.id,
      {
        year,
        month
      }
    ],
    queryFn: OtdelniyRaschetService.getAll
  })

  const otdelniyRaschetDeleteMutation = useMutation({
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
        otdelniyRaschetDeleteMutation.mutate(row.id)
      }
    })
  }

  const handleOtdelniyRaschetCreate = () => {
    dialogToggle.open()
  }

  const handleOtdelniyRaschetView = () => {
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
      <ListView.Content isLoading={otdelniyRaschetQuery.isFetching}>
        <GenericTable
          columnDefs={DopOplataColumnDefs}
          data={otdelniyRaschetQuery.data ?? []}
          className="table-generic-xs"
          onDelete={handleOtdelniyRaschetDelete}
          onEdit={handleOtdelniyRaschetView}
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
        mainZarplata={mainZarplata}
        items={otdelniyRaschetQuery.data ?? []}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
    </ListView>
  )
}
