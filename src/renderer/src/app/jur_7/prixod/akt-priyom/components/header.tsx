import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

// 😃😃 Header 😃😃
export const Header: FC<{
  regionName: string
  docNum: string
  headerText: string
}> = ({ regionName, docNum, headerText }) => {
  const { t } = useTranslation()
  return (
    <View>
      <Text style={styles.regionName}>{regionName}</Text>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t('receive_akt')}</Text>
        <Text style={styles.title}>№</Text>
        <Text style={styles.title}>{docNum}</Text>
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
    gap: 10
  },
  title: {
    fontSize: 16,
    fontWeight: 'semibold',
    fontStyle: 'italic',
    textTransform: 'uppercase'
  },
  headerText: {
    marginTop: 20,
    marginHorizontal: 20,
    lineHeight: 1.4,
    fontSize: 11,
    textAlign: 'center'
  }
})
