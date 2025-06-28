import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { columnDefs } from './columns'
import { PassportInfoDialog } from './dialog'

const PassportInfoPage = () => {
  const pagination = usePagination()
  const setLayout = useLayout()
  const dialogToggle = useToggle()

  const { t } = useTranslation(['app'])

  const { data: users, isFetching } = useQuery({
    queryKey: [
      'zarplata/users',
      {
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: MainZarplataService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.passport_info'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      onCreate: dialogToggle.open
    })
  }, [t, setLayout])

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={columnDefs}
          data={users?.data ?? []}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={1}
          count={10}
        />
      </ListView.Footer>

      <PassportInfoDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PassportInfoPage
