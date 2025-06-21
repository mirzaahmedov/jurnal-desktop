import { Document, Page, StyleSheet } from '@react-pdf/renderer'

import { Flex, Seperator } from '@/common/components/pdf'
import { registerFonts } from '@/common/lib/pdf'

import { PaperSheet, type PaperSheetProps } from './paper-sheet'

registerFonts()

export interface PorucheniyaPDFDocumentProps extends PaperSheetProps {
  singlePage?: boolean
}
export const PorucheniyaPDFDocument = ({
  singlePage = true,
  ...props
}: PorucheniyaPDFDocumentProps) => {
  if (singlePage) {
    return (
      <Document>
        <Page
          size="A4"
          style={styles.page}
        >
          <Flex
            direction="column"
            alignItems="stretch"
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            <Flex.Item>
              <PaperSheet {...props} />
            </Flex.Item>
            <Seperator />
            <Flex.Item>
              <PaperSheet {...props} />
            </Flex.Item>
          </Flex>
        </Page>
      </Document>
    )
  }
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <PaperSheet {...props} />
      </Page>
      <Page
        size="A4"
        style={styles.page}
      >
        <PaperSheet {...props} />
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
