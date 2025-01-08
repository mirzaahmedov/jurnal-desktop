import { DocumentInfo, Header, Schedule, Signatures } from './components'

import { Flex } from '@/common/components/pdf'
import type { ShartnomaGrafikForm } from '../../service'

type SheetProps = {
  article: string
  section: string
  subchapter: string
  chapter: string
  contractDetails: string
  createdDate: string
  schedule: ShartnomaGrafikForm
  paymentDetails: string
}
const Sheet = ({
  article,
  section,
  subchapter,
  chapter,
  contractDetails,
  createdDate,
  schedule,
  paymentDetails
}: SheetProps) => {
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
          contractDetails={contractDetails}
        />
        <Schedule
          article={article}
          data={schedule}
          paymentDetails={paymentDetails}
        />
        <Signatures />
      </Flex>
    </Flex.Item>
  )
}

export { Sheet }
export type { SheetProps }
