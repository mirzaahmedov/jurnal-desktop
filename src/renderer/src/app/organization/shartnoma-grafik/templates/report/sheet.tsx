import type { ShartnomaGrafikFormValues } from '../../service'

import { Flex } from '@/common/components/pdf'

import { DocumentInfo, Header, Schedule, Signatures } from './components'

type SheetProps = {
  article: string
  section: string
  subchapter: string
  chapter: string
  contractDetails: string
  createdDate: string
  schedule: ShartnomaGrafikFormValues
  paymentDetails: string
  rukovoditel: string
  glav_mib: string
}
const Sheet = ({
  article,
  section,
  subchapter,
  chapter,
  contractDetails,
  createdDate,
  schedule,
  paymentDetails,
  rukovoditel,
  glav_mib
}: SheetProps) => {
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
          contractDetails={contractDetails}
        />
        <Schedule
          article={article}
          year={year}
          data={schedule}
          paymentDetails={paymentDetails}
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

export { Sheet }
export type { SheetProps }
