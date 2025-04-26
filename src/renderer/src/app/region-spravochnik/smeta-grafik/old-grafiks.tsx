import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { SmetaTable } from './components'
import { SmetaGrafikQueryKeys } from './config'
import { SmetaGrafikFilters, useYearFilter } from './filters'
import { SmetaGrafikService } from './service'

const SmetaOldGrafiks = () => {
  const setLayout = useLayout()
  const navigate = useNavigate()
  const dialogToggle = useToggle()
  const pagination = usePagination()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: grafiks, isFetching } = useQuery({
    queryKey: [
      SmetaGrafikQueryKeys.getOld,
      {
        ...pagination,
        year,
        budjet_id: budjet_id!,
        main_schet_id: main_schet_id!
      }
    ],
    queryFn: SmetaGrafikService.getOld,
    enabled: !!budjet_id && !!main_schet_id
  })

  useEffect(() => {
    setLayout({
      title: t('old_smeta_grafiks'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SmetaGrafikFilters,
      onBack: () => {
        navigate(-1)
      },
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, t, dialogToggle.open, navigate])

  return (
    <ListView>
      <ListView.Content
        loading={false}
        className="relative w-full flex-1"
      >
        <SmetaTable
          isLoading={isFetching}
          data={grafiks?.data ?? []}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={grafiks?.meta?.count ?? 0}
          pageCount={grafiks?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default SmetaOldGrafiks
