import type { ShartnomaGrafikPDFDocumentOptions } from './types'

import { Flex } from '@/common/components/pdf'

import { DocumentInfo, Header, Podpises, ShartnomaSmetaGrafiksTable } from './components'

export interface PaperSheetProps extends ShartnomaGrafikPDFDocumentOptions {
  singlePage: boolean
}
export const PaperSheet = ({
  section,
  subchapter,
  chapter,
  shartnomaDetails,
  createdDate,
  grafiks,
  paymentDetails,
  podpis,
  singlePage
}: PaperSheetProps) => {
  const year = new Date(createdDate).getFullYear()
  return (
    <Flex.Item>
      <Flex
        direction="column"
        alignItems="stretch"
        style={{ padding: 5 }}
      >
        <Header />
        <DocumentInfo
          section={section}
          subchapter={subchapter}
          chapter={chapter}
          createdDate={createdDate}
          contractDetails={shartnomaDetails}
        />
        <ShartnomaSmetaGrafiksTable
          year={year}
          grafiks={grafiks}
          paymentDetails={paymentDetails}
          singlePage={singlePage}
        />
        <Podpises
          year={year}
          podpises={podpis}
        />
      </Flex>
    </Flex.Item>
  )
}
