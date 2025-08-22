import type { FC } from 'react'

import { StyleSheet, Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex } from '@/common/components/pdf'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export interface HeaderProps {
  docNum: string
  docDate: string
  regionName: string
  organName: string
  summaValue: number
}
export const Header: FC<HeaderProps> = ({ docNum, docDate, organName, regionName, summaValue }) => {
  const { t } = useTranslation(['pdf-reports'])
  return (
    <>
      <Flex direction="column">
        <Text style={styles.regionName}>
          {organName} {t('with')} {regionName}
        </Text>
        <Text style={styles.summaValue}>
          {formatNumber(summaValue)} {t('total_summa').toLowerCase()}
        </Text>
        <Text style={styles.documentMeta}>
          {t('for_contract', { docNum: docNum, docDate: formatLocaleDate(docDate) })}
        </Text>
        <Text style={styles.documentName}>{t('payment_schedule')}</Text>
      </Flex>
    </>
  )
}
const styles = StyleSheet.create({
  regionName: {
    fontSize: 16,
    textAlign: 'center',
    textDecoration: 'underline',
    fontStyle: 'italic',
    width: 350
  },
  summaValue: {
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 13,
    width: 350
  },
  documentMeta: {
    fontSize: 11,
    fontWeight: 'semibold',
    fontStyle: 'italic',
    textAlign: 'right',
    width: 350
  },
  documentName: {
    fontSize: 16,
    textTransform: 'uppercase',
    textDecoration: 'underline',
    letterSpacing: 1,
    fontWeight: 'bold',
    marginVertical: 20
  }
})
