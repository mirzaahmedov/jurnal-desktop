import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'

import { KassaPrixodDetails } from './details'

const KassaPrixodDetailsPage = () => {
  const { id } = useParams()
  useRequisitesRedirect(-1, id !== 'create')

  const navigate = useNavigate()
  const setLayout = useLayout()

  const { t } = useTranslation(['app'])

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        },
        {
          path: '/kassa/prixod',
          title: t('pages.prixod-docs')
        }
      ],
      enableSaldo: true,
      onBack() {
        navigate(-1)
      }
    })
  }, [setLayout, t])

  return (
    <KassaPrixodDetails
      id={id}
      onSuccess={() => {
        navigate(-1)
      }}
    />
  )
}

export default KassaPrixodDetailsPage
