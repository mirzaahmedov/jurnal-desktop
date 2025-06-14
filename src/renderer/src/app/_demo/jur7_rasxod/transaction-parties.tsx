import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { formatLocaleDate } from '@/common/lib/format'

export interface TransactionPartiesProps {
  receiver: string
  sender: string
  basis: string
  attorney_num: string
  requirement_num: string
  doc_date: string
}
export const TransactionParties = ({
  receiver,
  sender,
  basis,
  attorney_num,
  requirement_num,
  doc_date
}: TransactionPartiesProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.info_row}>
        <Text>
          КОМУ: <Text style={styles.text_bold}>{receiver}</Text>
        </Text>
      </View>
      <View style={[styles.info_row, styles.transaction_parties]}>
        <Text>
          Отправитель: <Text style={styles.text_bold}>{sender}</Text>
        </Text>
        <Text>
          Получатель: <Text style={styles.text_bold}>{receiver}</Text>
        </Text>
      </View>
      <View style={styles.info_row}>
        <Text>
          Основание на передачу (распоряжение № и дата):{' '}
          <Text style={styles.text_bold}>{basis}</Text>
        </Text>
      </View>
      <View style={[styles.info_row, styles.doc_attributes]}>
        <Text style={styles.doc_attributes_item}>
          № доверенност: <Text style={styles.text_bold}>{attorney_num}</Text>
        </Text>
        <Text style={styles.doc_attributes_item}>
          № требование: <Text style={styles.text_bold}>{requirement_num}</Text>
        </Text>
        <Text style={styles.doc_attributes_item}>
          Дата: <Text style={styles.text_bold}>{formatLocaleDate(doc_date)}</Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  info_row: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottom: '1px solid black'
  },
  transaction_parties: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  doc_attributes: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottom: 'none'
  },
  doc_attributes_item: {
    flex: 1
  },
  text_bold: {
    fontWeight: 'bold'
  }
})
