import { StyleSheet, Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex, TextBox } from '@/common/components/pdf'

export type HeaderProps = {
  doc_num: string
}
const Header = ({ doc_num }: HeaderProps) => {
  const { t } = useTranslation(['porucheniya'], { lng: 'uz' })
  return (
    <Flex>
      <Text style={styles.name}>{t('doc_num')}</Text>
      <TextBox style={styles.doc_num}>{doc_num}</TextBox>
    </Flex>
  )
}

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 20
  },
  doc_num: {
    minWidth: 100,
    paddingTop: 1.5,
    lineHeight: 1,
    letterSpacing: 4,
    fontSize: 11,
    fontWeight: 'black'
  }
})

export { Header }
