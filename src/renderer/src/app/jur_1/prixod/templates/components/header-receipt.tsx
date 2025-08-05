import { StyleSheet, Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex } from '@/common/components/pdf'

type HeaderReceiptProps = {
  doc_num: string
}
const HeaderReceipt = ({ doc_num }: HeaderReceiptProps) => {
  const { t } = useTranslation(['pdf-reports'])
  return (
    <Flex
      direction="column"
      alignItems="center"
      style={{ gap: 4 }}
    >
      <Text style={styles.name}>{t('receipt')}</Text>
      <Text style={styles.description}>{t('for_prixod_rasxod_order')}</Text>
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
