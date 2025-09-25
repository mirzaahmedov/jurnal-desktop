import type { MainZarplata } from '@/common/models'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks'
import { formatDate } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { DopOplataColumnDefs } from './columns'
import { OtdelniyRaschetCreateDialog } from './otdelniy-raschet-create-dialog'
import { OtdelniyRaschetDetails } from './otdelniy-raschet-details'
import { OtdelniyRaschetService } from './service'

interface OtdelniyRaschetContainerProps {
  mainZarplata: MainZarplata
}
export const OtdelniyRaschetContainer = ({ mainZarplata }: OtdelniyRaschetContainerProps) => {
  const { t } = useTranslation()
  const { confirm } = useConfirm()

  const [startDate, setStartDate] = useState(formatDate(new Date()))
  const [endDate, setEndDate] = useState(formatDate(new Date()))
  const [currentIndex, setCurrentIndex] = useState(0)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const viewToggle = useToggle()

  const handleNextDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(field === 'from' ? startDate! : endDate!)
    date.setDate(date.getDate() + amount)
    const newDate = date.toISOString().split('T')[0]
    if (field === 'from') setStartDate(newDate)
    else setEndDate(newDate)
  }
  const handlePrevDay = (field: 'from' | 'to', amount: number) => {
    const date = new Date(field === 'from' ? startDate! : endDate!)
    date.setDate(date.getDate() - amount)
    const newDate = date.toISOString().split('T')[0]
    if (field === 'from') setStartDate(newDate)
    else setEndDate(newDate)
  }

  const from = formatLocaleDate(startDate)
  const to = formatLocaleDate(endDate)

  const otdelniyRaschetQuery = useQuery({
    queryKey: [
      OtdelniyRaschetService.QueryKeys.GetByMainZarplataId,
      mainZarplata.id,
      {
        from,
        to
      }
    ],
    queryFn: OtdelniyRaschetService.getAll,
    enabled: !!from && !!to
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
        <div className="flex items-center flex-wrap gap-x-1 gap-y-2.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onPress={() => handlePrevDay('from', 1)}
          >
            <ChevronLeft className="btn-icon" />
          </Button>
          <JollyDatePicker
            autoFocus
            value={startDate}
            onChange={(date) => setStartDate(date)}
            containerProps={{ className: 'w-36 min-w-36' }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onPress={() => handleNextDay('from', 1)}
          >
            <ChevronRight className="btn-icon" />
          </Button>
          <b className="mx-0.5">-</b>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onPress={() => handlePrevDay('to', 1)}
          >
            <ChevronLeft className="btn-icon" />
          </Button>
          <JollyDatePicker
            value={endDate}
            onChange={(date) => setEndDate(date)}
            containerProps={{ className: 'w-36 min-w-36' }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onPress={() => handleNextDay('to', 1)}
          >
            <ChevronRight className="btn-icon" />
          </Button>
        </div>
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

      <OtdelniyRaschetCreateDialog
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
