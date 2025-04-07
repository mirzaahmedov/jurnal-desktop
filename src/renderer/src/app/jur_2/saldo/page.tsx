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
import { useToggle } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { bankSaldoColumns } from './columns'
import { BankSaldoQueryKeys } from './config'
import { BankSaldoDialog } from './dialog'
import { BankSaldoFilters, useYearFilter } from './filters'
import { BankSaldoService } from './service'

const BankSaldoPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()

  const [year] = useYearFilter()
  const [selected, setSelected] = useState<BankSaldo | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: bankSaldoList, isFetching } = useQuery({
    queryKey: [
      BankSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        year
      }
    ],
    queryFn: BankSaldoService.getAll
  })
  const { mutate: deleteSaldo, isPending } = useMutation({
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
  const handleClickDelete = (row: BankSaldo) => {
    confirm({
      onConfirm() {
        deleteSaldo(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      content: BankSaldoFilters,
      onCreate: () => {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, t, navigate, dialogToggle.open])

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={bankSaldoList?.data ?? []}
          columnDefs={bankSaldoColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                colSpan={4}
                content={formatNumber(bankSaldoList?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <BankSaldoDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
    </ListView>
  )
}

export default BankSaldoPage
