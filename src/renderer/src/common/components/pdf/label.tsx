import type { TextProps } from '@react-pdf/renderer'
import type { PropsWithChildren } from 'react'

import { StyleSheet, Text } from '@react-pdf/renderer'
import { mergeStyles } from '@/common/lib/utils'

const Label = ({ children, style, ...props }: PropsWithChildren<TextProps>) => {
  return (
    <Text
      {...props}
      style={mergeStyles(styles.label, style)}
    >
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  label: {}
})

export { Label }
