import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserX } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ZarplataSpravochnikType } from '@/app/super-admin/zarplata/spravochnik/config'
import { createZarplataSpravochnik } from '@/app/super-admin/zarplata/spravochnik/service'
import { FormElement } from '@/common/components/form'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button, type ButtonProps } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useToggle } from '@/common/hooks'
import { formatLocaleDate } from '@/common/lib/format'

import { useSpravochnik } from '../spravochnik'
import { DismissEmployeeFormSchema, defaultDismissEmployeeValues } from './config'
import { MainZarplataService } from './service'

export interface DismissEmployeeProps extends ButtonProps {
  mainZarplataId: number
}
export const DissmisEmployee = ({ mainZarplataId, isPending, ...props }: DismissEmployeeProps) => {
  const { t } = useTranslation()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: defaultDismissEmployeeValues,
    resolver: zodResolver(DismissEmployeeFormSchema)
  })

  const { mutate: dismissEmployee, isPending: isDissmising } = useMutation({
    mutationFn: MainZarplataService.dismissEmployee,
    onSuccess: () => {
      form.reset()
      dialogToggle.close()
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetById, mainZarplataId]
      })
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    dismissEmployee({
      mainId: mainZarplataId,
      prikazFinish: values.prikazFinish,
      dateFinish: formatLocaleDate(values.dateFinish),
      doljnost: values.doljnost
    })
  })

  const doljnostSpravochnik = useSpravochnik(
    createZarplataSpravochnik({
      onChange: (_, selected) => {
        form.setValue('doljnost', selected ? selected.name : '')
      },
      params: {
        types_type_code: ZarplataSpravochnikType.Doljnost
      }
    })
  )

  return (
    <DialogTrigger
      isOpen={dialogToggle.isOpen}
      onOpenChange={dialogToggle.setOpen}
    >
      <Button
        variant="destructive"
        isPending={isDissmising || isPending}
        {...props}
      >
        <UserX className="btn-icon icon-start" /> {t('remove_from_position')}
      </Button>
      <DialogOverlay>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('remove_from_position')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-4 mt-10"
            >
              <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-5">
                <FormField
                  control={form.control}
                  name="doljnost"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('doljnost')}
                    >
                      <Input
                        ref={field.ref}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        onDoubleClick={doljnostSpravochnik.open}
                      />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prikazFinish"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('order_number')}
                    >
                      <Input {...field} />
                    </FormElement>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateFinish"
                  render={({ field }) => (
                    <FormElement
                      grid="1:2"
                      label={t('order_date')}
                    >
                      <JollyDatePicker
                        ref={field.ref}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormElement>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleSubmit}
                >
                  {t('save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
