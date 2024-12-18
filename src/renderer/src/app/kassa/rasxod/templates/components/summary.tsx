import { Flex, Field, Label, Value } from '@/common/components/pdf'

type SummaryProps = {
  fio: string
  operation: string
  summa: string
  summaWords: string
}
const Summary = ({ fio, operation, summa, summaWords }: SummaryProps) => {
  return (
    <Flex>
      <Flex.Item>
        <Flex
          direction="column"
          alignItems="flex-start"
          style={{ gap: 4 }}
        >
          <Field>
            <Label>ФИО:</Label>
            <Value>{fio}</Value>
          </Field>
          <Field>
            <Label>Видать</Label>
            <Value style={{ fontWeight: 'normal' }}>{operation}</Value>
          </Field>
          <Field>
            <Label>В Сумме:</Label>
            <Value>{summaWords}</Value>
          </Field>
        </Flex>
      </Flex.Item>
      <Flex.Item>
        <Flex justifyContent="center">
          <Field>
            <Label>Сумма:</Label>
            <Value style={{ fontSize: 16 }}>{summa}</Value>
          </Field>
        </Flex>
      </Flex.Item>
    </Flex>
  )
}

export { Summary }
