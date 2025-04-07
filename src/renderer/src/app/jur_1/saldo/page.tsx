import type { KassaSaldo } from '@/common/models'

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

import { kassaSaldoColumns } from './columns'
import { KassaSaldoQueryKeys } from './config'
import { KassaSaldoDialog } from './dialog'
import { KassaSaldoFilters, useYearFilter } from './filters'
import { KassaSaldoService } from './service'

const KassaSaldoPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dialogToggle = useToggle()

  const [year] = useYearFilter()
  const [selected, setSelected] = useState<KassaSaldo | null>(null)

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: kassaSaldoList, isFetching } = useQuery({
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
  const { mutate: deleteSaldo, isPending } = useMutation({
    mutationKey: [KassaSaldoQueryKeys.delete],
    mutationFn: KassaSaldoService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [KassaSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)
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

  useEffect(() => {
    setLayout({
      title: t('pages.saldo'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      content: KassaSaldoFilters,
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
          data={kassaSaldoList?.data ?? []}
          columnDefs={kassaSaldoColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                colSpan={4}
                content={formatNumber(kassaSaldoList?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <KassaSaldoDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
    </ListView>
  )
}

export default KassaSaldoPage
