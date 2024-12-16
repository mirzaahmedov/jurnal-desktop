import { View, StyleSheet } from '@react-pdf/renderer'

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
    borderBottom: '1px dashed black',
    marginVertical: 5
  },
  lineVertical: {
    height: '100%',
    width: 1,
    borderRight: '1px dashed black',
    marginHorizontal: 5
  }
})

export { Seperator }
