import { Flex, Label, TextBox } from '@/common/components/pdf'

type SummaProps = {
  summa: string
}
const Summa = ({ summa }: SummaProps) => {
  return (
    <Flex>
      <Label style={{ width: 100 }}>Summa</Label>
      <TextBox
        fullWidth
        style={{ fontWeight: 'bold' }}
      >
        {summa}
      </TextBox>
    </Flex>
  )
}

export { Summa }
