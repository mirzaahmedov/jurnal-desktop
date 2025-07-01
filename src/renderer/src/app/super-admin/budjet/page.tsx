import type { Budjet } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { BudjetColumns } from './columns'
import { BudjetQueryKeys } from './config'
import BudjetDialog from './dialog'
import { BudjetService } from './service'

const BudjetPage = () => {
  const [selected, setSelected] = useState<Budjet | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: budjets, isFetching } = useQuery({
    queryKey: [BudjetQueryKeys.getAll],
    queryFn: BudjetService.getAll
  })
  const { mutate: deleteBudjet } = useMutation({
    mutationKey: [BudjetQueryKeys.delete],
    mutationFn: BudjetService.delete,
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
        deleteBudjet(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={budjets?.data ?? []}
          columnDefs={BudjetColumns}
          onDelete={handleClickDelete}
          onEdit={handleClickEdit}
        />
      </ListView.Content>
      <BudjetDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default BudjetPage
