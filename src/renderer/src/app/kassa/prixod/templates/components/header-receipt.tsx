import { Text, StyleSheet } from '@react-pdf/renderer'
import { Flex } from '@/common/components/pdf'

type HeaderReceiptProps = {
  doc_num: string
}
const HeaderReceipt = ({ doc_num }: HeaderReceiptProps) => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      style={{ gap: 4 }}
    >
      <Text style={styles.name}>Квитанция</Text>
      <Text style={styles.description}>к приходному расходному ордеру</Text>
      <Text style={styles.name}>
        № <Text style={{ textDecoration: 'underline' }}>{doc_num}</Text>
      </Text>
    </Flex>
  )
}

const styles = StyleSheet.create({
  header: {
    display: 'flex'
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 10
  }
})

export { HeaderReceipt }
