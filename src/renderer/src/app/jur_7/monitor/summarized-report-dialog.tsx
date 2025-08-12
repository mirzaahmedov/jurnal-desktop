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

export interface SummarizedReportDialogProps extends Omit<DialogTriggerProps, 'children'> {
  withResponsible?: boolean
  to: string
  year: number
  month: number
  budjet_id: number
  main_schet_id: number
  region_id?: number
}
export const SummarizedReportDialog = ({
  withResponsible = true,
  to,
  year,
  month,
  budjet_id,
  main_schet_id,
  region_id,
  ...props
}: SummarizedReportDialogProps) => {
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
            <DialogTitle>{t('summarized_circulation')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => {})}
              className="space-y-4 mt-2.5"
            >
              {withResponsible ? (
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
              ) : null}

              <DialogFooter>
                <DownloadFile
                  url="jur_7/monitoring/turnover/report"
                  fileName={`${t('summarized_circulation')}_${t('by_responsible')}_${month}-${year}.xlsx`}
                  buttonText={`${t('summarized_circulation')} (${t('by_responsible')})`}
                  params={{
                    to,
                    year,
                    month,
                    budjet_id,
                    main_schet_id,
                    responsible_id: withResponsible
                      ? form.watch('responsible_id') || undefined
                      : undefined,
                    region_id,
                    excel: true,
                    iznos: true
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
  title: z.string().nonempty(),
  comment: z.string().nonempty(),
  responsible_id: z.number().min(0)
})

const defaultValues = {
  title: '',
  comment: '',
  responsible_id: 0
}
