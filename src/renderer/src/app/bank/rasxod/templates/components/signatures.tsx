import { View } from '@react-pdf/renderer'
import { Flex, Label, TextBox } from '@/common/components/pdf'

type SignaturesProps = {
  rukovoditel: string | null
  glav_buxgalter: string | null
}
const Signatures = ({ rukovoditel, glav_buxgalter }: SignaturesProps) => {
  return (
    <>
      <Flex>
        <Label
          style={{
            width: 100,
            fontSize: 9,
            textAlign: 'right'
          }}
        >
          Rahbar
        </Label>
        <TextBox style={{ flex: 1, minHeight: 16 }}>{rukovoditel}</TextBox>
        <Label style={{ fontSize: 9, textAlign: 'center' }}>Bosh buхgalter</Label>
        <TextBox style={{ flex: 1, minHeight: 16 }}>{glav_buxgalter}</TextBox>
      </Flex>
      <Flex>
        <View style={{ width: 100 }}> </View>
        <Flex
          style={{
            flex: 1,
            border: '1.5px solid black',
            padding: 2
          }}
        >
          {['Tekshirilgan', "Ma'qullangan", "Bank tomonidan o'tkazilgan"].map((label) => (
            <Flex.Item>
              <Label
                style={{
                  fontSize: 9,
                  textAlign: 'center'
                }}
              >
                {label}
              </Label>
              <View
                style={{
                  height: 16,
                  border: '1.5px solid black'
                }}
              >
                {undefined}
              </View>
            </Flex.Item>
          ))}
        </Flex>
      </Flex>
    </>
  )
}

export { Signatures }
