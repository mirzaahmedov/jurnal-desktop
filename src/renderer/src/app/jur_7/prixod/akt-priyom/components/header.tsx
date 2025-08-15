import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

export const Header: FC<{
  docNum: string
  headerText: string
}> = ({ docNum, headerText }) => {
  const { t } = useTranslation()
  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>
          {t('receive_akt')} <Text style={{ textDecoration: 'underline' }}>{docNum}</Text>
        </Text>
      </View>
      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'semibold'
  },
  headerText: {
    marginTop: 20,
    marginHorizontal: 20,
    lineHeight: 1.4,
    fontSize: 11,
    textAlign: 'center'
  }
})
