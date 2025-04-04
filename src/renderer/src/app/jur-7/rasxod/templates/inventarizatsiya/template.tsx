import { Document, Page, StyleSheet } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

registerFonts()

const InventarizatsiyaTemplate = () => {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      ></Page>
    </Document>
  )
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Tinos',
    paddingVertical: 20,
    paddingHorizontal: 25,
    fontSize: 11,
    letterSpacing: 0.3
  }
})

export { InventarizatsiyaTemplate }
