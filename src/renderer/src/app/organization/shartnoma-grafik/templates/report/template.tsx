import type { SheetProps } from './sheet'

import { Document, Page, StyleSheet } from '@react-pdf/renderer'
import { Sheet } from './sheet'
import { registerFonts } from '@/common/lib/pdf'
import { Flex, Seperator } from '@/common/components/pdf'

registerFonts()

type ContractScheduleTemplateProps = SheetProps
const ContractScheduleTemplate = (props: ContractScheduleTemplateProps) => {
  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={styles.page}
      >
        <Flex alignItems="stretch">
          <Sheet {...props} />
          <Seperator
            vertical
            fullWidth
          />
          <Sheet {...props} />
        </Flex>
      </Page>
    </Document>
  )
}
const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    margin: 20,
    fontFamily: 'Tinos'
  }
})

export { ContractScheduleTemplate }
export type { ContractScheduleTemplateProps }
