import { StyleSheet, Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex } from '@/common/components/pdf'
import { formatLocaleDate } from '@/common/lib/format'

type DocumentInfoProps = {
  contractDetails: string
  createdDate: string
  section: string
  subchapter: string
  chapter: string
}
export const DocumentInfo = ({
  contractDetails,
  createdDate,
  section,
  subchapter,
  chapter
}: DocumentInfoProps) => {
  const { t } = useTranslation(['pdf-reports'])
  return (
    <>
      <Text style={styles.description}>{contractDetails}</Text>
      <Flex>
        <Flex.Item>
          <Flex
            direction="column"
            alignItems="stretch"
            justifyContent="flex-start"
            style={{ maxWidth: 250, gap: 2 }}
          >
            <Flex>
              <Text style={{ flex: 1 }}>{t('section')}</Text>
              <Text style={{ flex: 1 }}>{section}</Text>
            </Flex>
            <Flex>
              <Text style={{ flex: 1 }}>{t('subchapter')}</Text>
              <Text style={{ flex: 1 }}>{subchapter}</Text>
            </Flex>
            <Flex>
              <Text style={{ flex: 1 }}>{t('chapter')}</Text>
              <Text style={{ flex: 1 }}>{chapter}</Text>
            </Flex>
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Text
            style={{
              fontStyle: 'italic',
              textAlign: 'center'
            }}
          >
            {t('ds1_date', { date: formatLocaleDate(createdDate) })}
          </Text>
        </Flex.Item>
      </Flex>
    </>
  )
}

const styles = StyleSheet.create({
  description: {
    paddingHorizontal: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold'
  }
})
