import { StyleSheet, Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex } from '@/common/components/pdf'
import { formatLocaleDate } from '@/common/lib/format'

type HeaderProps = {
  doc_num: string
  doc_date: string
}
const Header = ({ doc_num, doc_date }: HeaderProps) => {
  const { t } = useTranslation(['pdf-reports'])
  return (
    <Flex>
      <Flex.Item>
        <Text style={styles.name}>
          {t('rasxod_order')} № <Text style={styles.doc_num}>{doc_num}</Text>
        </Text>
      </Flex.Item>
      <Flex.Item>
        <Text style={styles.doc_date}>
          {t('from_date', {
            date: formatLocaleDate(doc_date)
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
