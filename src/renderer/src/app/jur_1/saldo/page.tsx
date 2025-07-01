import type { KassaSaldo } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useKeyUp, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { kassaSaldoColumns } from './columns'
import { KassaSaldoQueryKeys } from './config'
import { KassaSaldoDialog } from './dialog'
import { KassaSaldoFilters, useYearFilter } from './filters'
import { KassaSaldoService } from './service'

const KassaSaldoPage = () => {
  const setLayout = useLayout()

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()

  const [year] = useYearFilter()
  const [selected, setSelected] = useState<KassaSaldo | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      KassaSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        year
      }
    ],
    queryFn: KassaSaldoService.getAll
  })
  const { mutate: deleteSaldo, isPending: isDeleting } = useMutation({
    mutationKey: [KassaSaldoQueryKeys.delete],
    mutationFn: KassaSaldoService.delete,
    onSuccess(res) {
      toast.success(res?.message)

      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)

      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [KassaSaldoQueryKeys.getAll]
        })
      })
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })
  const { mutate: cleanSaldo, isPending } = useMutation({
    mutationKey: [KassaSaldoQueryKeys.clean],
    mutationFn: KassaSaldoService.cleanSaldo,
    onSuccess(res) {
      toast.success(res?.message)

      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)

      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [KassaSaldoQueryKeys.getAll]
        })
      })
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })

  const handleClickEdit = (row: KassaSaldo) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: KassaSaldo) => {
    confirm({
      onConfirm() {
        deleteSaldo(row.id)
      }
    })
  }
  const handleClickClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password) {
        cleanSaldo({
          main_schet_id: main_schet_id!,
          password
        })
      }
    })
  }

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        }
      ],
      content: KassaSaldoFilters,
      onCreate: () => {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, t, navigate, dialogToggle.open])

  useKeyUp({
    key: 'Delete',
    ctrlKey: true,
    handler: handleClickClean
  })

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending || isDeleting}>
        <GenericTable
          data={saldo?.data ?? []}
          columnDefs={kassaSaldoColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getRowDeletable={(row) => row.isdeleted}
          getRowEditable={(row) => row.updated}
          getRowClassName={() => 'final-row'}
        />
      </ListView.Content>
      <KassaSaldoDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default KassaSaldoPage
