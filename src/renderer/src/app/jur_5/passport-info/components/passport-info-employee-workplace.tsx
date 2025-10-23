import type { MainZarplata } from '@/common/models'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ZarplataSpravochnikType } from '@/app/super-admin/zarplata/spravochnik/config'
import { createZarplataSpravochnik } from '@/app/super-admin/zarplata/spravochnik/service'
import { Fieldset, LoadingOverlay } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { useSpravochnik } from '@/common/features/spravochnik'
import { WorkplaceService } from '@/common/features/workplace/service'
import { useToggle } from '@/common/hooks'
import { formatDate, parseLocaleDate } from '@/common/lib/date'

import { ZarplataStavkaOptions } from '../../common/data'
import { PassportInfoAssignPositionDialog } from './passport-info-assign-position-dialog'

export interface EmployeeWorkplaceProps {
  workplace: Pick<
    MainZarplata,
    | 'rayon'
    | 'doljnostName'
    | 'doljnostPrikazNum'
    | 'doljnostPrikazDate'
    | 'spravochnikZarplataIstochnikFinanceName'
    | 'stavka'
    | 'spravochnikSostavName'
  > | null
  mainZarplata: MainZarplata
}
export const EmployeeWorkplace = ({ workplace, mainZarplata }: EmployeeWorkplaceProps) => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { t } = useTranslation()

  const { data: workplaceData, isFetching: isFetchingWorkplace } = useQuery({
    queryKey: [WorkplaceService.QueryKeys.GetById, mainZarplata.workplaceId],
    queryFn: MainZarplataService.getById
  })

  const { mutate: updateMainZarplata, isPending: isUpdating } = useMutation({
    mutationFn: MainZarplataService.update,
    onSuccess: (values) => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetByVacantId]
      })
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, values.id]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetByVacantId]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetById, values.workplaceId]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })
  const { mutate: updateWorkplace, isPending: isUpdatingWorkplace } = useMutation({
    mutationFn: WorkplaceService.updateWorkplace,
    onSuccess: (values) => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetByVacantId]
      })
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, mainZarplata.id]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetByVacantId]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetById, mainZarplata.workplaceId]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  const zarplataIstochnikFinanceSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      title: t('source_of_finance'),
      value: mainZarplata.spravochnikZarplataIstochnikFinanceId,
      onChange: (value) => {
        updateWorkplace({
          id: mainZarplata.workplaceId ?? 0,
          values: {
            ...workplaceData?.data,
            spravochnikSostavId: mainZarplata.spravochnikSostavId,
            spravochnikZarplataIstochnikFinanceId: value ?? 0
          }
        })
      },
      params: {
        types_type_code: ZarplataSpravochnikType.IstochnikFinans
      }
    })
  )

  const zarplataSostavSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      title: t('sostav'),
      value: mainZarplata.spravochnikSostavId,
      onChange: (value) => {
        updateWorkplace({
          id: mainZarplata.workplaceId ?? 0,
          values: {
            ...workplaceData?.data,
            spravochnikZarplataIstochnikFinanceId:
              mainZarplata.spravochnikZarplataIstochnikFinanceId,
            spravochnikSostavId: value ?? 0
          }
        })
      },
      params: {
        types_type_code: ZarplataSpravochnikType.Sostav
      }
    })
  )

  return (
    <>
      <Fieldset
        name={t('shtatka')}
        className="bg-gray-100 rounded-lg gap-2 relative"
      >
        {isUpdatingWorkplace && isFetchingWorkplace ? <LoadingOverlay /> : null}
        <Textarea
          className="bg-white"
          readOnly
          value={workplace?.rayon ?? ''}
        />
        <FormElement label={t('doljnost')}>
          <Input
            readOnly
            value={workplace?.doljnostName ?? ''}
          />
        </FormElement>
        <Button
          className="my-2"
          isPending={isUpdating}
          onClick={() => {
            dialogToggle.open()
          }}
        >
          <UserCheck className="btn-icon icon-start" />
          {t('assign_to_position')}
        </Button>
        <div className="flex items-center gap-2">
          <FormElement
            direction="column"
            label={t('order_number')}
          >
            <Input
              readOnly
              value={workplace?.doljnostPrikazNum ?? ''}
            />
          </FormElement>
          <FormElement
            direction="column"
            label={t('order_date')}
          >
            <JollyDatePicker
              readOnly
              value={formatDate(parseLocaleDate(workplace?.doljnostPrikazDate ?? ''))}
              className=""
              containerProps={{
                className: 'min-w-36'
              }}
            />
          </FormElement>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <FormElement
              direction="column"
              label={t('source_of_finance')}
            >
              <div className="relative">
                <Input
                  readOnly
                  value={workplace?.spravochnikZarplataIstochnikFinanceName ?? ''}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-1/2 -translate-y-1/2 right-2 size-8"
                  onClick={() => zarplataIstochnikFinanceSpravochnik.open()}
                >
                  <Pencil className="btn-icon" />
                </Button>
              </div>
            </FormElement>
          </div>
          <FormElement
            direction="column"
            label={t('stavka')}
          >
            <JollySelect
              isReadOnly
              items={ZarplataStavkaOptions}
              placeholder={t('stavka')}
              selectedKey={workplace?.stavka ?? ''}
              className="w-24"
            >
              {(item) => <SelectItem id={item.value}>{item.value}</SelectItem>}
            </JollySelect>
          </FormElement>
        </div>
        <div className="col-span-full">
          <FormElement
            direction="column"
            label={t('sostav')}
          >
            <div className="relative">
              <Input
                readOnly
                value={workplace?.spravochnikSostavName ?? ''}
              />

              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 -translate-y-1/2 right-2 size-8"
                onClick={() => zarplataSostavSpravochnik.open()}
              >
                <Pencil className="btn-icon" />
              </Button>
            </div>
          </FormElement>
        </div>
      </Fieldset>
      <PassportInfoAssignPositionDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        mainZarplata={mainZarplata}
        onSubmit={({ workplaceId, doljnostPrikazNum, doljnostPrikazDate }) => {
          updateMainZarplata({
            id: mainZarplata.id ?? 0,
            values: {
              ...mainZarplata,
              doljnostPrikazNum,
              doljnostPrikazDate,
              workplaceId
            }
          })
          dialogToggle.close()
        }}
      />
    </>
  )
}
