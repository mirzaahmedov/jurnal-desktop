import { Field, Flex, Label, Value } from '@/common/components/pdf'

type DetailsProps = {
  type?: 'receipt' | 'order'
  fio: string
  workplace: string
  opisanie: string
  summa: string
  summaWords: string
}
const Details = ({ type = 'order', fio, workplace, opisanie, summa, summaWords }: DetailsProps) => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{
        gap: type === 'receipt' ? 20 : 5
      }}
    >
      <Field style={{ flexWrap: 'wrap' }}>
        <Label>Принято от:</Label>
        <Value style={{ textDecoration: 'underline' }}>{fio}</Value>
      </Field>
      <Field style={{ flexWrap: 'wrap' }}>
        <Label>Место работы:</Label>
        <Value
          style={{
            fontWeight: 'normal',
            textDecoration: 'underline'
          }}
        >
          {workplace}
        </Value>
      </Field>
      <Field style={{ flexWrap: 'wrap' }}>
        <Label>Примечания:</Label>
        <Value
          style={{
            fontWeight: 'normal',
            textDecoration: 'underline'
          }}
        >
          {opisanie}
        </Value>
      </Field>
      <Field style={{ flexWrap: 'wrap' }}>
        <Label>В сумме:</Label>
        <Value style={{ textDecoration: 'underline' }}>{summa}</Value>
      </Field>
      <Field style={{ flexWrap: 'wrap' }}>
        <Value style={{ textDecoration: 'underline' }}>{summaWords}</Value>
      </Field>
    </Flex>
  )
}

export { Details }
