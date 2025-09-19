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
      defaultValue={defaultComment}
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

const defaultComment = `Komissiya  raisi: Boshqara boshlig'ining ma'naviy-ma rifiy ishlar va kadrlar bilan  ta'minlash bo yicha o'rinbosar mayor_ M.Man
surov.     Komissiya a'zolari: Tezkor  boshqaruy markazi boshlig'i podpolkovnik A.Bekpolatov, Kadrlar bo'limi  boshlig'i podpolkovnik A Kinatb
ekov, Moliya-     iqtisod bo'limi boshlig'i  podpolkovnik F.Turayev, Tezkor bo'limi boshlig'i mayor X Subanov,  Moddiy-texnik ta'minot bo'limi boshlig'i 
kapitan N.Uzakbayev,     Ish yuritish va arxivlash  bo"linmasi boshlig'i l.v.b ka
tta leytenanti O.Toxtiyev.     Komissiya kotibi: Angren  shahar FVB bux
galteri oddiy askar A Jo'raboyev     Toshkent viloyati Favqulodda  vaziyatlar boshqana boshlig'i podpolkovnik A Alimatov 2025 - yil 31 - iyul  387 
- sonli (saf boyicha) Toshkent viloyati     Favqulodda vaziyatlar  boshqarmasi Yuqori Chirchiq tumani Favqulodda vaziyatlar bo'limi  24-kasbiylashtiri
lgan yong'in-qutqaruv qismi boshlig'i lovozimi     bo 'yicha tovar-moddiy  boyliklar hamda hujjatlarni mayor Sh.Teshaboyevdan Yuqori Chirchiq tumani  Favqul
odda vaziyatlar bo'limi 24-kasbiylashtirlgan yong'in-     qutqaruv qismi boshlig'i I  darajali serjant O Qurbonaliyevga quyidagi invent

ar ashyolarni topshirish va  qabul qilib olish dalolatnomasi`
