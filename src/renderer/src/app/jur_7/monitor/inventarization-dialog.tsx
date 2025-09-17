import type { DialogTriggerProps } from 'react-aria-components'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormElement } from '@/common/components/form'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form } from '@/common/components/ui/form'
import { DownloadFile } from '@/common/features/file'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import { createResponsibleSpravochnik } from '../responsible/service'

export interface InventarizationDialogProps extends Omit<DialogTriggerProps, 'children'> {
  to: string
  year: number
  month: number
  budjet_id: number
  main_schet_id: number
  region_id?: number
}
export const InventarizationDialog = ({
  to,
  year,
  month,
  budjet_id,
  main_schet_id,
  region_id,
  ...props
}: InventarizationDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    resolver: zodResolver(AktReportFormSchema),
    defaultValues
  })

  const responsibleSpravochnik = useSpravochnik(
    createResponsibleSpravochnik({
      value: form.watch('responsible_id'),
      onChange: (value) => {
        form.setValue('responsible_id', value ?? 0, { shouldValidate: true })
      }
    })
  )

  return (
    <DialogTrigger {...props}>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('inventarization')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {})}
              className="space-y-4 mt-2.5"
            >
              <FormElement
                direction="column"
                label={t('responsible')}
              >
                <SpravochnikInput
                  readOnly
                  {...responsibleSpravochnik}
                  getInputValue={(value) =>
                    value ? `${value.fio} (${value.spravochnik_podrazdelenie_jur7_name})` : ''
                  }
                />
              </FormElement>

              <DialogFooter>
                <DownloadFile
                  url={`/jur_7/monitoring/act/report`}
                  fileName={`${t('akt')} ${t('report').toLowerCase()}.xlsx`}
                  buttonText={t('download')}
                  isDisabled={!form.watch('responsible_id')}
                  params={{
                    to,
                    year,
                    month,
                    budjet_id,
                    main_schet_id,
                    excel: true,
                    region_id,
                    responsible_id: form.watch('responsible_id')
                  }}
                  variant="default"
                />
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const AktReportFormSchema = z.object({
  responsible_id: z.number().min(0)
})

const defaultValues = {
  responsible_id: 0
}
