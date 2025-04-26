import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useLayout } from '@/common/layout'

import { SmetaGrafikBatchCreate } from './batch-create'

export const SmetaGrafikBatchCreatePage = () => {
  const navigate = useNavigate()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { id } = useParams()

  useEffect(() => {
    setLayout({
      title: t('create'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        },
        {
          title: t('pages.prixod-docs'),
          path: '/smeta-grafik'
        }
      ],
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  return <SmetaGrafikBatchCreate />
}
