import type { TextProps } from '@react-pdf/renderer'
import type { PropsWithChildren } from 'react'

import { StyleSheet, Text } from '@react-pdf/renderer'

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
    lineHeight: 1,
    paddingTop: 2,
    borderWidth: 1.5,
    borderColor: 'black',
    paddingHorizontal: 3
  }
})

export { TextBox }
