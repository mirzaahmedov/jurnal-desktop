import type { ShartnomaGrafikPDFDocumentOptions } from './types'

import { Flex } from '@/common/components/pdf'

import { DocumentInfo, Header, ShartnomaSmetaGrafiksTable, Signatures } from './components'

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
  rukovoditel,
  glav_mib,
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
        <Signatures
          year={year}
          rukovoditel={rukovoditel}
          glav_mib={glav_mib}
        />
      </Flex>
    </Flex.Item>
  )
}
