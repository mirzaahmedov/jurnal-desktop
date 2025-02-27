import type { Zarplata } from '@renderer/common/models'

import { useEffect, useState } from 'react'

import { GenericTable } from '@renderer/common/components'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useLocationState, usePagination, useToggle } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { columnDefs } from './columns'
import { ZarplataSpravochnikDialog } from './dialog'
import { SpravochnikFilters } from './filters'
import { ZarplataSpravochnikService } from './service'

const { queryKeys } = ZarplataSpravochnikService

const ZarplataSpravochnikPage = () => {
  const { t } = useTranslation(['app'])

  const [selected, setSelected] = useState<Zarplata.Spravochnik>()
  const [typeCode] = useLocationState<number | undefined>('type')

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: spravochniks, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        PageIndex: pagination.page,
        PageSize: pagination.limit,
        types_type_code: typeCode!
      }
    ],
    queryFn: ZarplataSpravochnikService.getAll,
    enabled: !!typeCode
  })

  useEffect(() => {
    setLayout({
      title: t('pages.zarplata'),
      onCreate() {
        dialogToggle.open()
        setSelected(undefined)
      },
      content: SpravochnikFilters
    })
  }, [setLayout, t, dialogToggle.open])

  const handleEdit = (row: Zarplata.Spravochnik) => {
    dialogToggle.open()
    setSelected(row)
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={spravochniks ?? []}
          columnDefs={columnDefs}
          onEdit={handleEdit}
        />
      </ListView.Content>
      <ZarplataSpravochnikDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default ZarplataSpravochnikPage
