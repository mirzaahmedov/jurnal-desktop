import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { registerFonts } from '@/common/lib/pdf'

registerFonts()

export const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>
          05.05.2025 даги КС/08-25-сонли шартномага 13.05.2025 даги КС/08-25-сонли
          Ҳисобварақ-фактура
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    fontFamily: 'Tinos'
  },
  titleWrapper: {
    width: 250
  },
  title: {
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
