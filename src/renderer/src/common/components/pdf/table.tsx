import type { PropsWithChildren } from 'react'
import type { TextProps, ViewProps } from '@react-pdf/renderer'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { mergeStyles } from '@/common/lib/utils'

const Table = (props: PropsWithChildren<ViewProps>) => {
  return (
    <View {...props} style={mergeStyles([styles.table, props.style])}>
      {props.children}
    </View>
  )
}

const TableRow = (props: PropsWithChildren<ViewProps>) => {
  return (
    <View {...props} style={mergeStyles([styles.row, props.style])}>
      {props.children}
    </View>
  )
}

const TableColumn = (props: PropsWithChildren<ViewProps>) => {
  return (
    <View {...props} style={mergeStyles([styles.column, props.style])}>
      {props.children}
    </View>
  )
}

const TableCell = (props: PropsWithChildren<TextProps>) => {
  return (
    <Text {...props} style={mergeStyles([styles.cell, props.style])}>
      {props.children}
    </Text>
  )
}

const TableCellView = (props: PropsWithChildren<ViewProps>) => {
  return (
    <View {...props} style={mergeStyles([styles.cell, props.style])}>
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  table: {
    display: 'flex',
    flexDirection: 'column',
    border: 1
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: '#000',
    borderBottomWidth: 1
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    borderRightColor: '#000',
    borderRightWidth: 1
  },
  cell: {
    padding: 4,
    textAlign: 'center'
  }
})

Table.Row = TableRow
Table.Column = TableColumn
Table.Cell = TableCell
Table.CellView = TableCellView

export { Table }
