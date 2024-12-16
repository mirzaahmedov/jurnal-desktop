import { Flex } from '@/common/components/pdf'
import { Details, HeaderReceipt, Signatures } from './components'

type KassaPrixodReceiptProps = {
  doc_num: string
  fio: string
  workplace: string
  opisanie: string
  summa: string
  summaWords: string
}
const KassaPrixodReceipt = ({
  doc_num,
  fio,
  workplace,
  opisanie,
  summa,
  summaWords
}: KassaPrixodReceiptProps) => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{
        gap: 30
      }}
    >
      <HeaderReceipt doc_num={doc_num} />
      <Details
        type="receipt"
        fio={fio}
        workplace={workplace}
        opisanie={opisanie}
        summa={summa}
        summaWords={summaWords}
      />
      <Signatures type="receipt" />
    </Flex>
  )
}

export { KassaPrixodReceipt }
