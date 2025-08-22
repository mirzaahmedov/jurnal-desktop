import type { ShartnomaGrafikOptions } from './types'

import { Flex } from '@/common/components/pdf'

import { Header, Podpises, ShartnomaSmetaGrafiksTable } from './components'

export interface PaperSheetProps extends ShartnomaGrafikOptions {
  singlePage: boolean
}
export const PaperSheet = ({
  summaValue,
  docNum,
  docDate,
  grafiks,
  podpis,
  organName,
  regionName,
  singlePage
}: PaperSheetProps) => {
  const year = new Date(docDate).getFullYear()
  return (
    <Flex.Item>
      <Flex
        direction="column"
        alignItems="stretch"
        style={{ padding: 5 }}
      >
        <Header
          docNum={docNum}
          docDate={docDate}
          organName={organName}
          regionName={regionName}
          summaValue={summaValue}
        />
        <ShartnomaSmetaGrafiksTable
          year={year}
          grafiks={grafiks}
          singlePage={singlePage}
          summaValue={summaValue}
        />
        <Podpises
          year={year}
          podpises={podpis}
        />
      </Flex>
    </Flex.Item>
  )
}
