import type { MaterialPrixodProvodka, Podpis } from '@/common/models'
import type { FC } from 'react'

import { Document, Page, StyleSheet } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

import { Header } from './components/header'
import { ProductsTable } from './components/products-table'
import { Signatures } from './components/signatures'

registerFonts()

export interface AktPriyomReportProps {
  docNum: string
  docDate: string
  regionName: string
  organName: string
  receiverName: string
  note: string
  headerText: string
  products: MaterialPrixodProvodka[]
  podpis: Podpis[]
  dovernost: string
}
export const AktPriyomReport: FC<AktPriyomReportProps> = ({
  docNum,
  docDate,
  headerText,
  products,
  regionName,
  organName,
  receiverName,
  note,
  podpis
}) => {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <Header
          regionName={regionName}
          docNum={docNum}
          docDate={docDate}
          organName={organName}
          receiverName={receiverName}
          note={note}
          headerText={headerText}
        />
        <ProductsTable products={products ?? []} />
        <Signatures podpis={podpis ?? []} />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Tinos',
    fontSize: 10,
    paddingHorizontal: 20,
    paddingVertical: 40
  }
})
