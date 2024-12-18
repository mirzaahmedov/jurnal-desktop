import type { MainSchet, Organization } from '@/common/models'
import type { RasxodPayloadType } from '../service'

import { Document, Page, StyleSheet } from '@react-pdf/renderer'
import { PorucheniyaForm } from './porucheniya'
import { registerFonts } from '@/common/lib/pdf'
import { Flex, Seperator } from '@/common/components/pdf'
import { formatLocaleDate } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

registerFonts()

type BankRasxodPorucheniyaTemplateProps = {
  type: 'normal' | 'tax'
  rasxod: RasxodPayloadType
  main_schet: MainSchet
  organization: Organization
}
const BankRasxodPorucheniyaTemplate = ({
  type,
  rasxod,
  main_schet,
  organization
}: BankRasxodPorucheniyaTemplateProps) => {
  if (!rasxod.summa) {
    throw new Error('Сумма обязательна')
  }

  const Porucheniya = () => (
    <PorucheniyaForm
      type={type}
      doc_num={rasxod.doc_num}
      doc_date={formatLocaleDate(rasxod.doc_date)}
      debtor_name={main_schet.tashkilot_nomi}
      debtor_raschet={main_schet.account_number}
      debtor_inn={main_schet.tashkilot_inn}
      debtor_bank={main_schet.tashkilot_bank}
      debtor_mfo={main_schet.tashkilot_mfo}
      creditor_name={organization.name}
      creditor_raschet={organization.raschet_schet}
      creditor_raschet_gazna={organization.raschet_schet_gazna}
      creditor_inn={organization.inn}
      creditor_bank={organization.bank_klient}
      creditor_mfo={organization.mfo}
      summa={rasxod.summa!}
      summaWords={numberToWords(rasxod.summa!)}
      opisanie={rasxod.opisanie ?? ' '}
      rukovoditel={rasxod.rukovoditel ?? ' '}
      glav_buxgalter={rasxod.glav_buxgalter ?? ' '}
    />
  )

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
        wrap={false}
      >
        <Flex
          direction="column"
          alignItems="stretch"
          style={{ width: '100%', height: '100%' }}
        >
          <Flex.Item>
            <Porucheniya />
          </Flex.Item>
          <Seperator />
          <Flex.Item>
            <Porucheniya />
          </Flex.Item>
        </Flex>
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Tinos',
    fontSize: 10,
    paddingHorizontal: 30,
    paddingVertical: 20
  }
})

export { BankRasxodPorucheniyaTemplate }
