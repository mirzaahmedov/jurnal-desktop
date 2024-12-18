import { Blank, Field, Flex, Label } from '@/common/components/pdf'

type SignaturesProps = {
  type?: 'receipt' | 'order'
}
const Signatures = ({ type = 'order' }: SignaturesProps) => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
    >
      <Field>
        <Label>Главный бухгалтер</Label>
        <Blank
          fullWidth={type === 'receipt'}
          style={{
            width: type === 'order' ? 100 : undefined
          }}
        />
      </Field>
      <Field>
        <Label>Бухгалтер</Label>
        <Blank
          fullWidth={type === 'receipt'}
          style={{
            width: type === 'order' ? 100 : undefined
          }}
        />
      </Field>
      <Field>
        <Label>Получил кассир</Label>
        <Blank
          fullWidth={type === 'receipt'}
          style={{
            width: type === 'order' ? 100 : undefined
          }}
        />
      </Field>
    </Flex>
  )
}

export { Signatures }
