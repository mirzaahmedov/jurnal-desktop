import { Text } from '@react-pdf/renderer'
import { Flex } from '@renderer/common/components/pdf'

const Header = () => {
  return (
    <Flex>
      <Flex.Item>
        <Text>НГУО г.Ташкент</Text>
      </Flex.Item>
      <Flex.Item>
        <Text>НГУО г.Ташкент</Text>
      </Flex.Item>
    </Flex>
  )
}

export { Header }
