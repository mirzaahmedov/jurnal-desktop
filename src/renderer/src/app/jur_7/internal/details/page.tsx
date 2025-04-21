import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useLayout } from '@/common/layout'

import InternalDetails from './details'

const InternalDetailsPage = () => {
  const navigate = useNavigate()
  const setLayout = useLayout()

  const { id } = useParams()
  const { t } = useTranslation(['app'])

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        },
        {
          title: t('pages.internal-docs'),
          path: '/journal-7/internal-transfer'
        }
      ],
      enableSaldo: true,
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  return (
    <InternalDetails
      id={id}
      onSuccess={() => {
        navigate(-1)
      }}
    />
  )
}

export default InternalDetailsPage
