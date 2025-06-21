import type { Podpis } from '@/common/models'

import { Flex } from '@/common/components/pdf'
import { formatNumber } from '@/common/lib/format'

import { AdditionalInfo, DocInfo, Header, Signatures, Summa, TransactionParty } from './components'

export enum PorucheniyaType {
  NORMAL = 'N0RMAL',
  TAX = 'TAX'
}
export interface PaperSheetProps {
  type: PorucheniyaType

  doc_num: string
  doc_date: string

  debtor_name: string
  debtor_raschet: string
  debtor_inn: string
  debtor_bank: string
  debtor_mfo: string

  creditor_name: string
  creditor_raschet: string
  creditor_raschet_gazna: string
  creditor_inn: string
  creditor_bank: string
  creditor_mfo: string

  summa: number
  summaWords: string
  opisanie?: string
  podpis: Podpis[]
}

export const PaperSheet = ({
  type,
  doc_num,
  doc_date,

  debtor_name,
  debtor_raschet,
  debtor_inn,
  debtor_bank,
  debtor_mfo,

  creditor_name,
  creditor_raschet,
  creditor_raschet_gazna,
  creditor_inn,
  creditor_bank,
  creditor_mfo,

  summa,
  summaWords,
  opisanie,
  podpis
}: PaperSheetProps) => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
    >
      <Header doc_num={doc_num} />

      <Flex
        direction="column"
        alignItems="stretch"
        style={{
          gap: 2
        }}
      >
        <DocInfo doc_date={doc_date} />

        <TransactionParty
          type="debtor"
          name={debtor_name}
          raschet={debtor_raschet}
          inn={debtor_inn}
          bank={debtor_bank}
          mfo={debtor_mfo}
        />

        <Summa summa={formatNumber(summa)} />

        <TransactionParty
          type="creditor"
          name={creditor_name}
          raschet={creditor_raschet}
          inn={creditor_inn}
          bank={creditor_bank}
          mfo={creditor_mfo}
        />

        <AdditionalInfo
          type={type}
          summaWords={summaWords}
          creditor_raschet_gazna={creditor_raschet_gazna}
          opisanie={opisanie ?? ' '}
        />

        <Signatures podpis={podpis} />
      </Flex>
    </Flex>
  )
}
