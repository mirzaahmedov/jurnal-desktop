import type { DialogTriggerProps } from 'react-aria-components'

import { zodResolver } from '@hookform/resolvers/zod'
import { Download } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
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

export interface PriyemSdachiDialogProps extends Omit<DialogTriggerProps, 'children'> {
  from: string
  to: string
  year: number
  month: number
  budjet_id: number
  main_schet_id: number
}
export const PriyemSdachiDialog = ({
  from,
  to,
  year,
  month,
  budjet_id,
  main_schet_id,
  ...props
}: PriyemSdachiDialogProps) => {
  const { t } = useTranslation()

  const form = useForm({
    resolver: zodResolver(PriyemSdachiFormSchema),
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
      <Button
        variant="ghost"
        IconStart={Download}
      >
        {t('priyem_sdachi')}
      </Button>
      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('priyem_sdachi')}</DialogTitle>
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
                  fileName={`material_${t('cap')}_${month}-${year}.xlsx`}
                  url="/jur_7/monitoring/material/report2"
                  params={{
                    from: from,
                    to: to,
                    year,
                    month,
                    budjet_id,
                    main_schet_id,
                    responsible_id: responsibleSpravochnik.selected?.id || undefined,
                    excel: true
                  }}
                  buttonText={t('priyem_sdachi')}
                  isDisabled={!responsibleSpravochnik.selected}
                />
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}

const PriyemSdachiFormSchema = z.object({
  responsible_id: z.number().min(0)
})

const defaultValues = {
  responsible_id: 0
}
