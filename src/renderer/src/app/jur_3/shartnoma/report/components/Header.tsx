import { StyleSheet, Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex } from '@/common/components/pdf'

const Header = () => {
  const { t } = useTranslation(['pdf-reports'])
  return (
    <>
      <Flex direction="column">
        <Text style={styles.doc_info}>{t('annex_nth_to_regulation', { nth: 'I' })}</Text>
        <Text style={styles.name}>{t('payment_schedule')}</Text>
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
