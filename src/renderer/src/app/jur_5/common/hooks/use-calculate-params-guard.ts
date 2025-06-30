import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useZarplataStore } from '@/common/features/zarplata/store'

export const useCalculateParamsGuard = () => {
  const calculateParamsId = useZarplataStore((store) => store.calculateParamsId)
  const navigate = useNavigate()

  const { t } = useTranslation()

  useEffect(() => {
    if (!calculateParamsId) {
      toast.error(t('no_calculate_params_selected'))
      navigate('/jur-5/calculate-params')
    }
  }, [navigate, calculateParamsId, t])
}
