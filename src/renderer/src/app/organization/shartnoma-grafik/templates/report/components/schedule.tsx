import type { ShartnomaGrafikForm } from '../../../service'
import { Table } from '@/common/components/pdf'
import { Text } from '@react-pdf/renderer'
import { formatNumber } from '@/common/lib/format'
import { mergeStyles } from '@/common/lib/utils'
import { monthNames } from '@/common/data/month'
import { useState } from 'react'

const ScheduleCell: typeof Table.Cell = ({ children, style, ...props }) => {
  return (
    <Table.Cell
      {...props}
      style={mergeStyles(style, {
        padding: 1
      })}
    >
      {children}
    </Table.Cell>
  )
}

type WidthsType = [number, number, number]

type ScheduleProps = {
  article: string
  data: ShartnomaGrafikForm
  paymentDetails: string
}
const Schedule = ({ article, data, paymentDetails }: ScheduleProps) => {
  const [widths] = useState([20, 50, 30] as WidthsType)
  const [innerWidths] = useState([50, 25, 25] as WidthsType)

  const total = monthNames.reduce((acc, { name }) => acc + data[name], 0)

  return (
    <>
      <Table>
        <Table.Row>
          <Table.Column style={{ width: percentage(widths[0]) }}>
            <ScheduleCell>{2024} йил ойлар номи</ScheduleCell>
          </Table.Column>
          <Table.Column
            style={{
              width: percentage(widths[1])
            }}
          >
            <Table.Row>
              <ScheduleCell
                style={{
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                Харажат турлари
              </ScheduleCell>
            </Table.Row>
            <Table.Row style={{ borderBottom: 'none', height: 8 }}>
              <Table.Column
                style={{
                  width: percentage(innerWidths[0])
                }}
              >
                <ScheduleCell>{article}</ScheduleCell>
              </Table.Column>
              <Table.Column
                style={{
                  width: percentage(innerWidths[1])
                }}
              >
                <ScheduleCell></ScheduleCell>
              </Table.Column>
              <Table.Column
                style={{
                  width: percentage(innerWidths[2]),
                  borderRight: 'none'
                }}
              >
                <ScheduleCell></ScheduleCell>
              </Table.Column>
            </Table.Row>
          </Table.Column>
          <ScheduleCell
            style={{
              width: percentage(widths[2])
            }}
          >
            Жами
          </ScheduleCell>
        </Table.Row>
        {monthNames.map(({ name, label }) => (
          <ScheduleRow
            key={name}
            name={label}
            value={formatNumber(data[name])}
            widths={widths}
            innerWidths={innerWidths}
          />
        ))}
        <ScheduleRow
          name="Жами"
          value={formatNumber(total)}
          widths={widths}
          innerWidths={innerWidths}
        />
      </Table>
      <Text
        style={{
          fontWeight: 'bold',
          textDecoration: 'underline'
        }}
      >
        {paymentDetails}
      </Text>
    </>
  )
}

type ScheduleRowProps = {
  name: string
  value: string
  widths: WidthsType
  innerWidths: WidthsType
}
const ScheduleRow = ({ name, value, widths, innerWidths }: ScheduleRowProps) => {
  return (
    <Table.Row>
      <Table.Column style={{ width: percentage(widths[0]) }}>
        <ScheduleCell
          style={{
            textAlign: 'left',
            fontStyle: 'italic',
            fontWeight: 'bold'
          }}
        >
          {name}
        </ScheduleCell>
      </Table.Column>
      <Table.Column
        style={{
          width: percentage(widths[1])
        }}
      >
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.Column
            style={{
              width: percentage(innerWidths[0])
            }}
          >
            <ScheduleCell>{value}</ScheduleCell>
          </Table.Column>
          <Table.Column style={{ width: percentage(innerWidths[1]) }}>
            <ScheduleCell></ScheduleCell>
          </Table.Column>
          <Table.Column
            style={{
              width: percentage(innerWidths[2]),
              borderRight: 'none'
            }}
          >
            <ScheduleCell></ScheduleCell>
          </Table.Column>
        </Table.Row>
      </Table.Column>
      <ScheduleCell
        style={{
          width: percentage(widths[2])
        }}
      >
        {value}
      </ScheduleCell>
    </Table.Row>
  )
}

const percentage = (...values: number[]) => {
  return values.reduce((acc, value) => acc + value, 0) + '%'
}

export { Schedule }
