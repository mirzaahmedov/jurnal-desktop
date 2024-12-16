import type { TextProps, ViewProps } from '@react-pdf/renderer'

import { mergeStyles } from '@/common/lib/utils'
import { StyleSheet, Text, View } from '@react-pdf/renderer'

type ValueProps = TextProps & {
  children: string | string[]
  viewProps?: ViewProps
}
const Value = ({ children, viewProps, ...props }: ValueProps) => {
  return (
    <View {...viewProps}>
      <Text {...props} style={mergeStyles(styles.value, props?.style)}>
        {children}
      </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  value: {
    fontWeight: 'bold'
  }
})

export { Value }
