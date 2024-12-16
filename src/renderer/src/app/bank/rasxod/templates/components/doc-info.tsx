import { Flex, Label, TextBox } from '@/common/components/pdf'

type DocInfoProps = {
  doc_date: string
}
const DocInfo = ({ doc_date }: DocInfoProps) => {
  return (
    <Flex justifyContent="space-between">
      <Label style={{ width: 100 }}>Hujjat sanasi</Label>
      <TextBox>{doc_date}</TextBox>
      <Label>Valyutalashtirish sanasi</Label>
      <TextBox>{doc_date}</TextBox>
    </Flex>
  )
}

export { DocInfo }
