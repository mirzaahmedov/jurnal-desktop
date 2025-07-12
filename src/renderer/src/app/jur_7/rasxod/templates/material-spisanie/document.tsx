import type { MainSchet, MaterialRasxod } from '@/common/models'

import { Document, Page, StyleSheet } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

import { Header } from './header'
import { ProvodkaTable } from './provodka-table'
import { Signatures } from './signatures'
import { TransactionParties } from './transaction-parties'

registerFonts()

export interface MaterialSpisaniePDFDocumentProps {
  rasxod: MaterialRasxod
  mainSchet: MainSchet
}
export const MaterialSpisaniePDFDocument = ({
  rasxod,
  mainSchet
}: MaterialSpisaniePDFDocumentProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Header
          sender={mainSchet.tashkilot_nomi}
          doc_num={rasxod.doc_num}
          doc_date={rasxod.doc_date}
        />
        <TransactionParties
          receiver="Хисобдан чикариш"
          sender={mainSchet.tashkilot_nomi}
          basis="Оборотний ведомостга асосан"
          attorney_num={rasxod.doverennost ?? ' '}
          requirement_num=""
          doc_date={rasxod.doc_date}
        />
        <ProvodkaTable
          rows={rasxod.childs.map((child) => ({
            count: child.kol,
            name: child.product.name,
            unit: child.product.edin,
            price: child.sena,
            credit: `${child.debet_schet} ${child.debet_sub_schet}`,
            debet: `${child.kredit_schet} ${child.kredit_sub_schet}`,
            prixod_date: child.data_pereotsenka,
            sum: child.summa
          }))}
        />
        <Signatures />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    paddingVertical: 25,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: 'Tinos'
  }
})
