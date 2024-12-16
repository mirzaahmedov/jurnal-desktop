import type { TextProps, ViewProps } from '@react-pdf/renderer'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { mergeStyles } from '@/common/lib/utils'

type BlankProps = TextProps & {
  fullWidth?: boolean
  helpText?: string
  viewProps?: ViewProps
}
const Blank = ({ fullWidth = false, helpText, viewProps, style, ...props }: BlankProps) => {
  return (
    <View {...viewProps} style={mergeStyles(viewProps?.style, fullWidth ? { flex: 1 } : undefined)}>
      <Text
        {...props}
        style={mergeStyles(styles.blank, fullWidth ? { width: '100%' } : undefined, style)}
      >
        {' '}
      </Text>
      {helpText && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  blank: {
    width: 50,
    borderBottom: '1px solid black'
  },
  helpText: {
    width: 10000,
    position: 'absolute',
    top: '100%',
    left: 10,
    fontSize: 9
  }
})

export { Blank }
