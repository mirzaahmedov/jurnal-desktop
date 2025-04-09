import type { BankRasxodFormValues } from '../service'
import type { MainSchet, Organization } from '@/common/models'
import type { ButtonHTMLAttributes } from 'react'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu'
import { GenerateFile } from '@/common/features/file'
import { useToggle } from '@/common/hooks'
import { formatLocaleDate } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { PorucheniyaPDFDocument } from '../report'
import { PorucheniyaType } from '../report/PaperSheet'

type PorucheniyaDropdownProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  rasxod: BankRasxodFormValues
  main_schet: MainSchet
  organization: Organization
}
export const PorucheniyaDropdown = ({
  rasxod,
  main_schet,
  organization
}: PorucheniyaDropdownProps) => {
  const dropdownToggle = useToggle()

  const { t, i18n } = useTranslation()

  return (
    <DropdownMenu open={dropdownToggle.isOpen}>
      <DropdownMenuTrigger
        asChild
        onClick={dropdownToggle.open}
      >
        <Button variant="ghost">
          <Download className="btn-icon icon-start" />
          <span className="titlecase">{t('porucheniya')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        onInteractOutside={dropdownToggle.close}
      >
        <DropdownMenuItem>
          <GenerateFile
            fileName={`поручения-${rasxod.doc_num}.pdf`}
            buttonText={t('create-porucheniya')}
            className="w-full inline-flex items-center justify-start"
          >
            <PorucheniyaPDFDocument
              type={PorucheniyaType.NORMAL}
              doc_num={rasxod.doc_num}
              doc_date={formatLocaleDate(rasxod.doc_date)}
              debtor_name={main_schet.tashkilot_nomi}
              debtor_raschet={main_schet.account_number}
              debtor_inn={main_schet.tashkilot_inn}
              debtor_bank={main_schet.tashkilot_bank}
              debtor_mfo={main_schet.tashkilot_mfo}
              creditor_name={organization.name}
              creditor_raschet={
                organization.account_numbers.find(
                  (schet) => schet.id == rasxod.organization_by_raschet_schet_id
                )?.raschet_schet ?? ''
              }
              creditor_raschet_gazna={
                organization.gaznas.find(
                  (schet) => schet.id == rasxod.organization_by_raschet_schet_gazna_id
                )?.raschet_schet_gazna ?? ''
              }
              creditor_inn={organization.inn}
              creditor_bank={organization.bank_klient}
              creditor_mfo={organization.mfo}
              summa={rasxod.summa!}
              summaWords={numberToWords(rasxod.summa!, i18n.language)}
              opisanie={rasxod.opisanie ?? ' '}
              rukovoditel={rasxod.rukovoditel ?? ' '}
              glav_buxgalter={rasxod.glav_buxgalter ?? ' '}
            />
          </GenerateFile>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <GenerateFile
            fileName={`поручения-налог-${rasxod.doc_num}.pdf`}
            buttonText={t('create-porucheniya-tax')}
            className="w-full inline-flex items-center justify-start"
          >
            <PorucheniyaPDFDocument
              type={PorucheniyaType.TAX}
              doc_num={rasxod.doc_num}
              doc_date={formatLocaleDate(rasxod.doc_date)}
              debtor_name={main_schet.tashkilot_nomi}
              debtor_raschet={main_schet.account_number}
              debtor_inn={main_schet.tashkilot_inn}
              debtor_bank={main_schet.tashkilot_bank}
              debtor_mfo={main_schet.tashkilot_mfo}
              creditor_name={organization.name}
              creditor_raschet={
                organization.account_numbers.find(
                  (schet) => schet.id == rasxod.organization_by_raschet_schet_id
                )?.raschet_schet ?? ''
              }
              creditor_raschet_gazna={
                organization.gaznas.find(
                  (schet) => schet.id == rasxod.organization_by_raschet_schet_gazna_id
                )?.raschet_schet_gazna ?? ''
              }
              creditor_inn={organization.inn}
              creditor_bank={organization.bank_klient}
              creditor_mfo={organization.mfo}
              summa={rasxod.summa!}
              summaWords={numberToWords(rasxod.summa!, i18n.language)}
              opisanie={rasxod.opisanie ?? ' '}
              rukovoditel={rasxod.rukovoditel ?? ' '}
              glav_buxgalter={rasxod.glav_buxgalter ?? ' '}
            />
          </GenerateFile>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
