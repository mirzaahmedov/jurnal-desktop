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
  handleSaldoResponseDates,
  useSaldoController
} from '@/common/features/saldo'
import { useKeyUp } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { PodotchetSaldoColumns } from './columns'
import { PodotchetSaldoQueryKeys } from './config'
import { PodotchetSaldoFilters, useYearFilter } from './filters'
import { PodotchetSaldoService } from './service'

const PodotchetSaldoPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [year] = useYearFilter()

  const { confirm } = useConfirm()
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_4
  })
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
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  }, [error])

  useKeyUp({
    key: 'Delete',
    ctrlKey: true,
    onKeyUp: handleClickClean
  })

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={saldo?.data ?? []}
          columnDefs={PodotchetSaldoColumns}
          onEdit={handleClickEdit}
        />
      </ListView.Content>
    </ListView>
  )
}

export default PodotchetSaldoPage
