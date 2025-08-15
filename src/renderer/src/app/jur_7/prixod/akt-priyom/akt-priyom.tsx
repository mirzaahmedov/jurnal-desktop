import type { MaterialPrixodProvodka } from '@/common/models'
import type { FC } from 'react'

import { Document, Page, StyleSheet } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

import { Footer } from './components/footer'
import { Header } from './components/header'
import { ProductsTable } from './components/products-table'
import { type CommissionMember, Signatures } from './components/signatures'

registerFonts()

export interface AktPriyomReportProps {
  docNum: string
  docDate: string
  headerText: string
  products: MaterialPrixodProvodka[]
  commissionBoss: CommissionMember[]
  commissionMembers: CommissionMember[]
  commissionSecretary: CommissionMember[]
  dovernost: string
}
export const AktPriyomReport: FC<AktPriyomReportProps> = ({
  docNum,
  docDate,
  headerText,
  products,
  commissionBoss,
  commissionMembers,
  commissionSecretary,
  dovernost
}) => {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <Header
          docNum={docNum}
          headerText={headerText}
        />
        <ProductsTable products={products ?? []} />
        <Signatures
          commissionBoss={commissionBoss ?? []}
          commissionMembers={commissionMembers ?? []}
          commissionSecretary={commissionSecretary ?? []}
        />
        <Footer
          docDate={docDate}
          dovernost={dovernost}
        />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Tinos',
    fontSize: 10,
    paddingHorizontal: 20,
    paddingVertical: 20
  }
})
