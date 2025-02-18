import { StyleSheet, View } from '@react-pdf/renderer'

type SeperatorProps = {
  vertical?: boolean
  fullWidth?: boolean
}
const Seperator = ({ vertical, fullWidth = false }: SeperatorProps) => {
  return (
    <View
      style={[
        vertical ? styles.lineVertical : styles.lineHorizontal,
        vertical
          ? {
              height: fullWidth ? '100%' : undefined
            }
          : {
              width: fullWidth ? '100%' : undefined
            }
      ]}
    />
  )
}

const styles = StyleSheet.create({
  lineHorizontal: {
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    marginVertical: 1
  },
  lineVertical: {
    height: '100%',
    width: 1,
    borderRightWidth: 1,
    borderStyle: 'dotted'
  }
})

export { Seperator }
