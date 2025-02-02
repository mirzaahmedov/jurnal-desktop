import type { PodvodkaType } from './components/podvodka'

import { Flex } from '@/common/components/pdf'

import { Details, Header, PodvodkaTable, Signatures } from './components'

type KassaPrixodOrderProps = {
  doc_num: string
  doc_date: string
  fio: string
  workplace: string
  opisanie: string
  summa: string
  summaWords: string
  podvodkaList: PodvodkaType[]
}
const KassaPrixodOrder = ({
  doc_num,
  doc_date,
  fio,
  workplace,
  opisanie,
  summa,
  summaWords,
  podvodkaList
}: KassaPrixodOrderProps) => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{
        gap: 20
      }}
    >
      <Header
        doc_num={doc_num}
        doc_date={doc_date}
      />
      <PodvodkaTable podvodkaList={podvodkaList} />
      <Details
        fio={fio}
        workplace={workplace}
        opisanie={opisanie}
        summa={summa}
        summaWords={summaWords}
      />
      <Signatures />
    </Flex>
  )
}

export { KassaPrixodOrder }
