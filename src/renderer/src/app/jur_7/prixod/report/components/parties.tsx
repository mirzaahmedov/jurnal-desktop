import { StyleSheet, Text, View } from '@react-pdf/renderer'

export const Parties = () => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, marginTop: 40 }}>
      <Party />
      <Party />
    </View>
  )
}

const Party = () => {
  return (
    <View style={{ width: '50%' }}>
      <View style={styles.row}>
        <Text style={styles.label}>Етказиб берувчи:</Text>
        <Text style={styles.textContent}>&quot;QORAKO`L QO`SHCHINOR&quot; XK</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Манзил:</Text>
        <Text style={styles.textContent}>Qorako&apos;l qishlog&apos;i</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Етказиб берувчининг СТИР рақами (СТИР):</Text>
        <Text style={styles.textContent}>309170108</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>ККС тўловчининг рўйхатдан ўтиш коди:</Text>
        <Text style={styles.textContent}></Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>X/P:</Text>
        <Text style={styles.textContent}>20208000005474859001</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>МФО:</Text>
        <Text style={styles.textContent}>00511</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
  label: {
    width: '50%',
    fontSize: 10,
    fontFamily: 'Tinos',
    fontWeight: 'bold'
  },
  textContent: {
    width: '50%',
    fontSize: 10,
    fontFamily: 'Tinos',
    fontWeight: 'normal'
  }
})
