import type { ReactNode } from 'react'
import type { ViewProps } from '@react-pdf/renderer'

import { View, StyleSheet } from '@react-pdf/renderer'
import { mergeStyles } from '@/common/lib/utils'

type FlexProps = ViewProps & {
  direction?: 'row' | 'column'
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  children: ReactNode
}
const Flex = ({
  direction = 'row',
  alignItems = 'center',
  justifyContent = 'flex-start',
  children,
  style
}: FlexProps) => {
  return (
    <View
      style={mergeStyles(
        styles.flexContainer,
        {
          flexDirection: direction,
          alignItems,
          justifyContent
        },
        style
      )}
    >
      {children}
    </View>
  )
}

type FlexItemProps = {
  flex?: number
  children: ReactNode
}
const FlexItem = ({ flex = 1, children }: FlexItemProps) => {
  return <View style={{ flex }}>{children}</View>
}

const styles = StyleSheet.create({
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
})
Flex.Item = FlexItem

export { Flex }
