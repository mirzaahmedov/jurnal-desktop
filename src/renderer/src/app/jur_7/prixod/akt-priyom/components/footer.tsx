import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { formatLocaleDate } from '@/common/lib/format'

export const Footer: FC<{
  docDate: string
  dovernost: string
}> = ({ dovernost, docDate }) => {
  return (
    <View style={styles.wrapper}>
      <Text>{dovernost}</Text>
      <Text>{formatLocaleDate(docDate)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
})
