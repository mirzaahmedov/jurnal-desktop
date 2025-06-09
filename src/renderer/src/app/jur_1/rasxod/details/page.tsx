import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'

import { KassaRasxodDetails } from './details'

const KassaRasxodDetailtsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const { t } = useTranslation(['app'])

  const navigate = useNavigate()
  const setLayout = useLayout()

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        },
        {
          path: '/kassa/rasxod',
          title: t('pages.rasxod-docs')
        }
      ],
      enableSaldo: true,
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, t])

  return (
    <KassaRasxodDetails
      id={id}
      onSuccess={() => {
        navigate(-1)
      }}
    />
  )
}

export default KassaRasxodDetailtsPage
