import { Text, StyleSheet } from '@react-pdf/renderer'
import { Flex } from '@/common/components/pdf'

type HeaderProps = {
  doc_num: string
  doc_date: string
}
const Header = ({ doc_num, doc_date }: HeaderProps) => {
  return (
    <Flex>
      <Flex.Item>
        <Text style={styles.name}>
          Расходный кассовый ордер № <Text style={styles.doc_num}>{doc_num}</Text>
        </Text>
      </Flex.Item>
      <Flex.Item>
        <Text style={styles.doc_date}>
          от{' '}
          {new Date(doc_date).toLocaleDateString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </Flex.Item>
    </Flex>
  )
}

const styles = StyleSheet.create({
  header: {
    display: 'flex'
  },
  name: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  doc_num: {
    textDecoration: 'underline'
  },
  doc_date: {
    textDecoration: 'underline',
    fontSize: 13,
    fontWeight: 'bold'
  }
})

export { Header }
