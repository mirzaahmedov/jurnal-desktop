import type { DialogTriggerProps } from 'react-aria-components'

import { useTranslation } from 'react-i18next'

import { createResponsibleSpravochnik } from '@/app/jur_7/responsible/service'
import { FormElementUncontrolled } from '@/common/components/form/form-element-uncontrolled'
import { ReportCommentModalProvider } from '@/common/components/reports/report-comment-modal-provider'
import { DownloadFile } from '@/common/features/file'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'

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
  main_schet_id
}: PriyemSdachiDialogProps) => {
  const { t } = useTranslation()

  const responsibleSpravochnik = useSpravochnik(createResponsibleSpravochnik({}))

  return (
    <ReportCommentModalProvider
      reportId="priyem-sdachi"
      reportTitle={t('priyem_sdachi')}
      buttonText={t('priyem_sdachi')}
      beforeContent={
        <FormElementUncontrolled
          label={t('responsible')}
          direction="column"
        >
          <SpravochnikInput
            readOnly
            {...responsibleSpravochnik}
            getInputValue={(selected) =>
              selected ? `${selected.fio} (${selected.spravochnik_podrazdelenie_jur7_name})` : ''
            }
          />
        </FormElementUncontrolled>
      }
    >
      {({ comment }) => (
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
            _comment: comment,
            excel: true
          }}
          buttonText={t('priyem_sdachi')}
          isDisabled={!responsibleSpravochnik.selected}
        />
      )}
    </ReportCommentModalProvider>
  )
}
