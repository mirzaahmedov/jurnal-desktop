import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useLayout } from '@/common/layout'

import PrixodDetails from './details'

const PrixodDetailsPage = () => {
  const navigate = useNavigate()
  const setLayout = useLayout()

  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation(['app'])

  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : t('edit'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        },
        {
          title: t('pages.prixod-docs'),
          path: '/journal-7/prixod'
        }
      ],
      enableSaldo: true,
      onBack: () => {
        navigate(-1)
      }
    })
  }, [setLayout, navigate, id, t])

  return (
    <PrixodDetails
      id={id}
      onSuccess={() => {
        navigate(-1)
      }}
    />
  )
}

export default PrixodDetailsPage
