import type { ShartnomaGrafikPDFDocumentOptions } from './types'
import type { DocumentOrientation } from '@/common/widget/form'

import { Document, Page, StyleSheet, View } from '@react-pdf/renderer'

import { Flex, Seperator } from '@/common/components/pdf'
import { registerFonts } from '@/common/lib/pdf'

import { PaperSheet } from './paper-sheet'

registerFonts()

export interface ShartnomaGrafikPDFDocumentProps extends ShartnomaGrafikPDFDocumentOptions {
  paddingLeft: number
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  orientation: DocumentOrientation
  singlePage: boolean
}
export const ShartnomaGrafikPDFDocument = ({
  paddingLeft,
  paddingTop,
  paddingRight,
  paddingBottom,
  orientation,
  singlePage,
  ...props
}: ShartnomaGrafikPDFDocumentProps) => {
  return (
    <Document>
      <Page
        size="A4"
        orientation={orientation}
        style={[
          styles.page,
          {
            paddingLeft,
            paddingTop,
            paddingRight,
            paddingBottom
          }
        ]}
      >
        <View style={{ flex: 1 }}>
          <Flex>
            <PaperSheet
              {...props}
              singlePage={singlePage}
            />
            {singlePage ? (
              <>
                <Seperator
                  vertical
                  fullWidth
                />
                <PaperSheet
                  {...props}
                  singlePage={singlePage}
                />
              </>
            ) : null}
          </Flex>
        </View>
      </Page>
    </Document>
  )
}
const styles = StyleSheet.create({
  page: {
    fontSize: 8,
    fontFamily: 'Tinos'
  }
})
