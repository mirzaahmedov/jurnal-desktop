import type { ShartnomaGrafikOptions } from './types'
import type { FC } from 'react'

import { Document, Page, StyleSheet, View } from '@react-pdf/renderer'

import { Flex } from '@/common/components/pdf'
import { registerFonts } from '@/common/lib/pdf'

import { PaperSheet } from './paper-sheet'

registerFonts()

export interface ShartnomaGrafikPDFV2Props extends ShartnomaGrafikOptions {}
export const ShartnomaGrafikPDFV2: FC<ShartnomaGrafikPDFV2Props> = (
  props: ShartnomaGrafikPDFV2Props
) => {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.pageWrapper}
      >
        <View style={{ flex: 1 }}>
          <Flex>
            <PaperSheet
              {...props}
              singlePage={false}
            />
          </Flex>
        </View>
      </Page>
    </Document>
  )
}
const styles = StyleSheet.create({
  pageWrapper: {
    fontSize: 10,
    fontFamily: 'Tinos',
    paddingHorizontal: 50,
    paddingVertical: 20
  }
})
