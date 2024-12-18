import type { Budjet } from '@/common/models'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { budgetService } from './service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { budgetColumns } from './columns'
import { useToggle } from '@/common/hooks/use-toggle'
import { budgetQueryKeys } from './constants'
import { useLayout } from '@/common/features/layout'
import { useConfirm } from '@/common/features/confirm'
import BudgetDialog from './dialog'

const BudgetPage = () => {
  const [selected, setSelected] = useState<Budjet | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { confirm } = useConfirm()

  const { data: budgets, isFetching } = useQuery({
    queryKey: [budgetQueryKeys.getAll],
    queryFn: budgetService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [budgetQueryKeys.delete],
    mutationFn: budgetService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [budgetQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: 'Бюджеты',
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Budjet) => {
    setSelected(row)
    toggle.open()
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
          columns={budgetColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </div>
      <BudgetDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setIsOpen}
      />
    </>
  )
}

export default BudgetPage
