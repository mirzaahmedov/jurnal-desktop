import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useLayout } from '@/common/layout'

import { WorkTripDetails } from './details'

const WorkTripDetailsPage = () => {
  const navigate = useNavigate()
  const setLayout = useLayout()

  const { id } = useParams()
  const { t } = useTranslation(['app'])

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      enableSaldo: true,
      onBack: () => {
        navigate(-1)
      },
      breadcrumbs: [
        {
          title: t('pages.podotchet')
        },
        {
          title: t('pages.work_trip'),
          path: '/accountable/work-trip'
        }
      ]
    })
  }, [navigate, setLayout, t, id])

  return <WorkTripDetails id={id!} />
}

export default WorkTripDetailsPage
