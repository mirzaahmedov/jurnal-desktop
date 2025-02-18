import { Text } from '@react-pdf/renderer'

import { Blank, Field, Flex, Label } from '@/common/components/pdf'

interface SignatureProps {
  year: number
  rukovoditel: string
  glav_mib: string
}
const Signatures = ({ year, rukovoditel, glav_mib }: SignatureProps) => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
    >
      <Flex>
        <Text>М.У.</Text>
        <Flex>
          <Field>
            <Label>Рахбар</Label>
            <Text style={{ fontWeight: 'bold' }}>{rukovoditel}</Text>
          </Field>
          <Field style={{ marginLeft: 20 }}>
            <Label>МИБ Бошлиғи</Label>
            <Text style={{ fontWeight: 'bold' }}>{glav_mib}</Text>
          </Field>
        </Flex>
      </Flex>
      <Flex>
        <Flex.Item>
          <Field style={{ alignItems: 'flex-end' }}>
            <Label>Ғазначилик бўлими{'\n'}ходими қабул қилди</Label>
            <Blank />
          </Field>
        </Flex.Item>
        <Flex.Item>
          <Field style={{ alignItems: 'flex-end' }}>
            <Label>Бюджетдан маблағ олувчи{'\n'}ходими қабул қилди</Label>
            <Blank />
          </Field>
        </Flex.Item>
      </Flex>
      <Flex style={{ gap: 0 }}>
        <Text>&quot;№</Text>
        <Blank />
        <Text>&quot;</Text>
      </Flex>
      <Flex>
        {[1, 2].map((i) => (
          <Flex.Item key={i}>
            <Flex style={{ gap: 0 }}>
              <Text>&quot;</Text>
              <Blank style={{ width: 30 }} />
              <Text>&quot;</Text>
              <Blank style={{ width: 80 }} />
              <Text>{year}г.</Text>
            </Flex>
          </Flex.Item>
        ))}
      </Flex>
    </Flex>
  )
}

export { Signatures }
