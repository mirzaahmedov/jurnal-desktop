import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useLayout } from '@/common/layout'

import { SmetaGrafikDetails } from './details'

const SmetaGrafikDetailsPage = () => {
  const { id } = useParams()
  const { t } = useTranslation(['app'])

  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const setLayout = useLayout()

  const isEditable = searchParams.get('editable') === 'true' || id === 'create'
  const year = searchParams.get('year')

  useRequisitesRedirect(-1)
  useEffect(() => {
    setLayout({
      title: id === 'create' ? t('create') : isEditable ? t('edit') : <b>#{id}</b>,
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
  }, [setLayout, navigate, id, t, isEditable])

  return (
    <SmetaGrafikDetails
      id={id!}
      isEditable={isEditable}
      year={year ?? undefined}
    />
  )
}

export default SmetaGrafikDetailsPage
