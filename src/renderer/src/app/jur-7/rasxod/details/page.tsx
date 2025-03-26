import { useEffect } from 'react'

import { useLayoutStore } from '@renderer/common/features/layout'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import RasxodDetails from './details'

const RasxodDetailsPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)
  const navigate = useNavigate()

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
          title: t('pages.rasxod-docs'),
          path: '/journal-7/rasxod'
        }
      ],
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
