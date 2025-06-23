import type { DialogProps } from '@radix-ui/react-dialog'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormElement } from '@/common/components/form'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/common/components/ui/dialog'
import { Form } from '@/common/components/ui/form'
import { DownloadFile } from '@/common/features/file'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

import { createResponsibleSpravochnik } from '../responsible/service'

export interface AktReportDialogProps extends DialogProps {
  to: string
  year: number
  month: number
  budjet_id: number
  main_schet_id: number
}
export const AktReportDialog = ({
  to,
  year,
  month,
  budjet_id,
  main_schet_id,
  ...props
}: AktReportDialogProps) => {
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
    <Dialog
      {...props}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => {
            document.body.style.pointerEvents = 'all'
          }, 500)
        }
        props.onOpenChange?.(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('akt')} {t('report').toLowerCase()}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => {})}
            className="space-y-4"
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
                buttonText={`${t('akt')} ${t('report').toLowerCase()}`}
                isDisabled={!form.watch('responsible_id')}
                params={{
                  to,
                  year,
                  month,
                  budjet_id,
                  main_schet_id,
                  excel: true,
                  responsible_id: form.watch('responsible_id')
                }}
                variant="default"
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const AktReportFormSchema = z.object({
  responsible_id: z.number().min(0)
})

const defaultValues = {
  responsible_id: 0
}
