import { StyleSheet, Text } from '@react-pdf/renderer'

import { Flex, TextBox } from '@/common/components/pdf'

export type HeaderProps = {
  name: string
  doc_num: string
}
const Header = ({ name, doc_num }: HeaderProps) => {
  return (
    <Flex>
      <Flex.Item>
        <Text style={styles.name}>{name}</Text>
      </Flex.Item>
      <Flex.Item>
        <Flex>
          <TextBox style={{ minWidth: 100, letterSpacing: 5 }}>{doc_num}</TextBox>
        </Flex>
      </Flex.Item>
    </Flex>
  )
}

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
    fontSize: 12
  },
  doc_num: {
    width: 184,
    height: 17,
    border: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export { Header }
