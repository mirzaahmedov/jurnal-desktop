import type { PodvodkaType } from './components/podvodka'

import { Document, Page, StyleSheet, View } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

import { Header, PodvodkaTable, Signatures, Summary } from './components'

registerFonts()

type KassaRasxodOrderTemplateProps = {
  doc_num: string
  doc_date: string
  fio: string
  summa: string
  summaWords: string
  podvodkaList: PodvodkaType[]
}
const KassaRasxodOrderTemplate = ({
  doc_num,
  doc_date,
  fio,
  summa,
  summaWords,
  podvodkaList
}: KassaRasxodOrderTemplateProps) => {
  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >
        <Header
          doc_num={doc_num}
          doc_date={doc_date}
        />
        <View style={{ marginTop: 15 }}>
          <Summary
            fio={fio}
            operation={podvodkaList?.[0].operation}
            summa={summa}
            summaWords={summaWords}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <Signatures />
        </View>
        <View style={{ marginTop: 5 }}>
          <PodvodkaTable podvodkaList={podvodkaList} />
        </View>
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

export { KassaRasxodOrderTemplate }
