import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { formatLocaleDate } from '@/common/lib/format'

// Blazingly fast header component 🚀🚀🚀🚀
export const Header: FC<{
  regionName: string
  docNum: string
  docDate: string
  organName: string
  receiverName: string
  note: string
  headerText: string
}> = (props) => {
  const { regionName, docNum, docDate, organName, receiverName, note, headerText } = props

  const { t } = useTranslation()
  return (
    <View>
      <Text style={styles.regionName}>{regionName}</Text>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('receive_akt')}</Text>
        <Text style={styles.title}>№</Text>
        <Text style={styles.title}>{docNum}</Text>
        <Text style={[styles.title, { textTransform: 'lowercase', marginLeft: 20 }]}>
          {t('from_date_value', { date: formatLocaleDate(docDate) })}
        </Text>
      </View>
      <View>
        <View style={styles.rowContainer}>
          <View style={styles.rowName}>
            <Text>{t('from_where')}</Text>
          </View>
          <View style={styles.rowValue}>
            <Text>{organName}</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowName}>
            <Text>{t('to_whom')}</Text>
          </View>
          <View style={styles.rowValue}>
            <Text>{receiverName}</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.rowName}>
            <Text>{t('note')}</Text>
          </View>
          <View style={styles.rowValue}>
            <Text>{note}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  regionName: {
    fontStyle: 'italic',
    color: 'blue',
    textDecoration: 'underline'
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textTransform: 'uppercase'
  },
  rowContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowName: {
    width: 80,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  rowValue: {
    flex: 1,
    fontStyle: 'italic'
  },
  headerText: {
    marginTop: 20,
    lineHeight: 1.4,
    fontSize: 10
  }
})
