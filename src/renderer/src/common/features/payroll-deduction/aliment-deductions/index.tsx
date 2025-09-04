import type { AlimentDeduction } from '@/common/models/payroll-deduction'
import type { DialogTriggerProps } from 'react-aria-components'

import { type FC, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { type ColumnDef, GenericTable } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { useToggle } from '@/common/hooks'

import { useConfirm } from '../../confirm'
import { AlimentDeductionDialog } from './dialog'
import { AlimentDeductionService } from './service'

export interface AlimentDeductionsDialogProps extends Omit<DialogTriggerProps, 'children'> {
  mainZarplataId: number
  deductionId: number
}
export const AlimentDeductionsDialog: FC<AlimentDeductionsDialogProps> = ({
  mainZarplataId,
  deductionId,
  ...props
}) => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [alimentDeductionData, setAlimentDeductionData] = useState<AlimentDeduction>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const alimentDeductionsQuery = useQuery({
    queryKey: [AlimentDeductionService.QueryKeys.GetAll, { mainId: mainZarplataId }],
    queryFn: AlimentDeductionService.getAll,
    enabled: !!mainZarplataId
  })

  const alimentDeleteMutation = useMutation({
    mutationFn: AlimentDeductionService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [AlimentDeductionService.QueryKeys.GetAll, { mainId: mainZarplataId }]
      })
    }
  })

  const handleClickCreate = () => {
    setAlimentDeductionData(undefined)
    dialogToggle.open()
  }
  const handleClickEdit = (row: AlimentDeduction) => {
    setAlimentDeductionData(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: AlimentDeduction) => {
    confirm({
      onConfirm: () => alimentDeleteMutation.mutate(row.id)
    })
  }

  return (
    <>
      <DialogTrigger {...props}>
        <DialogOverlay>
          <DialogContent className="h-full max-h-[800px] w-full max-w-7xl flex flex-col p-0">
            <div className="flex flex-col overflow-hidden h-full">
              <DialogHeader className="p-5 flex flex-row items-center justify-between">
                <DialogTitle>{t('aliment')}</DialogTitle>
                <Button
                  IconStart={Plus}
                  onPress={handleClickCreate}
                >
                  {t('add')}
                </Button>
              </DialogHeader>
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar">
                <GenericTable
                  columnDefs={
                    [
                      {
                        key: 'poluchatelFio',
                        header: 'fio'
                      },
                      {
                        key: 'cardNumber',
                        header: 'card_number'
                      }
                    ] satisfies ColumnDef<AlimentDeduction>[]
                  }
                  data={alimentDeductionsQuery.data ?? []}
                  onEdit={handleClickEdit}
                  onDelete={handleClickDelete}
                  className="table-generic-xs"
                />
              </div>
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogTrigger>

      <AlimentDeductionDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        mainZarplataId={mainZarplataId}
        deductionId={deductionId}
        alimentDeductionData={alimentDeductionData}
      />
    </>
  )
}
