import { Flex } from '@renderer/common/components/pdf'
import { Text } from '@react-pdf/renderer'

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
