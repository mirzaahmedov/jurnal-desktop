import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { formatLocaleDate } from '@/common/lib/format'

export interface HeaderProps {
  doc_num: string
  doc_date: string
  sender: string
}
export const Header = ({ doc_num, doc_date, sender }: HeaderProps) => {
  return (
    <View>
      <Text style={styles.org_title}>{sender}</Text>
      <Text style={styles.title}>Извещение</Text>
      <Text style={styles.doc_info}>
        о безвозмездной передаче основных средств № {doc_num} от {formatLocaleDate(doc_date)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  org_title: {
    fontSize: 10,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textDecoration: 'underline',
    marginBottom: 10,
    color: 'blue'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 10,
    textAlign: 'center'
  },
  doc_info: {
    marginLeft: 20,
    fontWeight: 'bold'
  }
})
