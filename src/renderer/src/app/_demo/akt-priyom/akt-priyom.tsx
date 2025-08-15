import type { MaterialPrixodProvodka, Podpis } from '@/common/models'
import type { FC } from 'react'

import { Document, Page, StyleSheet } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

import { Header } from './components/header'

registerFonts()

export interface AktPriyomReportProps {
  docNum: string
  docDate: string
  headerText: string
  products: MaterialPrixodProvodka[]
  podpises: Podpis[]
  dovernost: string
}
export const AktPriyomReport: FC<AktPriyomReportProps> = ({
  docNum,
  docDate,
  headerText,
  products,
  podpises,
  dovernost
}) => {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <Header docNum={docNum} />
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
