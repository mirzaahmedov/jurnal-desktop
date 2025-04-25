import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'

import RasxodDetails from './details'

const RasxodDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const setLayout = useLayout()
  const navigate = useNavigate()

  const { t } = useTranslation(['app'])

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        },
        {
          title: t('pages.rasxod-docs'),
          path: '/journal-7/rasxod'
        }
      ],
      enableSaldo: true,
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  return (
    <RasxodDetails
      id={id}
      onSuccess={() => {
        navigate(-1)
      }}
    />
  )
}

export default RasxodDetailsPage
