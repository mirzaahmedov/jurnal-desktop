import type { BankSaldo } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useKeyUp, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { BankSaldoColumns } from './columns'
import { useBankSaldo } from './components/use-saldo'
import { BankSaldoQueryKeys } from './config'
import { BankSaldoDialog } from './dialog'
import { BankSaldoFilters, useYearFilter } from './filters'
import { BankSaldoService } from './service'

const BankSaldoPage = () => {
  const setLayout = useLayout()

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()

  const [year] = useYearFilter()
  const [selected, setSelected] = useState<BankSaldo | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { queuedMonths } = useBankSaldo()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      BankSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        year
      }
    ],
    queryFn: BankSaldoService.getAll,
    enabled: !!main_schet_id && !queuedMonths.length
  })
  const { mutate: cleanSaldo, isPending } = useMutation({
    mutationKey: [BankSaldoQueryKeys.clean],
    mutationFn: BankSaldoService.cleanSaldo,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [BankSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  })
  const { mutate: deleteSaldo, isPending: isDeleting } = useMutation({
    mutationKey: [BankSaldoQueryKeys.delete],
    mutationFn: BankSaldoService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [BankSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  })

  const handleClickEdit = (row: BankSaldo) => {
    setSelected(row)
    dialogToggle.open()
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
  const handleClickDelete = (row: BankSaldo) => {
    confirm({
      onConfirm() {
        deleteSaldo(row.id)
      }
    })
  }

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      breadcrumbs: [
        {
          title: t('pages.bank')
        }
      ],
      content: BankSaldoFilters,
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
      <ListView.Content loading={isFetching || isPending || isDeleting}>
        <GenericTable
          data={saldo?.data ?? []}
          columnDefs={BankSaldoColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getRowDeletable={(row) => row.isdeleted}
          getRowEditable={(row) => row.updated}
          footer={
            <FooterRow>
              <FooterCell
                colSpan={5}
                title={t('total')}
                content={formatNumber(saldo?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <BankSaldoDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
    </ListView>
  )
}

export default BankSaldoPage
