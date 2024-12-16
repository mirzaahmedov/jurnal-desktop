import { Flex, Field, Label, Blank } from '@/common/components/pdf'
import { Text } from '@react-pdf/renderer'

const Signatures = () => {
  return (
    <Flex direction="column" alignItems="stretch">
      <Flex>
        <Text>М.У.</Text>
        <Flex>
          <Field>
            <Label>Бошлиқ</Label>
            <Blank />
          </Field>
          <Field>
            <Label>МТХ бошлиғи</Label>
            <Blank />
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
        <Text>"№</Text>
        <Blank />
        <Text>"</Text>
      </Flex>
      <Flex>
        {[1, 2].map((i) => (
          <Flex.Item key={i}>
            <Flex style={{ gap: 0 }}>
              <Text>"</Text>
              <Blank style={{ width: 30 }} />
              <Text>"</Text>
              <Blank style={{ width: 80 }} />
              <Text>2024г.</Text>
            </Flex>
          </Flex.Item>
        ))}
      </Flex>
    </Flex>
  )
}

export { Signatures }
