import type { BankRasxod, MainSchet, Organization, Podpis } from '@/common/models'

import { type ButtonHTMLAttributes, useState } from 'react'

import { CircleX, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { JollySelect, SelectItem } from '@/common/components/jolly/select'
import { Label } from '@/common/components/ui/label'
import { GenerateFile } from '@/common/features/file'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
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

  const [accountId, setAccountId] = useState<number>()
  const [accountNumber, setAccountNumber] = useState<string>('')
  const [gaznaId, setGaznaId] = useState<number>()
  const [gaznaNumber, setGaznaNumber] = useState<string>('')

  const { t, i18n } = useTranslation()

  const summa = rasxod?.summa ? rasxod?.summa : rasxod?.tulanmagan_summa

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      onChange: (_, selected) => {
        setAccountId(undefined)
        setAccountNumber('')
        setGaznaId(undefined)
        setGaznaNumber('')
        if (selected?.account_numbers && (selected?.account_numbers?.length ?? 0) > 0) {
          setAccountId(selected.account_numbers[0].id)
          setAccountNumber(selected.account_numbers[0].raschet_schet)
        }
      }
    })
  )

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
            <SpravochnikInput
              {...organSpravochnik}
              getInputValue={(selected) => (selected ? selected.name : '-')}
            />
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Label className="w-full">{t('raschet-schet')}</Label>
            <JollySelect
              isDisabled={organSpravochnik.loading}
              items={organSpravochnik.selected?.account_numbers ?? []}
              selectedKey={accountId || null}
              onSelectionChange={(value) => {
                setAccountId((value as number) ?? undefined)
                const item = organSpravochnik.selected?.account_numbers?.find((a) => a.id === value)
                if (item) {
                  setAccountNumber(item.raschet_schet)
                }
              }}
              className="flex-1"
              placeholder=""
            >
              {(item) => (
                <SelectItem
                  id={item.id}
                  key={item.id}
                >
                  {item.raschet_schet}
                </SelectItem>
              )}
            </JollySelect>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-slate-400 hover:text-red-500"
              onClick={() => {
                setAccountId(undefined)
                setAccountNumber('')
              }}
            >
              <CircleX />
            </Button>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Label className="w-full">{t('raschet-schet-gazna')}</Label>
            <JollySelect
              isDisabled={organSpravochnik.loading}
              items={organSpravochnik.selected?.gaznas ?? []}
              selectedKey={gaznaId || null}
              onSelectionChange={(value) => {
                setGaznaId((value as number) ?? undefined)
                const item = organSpravochnik.selected?.gaznas?.find((a) => a.id === value)
                if (item) {
                  setGaznaNumber(item.raschet_schet_gazna)
                }
              }}
              className="flex-1"
              placeholder=""
            >
              {(item) => (
                <SelectItem
                  id={item.id}
                  key={item.id}
                >
                  {item.raschet_schet_gazna}
                </SelectItem>
              )}
            </JollySelect>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-slate-400 hover:text-red-500"
              onClick={() => {
                setGaznaId(undefined)
                setGaznaNumber('')
              }}
            >
              <CircleX />
            </Button>
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
                creditor_name={
                  organSpravochnik.selected ? organSpravochnik.selected.name : organization.name
                }
                creditor_raschet={
                  organSpravochnik.selected ? accountNumber : (account_number ?? '')
                }
                creditor_raschet_gazna={
                  organSpravochnik.selected ? gaznaNumber : (account_number_gazna ?? '')
                }
                creditor_inn={
                  organSpravochnik.selected ? organSpravochnik.selected.inn : organization.inn
                }
                creditor_bank={
                  organSpravochnik.selected
                    ? organSpravochnik.selected.bank_klient
                    : organization.bank_klient
                }
                creditor_mfo={
                  organSpravochnik.selected ? organSpravochnik.selected.mfo : organization.mfo
                }
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
                creditor_name={
                  organSpravochnik.selected ? organSpravochnik.selected.name : organization.name
                }
                creditor_raschet={
                  organSpravochnik.selected ? accountNumber : (account_number ?? '')
                }
                creditor_raschet_gazna={
                  organSpravochnik.selected ? gaznaNumber : (account_number_gazna ?? '')
                }
                creditor_inn={
                  organSpravochnik.selected ? organSpravochnik.selected.inn : organization.inn
                }
                creditor_bank={
                  organSpravochnik.selected
                    ? organSpravochnik.selected.bank_klient
                    : organization.bank_klient
                }
                creditor_mfo={
                  organSpravochnik.selected ? organSpravochnik.selected.mfo : organization.mfo
                }
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
