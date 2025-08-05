import { StyleSheet } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex, Label, TextBox } from '@/common/components/pdf'

type DocInfoProps = {
  doc_date: string
}
export const DocInfo = ({ doc_date }: DocInfoProps) => {
  const { t } = useTranslation(['porucheniya'])
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex>
        <Label style={{ width: 115 }}>{t('doc_date')}</Label>
        <TextBox style={styles.textbox}>{doc_date}</TextBox>
      </Flex>
      <Label>{t('valuation_date')}</Label>
      <TextBox style={styles.textbox}>{doc_date}</TextBox>
    </Flex>
  )
}
const styles = StyleSheet.create({
  textbox: {
    fontSize: 11
  }
})
