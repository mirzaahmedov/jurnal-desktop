import { Document, Page, StyleSheet } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

import { Header } from './components/header'
import { Parties } from './components/parties'
import { ProvodkaTable } from './components/provodka-table'

registerFonts()

export const SchetFakturaPDF = () => {
  return (
    <Document>
      <Page
        wrap
        size="A4"
        orientation="landscape"
        style={styles.page}
      >
        <Header />
        <Parties />
        <ProvodkaTable />
      </Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Tinos',
    fontSize: 10,
    lineHeight: 1.3,
    paddingHorizontal: 20,
    paddingVertical: 20
  }
})
