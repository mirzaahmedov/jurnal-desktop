import { Document, Page, StyleSheet } from '@react-pdf/renderer'
import { Flex, Seperator } from '@/common/components/pdf'

import { Sheet } from './sheet'
import type { SheetProps } from './sheet'
import { registerFonts } from '@/common/lib/pdf'

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
        <Flex
          direction="row"
          alignItems="stretch"
          justifyContent="center"
          style={{ width: '100%', maxWidth: '100%' }}
        >
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
    padding: 10,
    fontSize: 8,
    fontFamily: 'Tinos'
  }
})

export { ContractScheduleTemplate }
export type { ContractScheduleTemplateProps }
