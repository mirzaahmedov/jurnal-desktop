import type { ColumnDef } from '@/common/components'
import type { Workplace } from '@/common/models/workplace'
import type { FC } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ZarplataSpravochnikType } from '@/app/super-admin/zarplata/spravochnik/config'
import { createZarplataSpravochnik } from '@/app/super-admin/zarplata/spravochnik/service'
import { Button } from '@/common/components/jolly/button'
import { IDCell } from '@/common/components/table/renderers/id'
import { useSpravochnik } from '@/common/features/spravochnik'

import { WorkplaceService } from './service'

export const WorkplaceColumns: ColumnDef<Workplace>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    minWidth: 90
  },
  {
    minWidth: 80,
    key: 'poryadNum',
    header: 'numeric-order'
  },
  {
    minWidth: 300,
    key: 'fio'
  },
  {
    minWidth: 200,
    key: 'spravochnikZarpaltaDoljnostName',
    header: 'doljnost'
  },
  {
    numeric: true,
    minWidth: 130,
    key: 'setka',
    header: 'net'
  },
  {
    numeric: true,
    minWidth: 130,
    key: 'koef',
    header: 'razryad'
  },
  {
    numeric: true,
    minWidth: 130,
    key: 'oklad'
  },
  {
    minWidth: 50,
    key: 'prOk',
    header: 'pr_ok',
    className: 'text-center'
  },
  {
    minWidth: 50,
    key: 'stavka',
    className: 'text-center'
  },
  {
    numeric: true,
    minWidth: 130,
    key: 'okladPrikaz',
    header: 'prikaz_oklad'
  },
  {
    minWidth: 100,
    key: 'spravochnikZarplataIstochnikFinanceName',
    header: 'source_of_finance'
  },
  {
    minWidth: 200,
    key: 'spravochnikSostavName',
    header: 'sostav',
    renderCell: (row) => {
      return <ZarplataSostavCell workplace={row} />
    }
  }
]

const ZarplataSostavCell: FC<{
  workplace: Workplace
}> = ({ workplace }) => {
  const { t } = useTranslation()

  const queryClient = useQueryClient()
  const workplaceUpdateMutation = useMutation({
    mutationFn: WorkplaceService.updateWorkplace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetAll]
      })
    }
  })

  const zarplataSostavSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      title: t('sostav'),
      onChange: (value) => {
        if (!value) {
          return
        }
        workplaceUpdateMutation.mutate({
          id: workplace.id,
          values: {
            ...workplace,
            spravochnikSostavId: value
          }
        })
      },
      params: {
        types_type_code: ZarplataSpravochnikType.Sostav
      }
    })
  )

  return (
    <div className="flex items-center gap-2.5">
      <p>{workplace.spravochnikSostavName}</p>
      <Button
        variant="ghost"
        size="icon"
        onPress={zarplataSostavSpravochnik.open}
        isPending={workplaceUpdateMutation.isPending}
        isDisabled={workplaceUpdateMutation.isPending}
      >
        <Pencil className="btn-icon" />
      </Button>
    </div>
  )
}
