import type { BankRasxod, MainSchet, Organization, Podpis } from '@/common/models'

import { type ButtonHTMLAttributes, useEffect, useState } from 'react'

import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Input } from '@/common/components/ui/input'
import { Label } from '@/common/components/ui/label'
import { GenerateFile } from '@/common/features/file'
import { useToggle } from '@/common/hooks'
import { formatLocaleDate } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

import { PorucheniyaPDFDocument } from './report'
import { PorucheniyaType } from './report/PaperSheet'

interface PorucheniyaDialogProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  rasxod: BankRasxod
  main_schet: MainSchet
  organization: Organization
  account_number?: string
  account_number_gazna?: string
  podpis: Podpis[]
}
export const PorucheniyaDialog = ({
  rasxod,
  main_schet,
  organization,
  account_number,
  account_number_gazna,
  podpis
}: PorucheniyaDialogProps) => {
  const dropdownToggle = useToggle()

  const [value, setValue] = useState('')

  const { t, i18n } = useTranslation()

  useEffect(() => {
    setValue(organization?.name ?? '')
  }, [organization])

  const summa = rasxod?.summa ? rasxod?.summa : rasxod?.tulanmagan_summa

  return (
    <DialogTrigger
      isOpen={dropdownToggle.isOpen}
      onOpenChange={dropdownToggle.setOpen}
    >
      <Button variant="ghost">
        <Download className="btn-icon mr-2" />
        <span className="titlecase">{t('porucheniya')}</span>
      </Button>

      <DialogOverlay>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('porucheniya')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-1">
            <Label>{t('organization')}</Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-5">
            <GenerateFile
              fileName={`${t('porucheniya')}-${rasxod.doc_num}.pdf`}
              buttonText={t('porucheniya')}
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
                creditor_name={value}
                creditor_raschet={account_number ?? ''}
                creditor_raschet_gazna={account_number_gazna ?? ''}
                creditor_inn={organization.inn}
                creditor_bank={organization.bank_klient}
                creditor_mfo={organization.mfo}
                summa={summa}
                summaWords={numberToWords(summa, i18n.language)}
                opisanie={rasxod.opisanie ?? ' '}
                podpis={podpis}
              />
            </GenerateFile>
            <GenerateFile
              fileName={`${t('porucheniya_tax')}-${rasxod.doc_num}.pdf`}
              buttonText={t('porucheniya_tax')}
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
                creditor_name={value}
                creditor_raschet={account_number ?? ''}
                creditor_raschet_gazna={account_number_gazna ?? ''}
                creditor_inn={organization.inn}
                creditor_bank={organization.bank_klient}
                creditor_mfo={organization.mfo}
                summa={summa}
                summaWords={numberToWords(summa, i18n.language)}
                opisanie={rasxod.opisanie ?? ' '}
                podpis={podpis}
              />
            </GenerateFile>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
