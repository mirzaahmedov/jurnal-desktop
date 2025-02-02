import { Text, View } from '@react-pdf/renderer'

import { Blank, Field, Flex, Label } from '@/common/components/pdf'

const Signatures = () => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}
    >
      <Flex>
        <Flex.Item>
          <Field>
            <Label>Подпись</Label>
            <Blank
              fullWidth
              helpText="распоряделителя кредитов"
            />
          </Field>
        </Flex.Item>
        <Flex.Item>
          <Field>
            <Label>Подпись</Label>
            <Blank
              fullWidth
              helpText="гл. или ст. бухгалтер"
            />
          </Field>
        </Flex.Item>
      </Flex>

      <Field>
        <Label>Получил</Label>
        <Blank
          fullWidth
          helpText="сумма прописью"
        />
      </Field>

      <Flex>
        <Flex.Item>
          <View>
            <Field>
              <Label>Роспись</Label>
              <Blank fullWidth />
            </Field>
          </View>
        </Flex.Item>
        <Flex.Item>
          <Text
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}
          >
            Выдал
          </Text>
        </Flex.Item>
      </Flex>

      <Flex>
        <Flex.Item>
          <Flex>
            <Field>
              <Label>"</Label>
              <Blank style={{ width: 20 }} />
              <Label>"</Label>
            </Field>
            <Field>
              <Blank style={{ width: 100 }} />
            </Field>
            <Field>
              <Label>20</Label>
              <Blank style={{ width: 20 }} />
              <Label>г.</Label>
            </Field>
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Field>
            <Label>Кассир</Label>
            <Blank style={{ width: 200 }} />
          </Field>
        </Flex.Item>
      </Flex>
    </View>
  )
}

export { Signatures }
