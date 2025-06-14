import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export interface ProvodkaTableProps {
  rows: {
    name: string
    unit: string
    count: number
    price: number
    sum: number
    debet: string
    credit: string
    prixod_date: string
  }[]
}
export const ProvodkaTable = ({ rows }: ProvodkaTableProps) => {
  const total = rows.reduce((result, row) => result + row.sum, 0)
  return (
    <View>
      <View style={styles.table_header}>
        {columnDefs.map((column, index) => (
          <View
            style={[
              styles.table_head,
              {
                width: column.width,
                borderRight: index === columnDefs.length - 1 ? 'none' : undefined
              }
            ]}
            key={column.field}
          >
            <Text>{column.headerName}</Text>
          </View>
        ))}
      </View>
      <View>
        {rows.map((row, index) => (
          <View
            key={index}
            style={styles.table_row}
          >
            {columnDefs.map((column) => (
              <View
                key={column.field}
                style={[styles.table_cell, { width: column.width }]}
              >
                <Text>
                  {'formatter' in column ? column.formatter(row[column.field]) : row[column.field]}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.total}>
        <Text style={[styles.total_cell, styles.total_label]}>Всего:</Text>
        <Text style={[styles.total_cell, styles.total_value]}>{formatNumber(total)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  table_header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    border: '1px solid black'
  },
  table_head: {
    paddingVertical: 1,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRight: '1px solid black'
  },
  table_row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottom: '1px solid black'
  },
  table_cell: {
    paddingVertical: 2,
    fontSize: 8,
    textAlign: 'center'
  },
  total: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4
  },
  total_cell: {
    height: 18,
    padding: 2,
    border: '1px solid black'
  },
  total_label: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'right',
    paddingLeft: 20
  },
  total_value: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'right',
    paddingTop: 4,
    paddingHorizontal: 5
  }
})

const columnDefs = [
  {
    field: 'name',
    headerName: 'Наименование',
    width: 240
  },
  {
    field: 'unit',
    headerName: 'Ед.изм',
    width: 50
  },
  {
    field: 'count',
    headerName: 'Кол',
    width: 70
  },
  {
    field: 'price',
    headerName: 'Цена',
    width: 100,
    formatter: (value: any) => formatNumber(value)
  },
  {
    field: 'sum',
    headerName: 'Сумма',
    width: 100,
    formatter: (value: any) => formatNumber(value)
  },
  {
    field: 'debet',
    headerName: 'Дебет',
    width: 70
  },
  {
    field: 'credit',
    headerName: 'Кредит',
    width: 70
  },
  {
    field: 'prixod_date',
    headerName: 'Дата пр',
    width: 60,
    formatter: (value: any) => formatLocaleDate(value)
  }
] as const
