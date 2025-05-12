import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'

import { SmetaGrafikDetails } from './details'

const SmetaGrafikDetailsPage = () => {
  const { id } = useParams()
  const { t } = useTranslation(['app'])

  const navigate = useNavigate()
  const setLayout = useLayout()

  useRequisitesRedirect(-1)
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.smeta_grafik'),
          path: '/smeta-grafik'
        }
      ],
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  return <SmetaGrafikDetails id={id!} />
}

export default SmetaGrafikDetailsPage
