import { Text, StyleSheet } from '@react-pdf/renderer'
import { Flex } from '@/common/components/pdf'

type HeaderProps = {
  doc_num: string
  doc_date: string
}
const Header = ({ doc_num, doc_date }: HeaderProps) => {
  return (
    <Flex direction="column" alignItems="stretch">
      <Text style={styles.name}>
        Приходной кассовый ордер № <Text style={styles.doc_num}>{doc_num}</Text>
      </Text>
      <Text style={styles.doc_date}>
        от{' '}
        {new Date(doc_date).toLocaleDateString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
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
  doc_num: {
    textDecoration: 'underline'
  },
  doc_date: {
    textDecoration: 'underline',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold'
  }
})

export { Header }
