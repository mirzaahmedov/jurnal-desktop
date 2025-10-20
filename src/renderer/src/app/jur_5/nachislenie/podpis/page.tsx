import type { CustomCellRendererProps } from 'ag-grid-react'

import { useEffect, useState } from 'react'

import { RiDeleteBinLine, RiEdit2Line } from '@remixicon/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GridTable } from '@/common/components/grid-table/table'
import { Button } from '@/common/components/jolly/button'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'

import { NachislenieTabs } from '../nachislenie-tabs'
import { ZarplataPodpisDialog } from './podpis-dialog'
import { ZarplataPodpisService, ZarplataQueryKeys } from './service'

export const ZarplataPodpisPage = () => {
  const modalToggle = useToggle()
  const setLayout = useLayout()
  const queryClient = useQueryClient()

  const [podpisData, setPodpisData] = useState()

  const { t } = useTranslation(['app'])
  const { data } = useQuery({
    queryKey: ZarplataQueryKeys.getAll(),
    queryFn: ZarplataPodpisService.getAll
  })

  const podpisDelete = useMutation({
    mutationFn: ZarplataPodpisService.delete
  })

  useEffect(() => {
    setLayout({
      title: t('pages.podpis'),
      breadcrumbs: [
        {
          title: t('zarplata')
        }
      ],
      content: NachislenieTabs,
      onCreate: () => {
        modalToggle.open()
        setPodpisData(undefined)
      }
    })
  }, [t, modalToggle, setLayout])

  return (
    <>
      <GridTable
        rowData={data || []}
        columnDefs={[
          { headerName: 'ID', field: 'id', width: 80 },
          { headerName: 'Должность', field: 'position', flex: 1 },
          { headerName: 'ФИО', field: 'fio', flex: 1 },
          { headerName: 'Тип', field: 'type', flex: 1 },
          {
            headerName: '',
            field: 'actions',
            cellRenderer: ({ data }: CustomCellRendererProps) => {
              return (
                <div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setPodpisData(data)
                      modalToggle.open()
                    }}
                  >
                    <RiEdit2Line className="btn-icon" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      podpisDelete.mutate(data.id, {
                        onSuccess: () => {
                          queryClient.invalidateQueries({
                            queryKey: ZarplataQueryKeys.getAll()
                          })
                        }
                      })
                    }}
                  >
                    <RiDeleteBinLine className="btn-icon" />
                  </Button>
                </div>
              )
            }
          }
        ]}
      />
      <ZarplataPodpisDialog
        isOpen={modalToggle.isOpen}
        onOpenChange={modalToggle.setOpen}
        podpisData={podpisData}
      />
    </>
  )
}
