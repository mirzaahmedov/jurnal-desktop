import type { PodotchetSaldo } from '@/common/models'

import { useEffect } from 'react'

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
import { useKeyUp } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { PodotchetSaldoColumns } from './columns'
import { PodotchetSaldoQueryKeys } from './config'
import { PodotchetSaldoFilters, useYearFilter } from './filters'
import { PodotchetSaldoService } from './service'
import { usePodotchetSaldo } from './use-saldo'

const PodotchetSaldoPage = () => {
  const setLayout = useLayout()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [year] = useYearFilter()

  const { confirm } = useConfirm()
  const { queuedMonths } = usePodotchetSaldo()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id, jur4_schet_id } = useRequisitesStore()

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      PodotchetSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        schet_id: jur4_schet_id,
        year
      }
    ],
    queryFn: PodotchetSaldoService.getAll,
    enabled: !!main_schet_id && !!budjet_id && !!jur4_schet_id && !queuedMonths.length
  })
  const { mutate: cleanSaldo, isPending } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.clean],
    mutationFn: PodotchetSaldoService.cleanSaldo,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  })
  const { mutate: deleteSaldo, isPending: isDeleting } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.delete],
    mutationFn: PodotchetSaldoService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  })

  const handleClickEdit = (row: PodotchetSaldo) => {
    navigate(`${row.id}`)
  }
  const handleClickClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password) {
        cleanSaldo({
          schet_id: jur4_schet_id!,
          main_schet_id: main_schet_id!,
          password
        })
      }
    })
  }
  const handleClickDelete = (row: PodotchetSaldo) => {
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
      content: PodotchetSaldoFilters,
      onCreate: () => {
        navigate('create', { state: { year } })
      }
    })
  }, [setLayout, t, navigate, year])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  }, [error])

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
          columnDefs={PodotchetSaldoColumns}
          getRowDeletable={(row) => row.isdeleted}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getRowClassName={() => 'final-row'}
        />
      </ListView.Content>
    </ListView>
  )
}

export default PodotchetSaldoPage
