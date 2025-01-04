import { StyleSheet, Text } from '@react-pdf/renderer'

import type { PropsWithChildren } from 'react'
import type { TextProps } from '@react-pdf/renderer'
import { mergeStyles } from '@/common/lib/utils'

type BoxProps = PropsWithChildren<TextProps> & {
  fullWidth?: boolean
}

const TextBox = ({ children, style, fullWidth = false, ...props }: BoxProps) => {
  return (
    <Text
      style={mergeStyles(
        styles.textBox,
        {
          flex: fullWidth ? 1 : undefined
        },
        style
      )}
      {...props}
    >
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  textBox: {
    fontWeight: 'bold',
    fontSize: 11,
    lineHeight: 1,
    border: '1.5px solid black',
    paddingHorizontal: 3
  }
})

export { TextBox }
