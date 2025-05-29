import type { OrganSaldo } from '@/common/models'

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

import { OrganSaldoColumns } from './columns'
import { OrganSaldoQueryKeys } from './config'
import { OrganSaldoFilters, useYearFilter } from './filters'
import { OrganSaldoService } from './service'
import { useUslugiSaldo } from './use-saldo'

const OrganSaldoPage = () => {
  const setLayout = useLayout()

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [year] = useYearFilter()

  const { confirm } = useConfirm()
  const { queuedMonths } = useUslugiSaldo()
  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id, jur3_schet_152_id } = useRequisitesStore()

  const {
    data: saldo,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      OrganSaldoQueryKeys.getAll,
      {
        main_schet_id,
        budjet_id,
        schet_id: jur3_schet_152_id,
        year
      }
    ],
    queryFn: OrganSaldoService.getAll,
    enabled: !!main_schet_id && !!budjet_id && !!jur3_schet_152_id && !queuedMonths.length
  })

  const { mutate: cleanSaldo, isPending } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.clean],
    mutationFn: OrganSaldoService.cleanSaldo,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_3_152, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
    }
  })

  const { mutate: deleteSaldo, isPending: isDeleting } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.delete],
    mutationFn: OrganSaldoService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_3_152, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
    }
  })

  const handleClickEdit = (row: OrganSaldo) => {
    navigate(`${row.id}`)
  }
  const handleClickClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password) {
        cleanSaldo({
          schet_id: jur3_schet_152_id!,
          main_schet_id: main_schet_id!,
          password
        })
      }
    })
  }
  const handleClickDelete = (row: OrganSaldo) => {
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
      content: OrganSaldoFilters,
      enableSaldo: true,
      onCreate: () => {
        navigate('create', {
          state: {
            year
          }
        })
      }
    })
  }, [setLayout, t, navigate, year])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
    }
  }, [error])

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
          columnDefs={OrganSaldoColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getRowDeletable={(row) => row.isdeleted}
          getRowClassName={() => 'final-row'}
        />
      </ListView.Content>
    </ListView>
  )
}

export default OrganSaldoPage
