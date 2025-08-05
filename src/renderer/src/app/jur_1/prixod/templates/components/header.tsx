import { StyleSheet, Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex } from '@/common/components/pdf'

type HeaderProps = {
  doc_num: string
  doc_date: string
}
const Header = ({ doc_num, doc_date }: HeaderProps) => {
  const { t, i18n } = useTranslation(['pdf-reports'])
  return (
    <Flex
      direction="column"
      alignItems="stretch"
    >
      <Text style={styles.name}>
        {t('prixod_order')} № <Text style={styles.doc_num}>{doc_num}</Text>
      </Text>
      <Text style={styles.doc_date}>
        {t('from_date', {
          date: new Date(doc_date).toLocaleDateString(i18n.language === 'cyrl' ? 'ru' : 'uz', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
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
