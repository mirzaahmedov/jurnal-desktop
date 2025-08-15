import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

export const Header: FC<{
  docNum: string
}> = ({ docNum }) => {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('receive_akt')} {docNum}
      </Text>
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
  }
})
