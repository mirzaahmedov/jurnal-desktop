import type { ViewProps } from '@react-pdf/renderer'
import type { PropsWithChildren } from 'react'

import { StyleSheet, View } from '@react-pdf/renderer'

import { mergeStyles } from '@/common/lib/utils'

const Field = ({ children, style, ...props }: PropsWithChildren<ViewProps>) => {
  return (
    <View
      style={mergeStyles(styles.field, style)}
      {...props}
    >
      {children}
    </View>
  )
}
const styles = StyleSheet.create({
  field: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  }
})

export { Field }
