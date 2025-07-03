import type { MainZarplata } from '@/common/models'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { WorkplaceService } from '@/common/features/workplace/service'
import { useToggle } from '@/common/hooks'

import { ZarplataStavkaOptions } from '../common/data'
import { AssignEmployeePositionDialog } from './assign-employee-position-dialog'

export interface EmployeeWorkplaceProps {
  mainZarplata: MainZarplata
}
export const EmployeeWorkplace = ({ mainZarplata }: EmployeeWorkplaceProps) => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const { t } = useTranslation()
  const { mutate: updateMainZarplata, isPending: isUpdating } = useMutation({
    mutationFn: MainZarplataService.update,
    onSuccess: (values) => {
      toast.success(t('update_success'))
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, values.id]
      })
      queryClient.invalidateQueries({
        queryKey: [WorkplaceService.QueryKeys.GetAll]
      })
    },
    onError: () => {
      toast.error(t('update_failed'))
    }
  })

  return (
    <>
      <Fieldset
        name={t('shtatka')}
        className="bg-gray-100 rounded-lg gap-2 relative"
      >
        <Textarea
          className="bg-white"
          readOnly
          value={mainZarplata?.rayon ?? ''}
        />
        <FormElement label={t('doljnost')}>
          <Input
            readOnly
            value={mainZarplata?.doljnostName ?? ''}
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
              value={mainZarplata?.doljnostPrikazNum ?? ''}
            />
          </FormElement>
          <FormElement
            direction="column"
            label={t('order_date')}
          >
            <JollyDatePicker
              readOnly
              value={mainZarplata?.doljnostPrikazDate ?? ''}
            />
          </FormElement>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <FormElement
              direction="column"
              label={t('source_of_finance')}
            >
              <Input
                readOnly
                value={mainZarplata?.spravochnikZarplataIstochnikFinanceName ?? ''}
              />
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
              selectedKey={mainZarplata?.stavka ?? ''}
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
            <Input
              readOnly
              value={mainZarplata?.spravochnikSostavName ?? ''}
            />
          </FormElement>
        </div>
      </Fieldset>
      <AssignEmployeePositionDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        mainZarplata={mainZarplata}
        onSubmit={({ workplaceId, doljnostPrikazNum, doljnostPrikazDate }) => {
          updateMainZarplata({
            id: mainZarplata.id,
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
