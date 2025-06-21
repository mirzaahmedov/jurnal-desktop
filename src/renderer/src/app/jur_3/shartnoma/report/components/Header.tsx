import { StyleSheet, Text } from '@react-pdf/renderer'

import { Flex } from '@/common/components/pdf'

const Header = () => {
  return (
    <>
      <Flex direction="column">
        <Text style={styles.doc_info}>{`Nizomga\n I ilova`}</Text>
        <Text style={styles.name}>Toʻlov jadvali</Text>
      </Flex>
    </>
  )
}
const styles = StyleSheet.create({
  doc_info: {
    width: '100%',
    textAlign: 'right',
    fontWeight: 'bold'
  },
  name: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }
})

export { Header }
