import type { Budjet } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'

import { budgetColumns } from './columns'
import { BudjetQueryKeys } from './config'
import BudgetDialog from './dialog'
import { BudgetService } from './service'

const BudgetPage = () => {
  const [selected, setSelected] = useState<Budjet | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: budgets, isFetching } = useQuery({
    queryKey: [BudjetQueryKeys.getAll],
    queryFn: BudgetService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [BudjetQueryKeys.delete],
    mutationFn: BudgetService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [BudjetQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])
  useEffect(() => {
    setLayout({
      title: t('pages.budjet'),
      onCreate: dialogToggle.open
    })
  }, [setLayout, dialogToggle.open, t])

  const handleClickEdit = (row: Budjet) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Budjet) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={budgets?.data ?? []}
          columnDefs={budgetColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </div>
      <BudgetDialog
        data={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </>
  )
}

export default BudgetPage
