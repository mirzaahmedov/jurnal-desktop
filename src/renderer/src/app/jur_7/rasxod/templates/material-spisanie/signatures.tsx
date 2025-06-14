import { StyleSheet, Text, View } from '@react-pdf/renderer'

export const Signatures = () => {
  return (
    <View style={styles.container}>
      <View style={styles.info_row}>
        <Text>Приложение</Text>
      </View>
      <View style={[styles.info_row, styles.signatures]}>
        <Text style={styles.signature_label}>Начальник отдела</Text>
        <Text style={styles.signature_value}></Text>
        <Text style={styles.signature_label}>Бухгалтер</Text>
        <Text style={styles.signature_value}></Text>
      </View>
      <View style={[styles.info_row, styles.signatures]}>
        <Text style={styles.signature_label}> </Text>
      </View>
      <View style={styles.info_row}>
        <Text style={styles.line_cut}>Линия отреза</Text>
      </View>
      <View style={[styles.info_row, styles.signatures]}>
        <Text style={styles.signature_label}>Хисобдан чикариш</Text>
      </View>
      <View style={[styles.info_row, styles.signatures, { width: 120 }]}>
        <Text style={styles.signature_label}> </Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <View style={[styles.info_row, styles.signatures, { width: 120 }]}>
          <Text style={styles.signature_label}>№</Text>
        </View>
        <View style={[styles.info_row, styles.signatures, { borderBottom: 'none' }]}>
          <Text style={styles.signature_label}>Подтверждение к извещению №</Text>
        </View>
      </View>
      <View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ lineHeight: 1 }}>
            Перечисленные в извещении материальные ценности получены и взяты на балансовый учет в
            _____ квартале 20___ г. в сум _____________________________
            _______________________________________________________________________
          </Text>
        </View>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 2, paddingVertical: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Начальник ФЭО</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Ст. бухгалтер</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '70%',
    fontSize: 10
  },
  info_row: {
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderBottom: '1px solid black'
  },
  signatures: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  signature_label: {
    width: 200,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontWeight: 'bold'
  },
  signature_value: {
    flex: 1
  },
  line_cut: {
    letterSpacing: 5,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})
