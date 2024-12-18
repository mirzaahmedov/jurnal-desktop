import type { PodvodkaType } from './components/podvodka'

import { Document, Page, StyleSheet, View } from '@react-pdf/renderer'
import { Flex, Seperator } from '@/common/components/pdf'
import { KassaPrixodOrder } from './order'
import { KassaPrixodReceipt } from './receipt'
import { registerFonts } from '@/common/lib/pdf'

registerFonts()

type KassaPrixodOrderTemplateProps = {
  doc_num: string
  doc_date: string
  fio: string
  workplace: string
  opisanie: string
  summa: string
  summaWords: string
  podvodkaList: PodvodkaType[]
}
const KassaPrixodOrderTemplate = ({
  doc_num,
  doc_date,
  fio,
  workplace,
  opisanie,
  summa,
  summaWords,
  podvodkaList
}: KassaPrixodOrderTemplateProps) => {
  return (
    <Document>
      <Page style={styles.page}>
        <Flex
          direction="row"
          alignItems="flex-start"
          style={{ width: '100%', height: '50%' }}
        >
          <Flex.Item>
            <KassaPrixodOrder
              doc_num={doc_num}
              doc_date={doc_date}
              fio={fio}
              workplace={workplace}
              opisanie={opisanie}
              summa={summa}
              summaWords={summaWords}
              podvodkaList={podvodkaList}
            />
          </Flex.Item>
          <Seperator vertical />
          <View style={{ width: '100%', maxWidth: 150 }}>
            <KassaPrixodReceipt
              doc_num={doc_num}
              fio={fio}
              workplace={workplace}
              opisanie={opisanie}
              summa={summa}
              summaWords={summaWords}
            />
          </View>
        </Flex>
      </Page>
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

export { KassaPrixodOrderTemplate }
