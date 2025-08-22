import type { ShartnomaGrafik } from '@/common/models/shartnoma'

import { useEffect, useState } from 'react'

import { Text } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex, Table } from '@/common/components/pdf'
import { monthNames } from '@/common/data/month'
import { formatNumber } from '@/common/lib/format'
import { mergeStyles, numberToWords } from '@/common/lib/utils'

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

interface ShartnomaSmetaGrafiksTableProps {
  year: number
  grafiks: ShartnomaGrafik[]
  singlePage: boolean
  summaValue: number
}
export const ShartnomaSmetaGrafiksTable = ({
  year,
  grafiks,
  singlePage,
  summaValue
}: ShartnomaSmetaGrafiksTableProps) => {
  const [widths, setWidths] = useState(singlePage ? [15, 60, 25] : [10, 75, 15])
  const [innerWidths] = useState([100, 100, 100, 100, 100, 100, 100])

  const { t, i18n } = useTranslation(['pdf-reports'])

  useEffect(() => {
    setWidths(singlePage ? [15, 60, 25] : [15, 75, 15])
  }, [singlePage])

  return (
    <>
      <Table>
        <Table.Row>
          <Table.Column style={{ width: percentage(widths[0]) }}>
            <ScheduleCell>{t('months_of_year', { year })}</ScheduleCell>
          </Table.Column>
          <Table.Column
            style={{
              width: percentage(widths[1]),
              minHeight: 25
            }}
          >
            <Table.Row>
              <ScheduleCell
                style={{
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                {t('expense_types')}
              </ScheduleCell>
            </Table.Row>
            <Table.Row style={{ borderBottom: 'none', flex: 1 }}>
              {grafiks?.map((grafik, index) => (
                <Table.Column
                  key={index}
                  style={{
                    width: percentage(innerWidths[index]),
                    borderRightWidth: index === grafiks.length - 1 ? 0 : 1
                  }}
                >
                  <ScheduleCell>
                    {t('st')}: {grafik?.smeta?.smeta_number}
                  </ScheduleCell>
                </Table.Column>
              ))}
              {grafiks.length < 2
                ? Array.from({ length: 2 - grafiks.length }).map((_, index) => (
                    <Table.Column
                      key={index}
                      style={{
                        width: '50%',
                        borderRightWidth: 0,
                        borderLeftWidth: 1
                      }}
                    >
                      <ScheduleCell style={{ height: '100%' }}></ScheduleCell>
                    </Table.Column>
                  ))
                : null}
            </Table.Row>
          </Table.Column>
          <ScheduleCell
            style={{
              width: percentage(widths[2])
            }}
          >
            {t('total')}
          </ScheduleCell>
        </Table.Row>
        {monthNames.map(({ name, label }) => (
          <ScheduleRow
            key={name}
            name={t(label)}
            field={name}
            grafiks={grafiks}
            widths={widths}
            innerWidths={innerWidths}
          />
        ))}
        <ScheduleRow
          name={t('total')}
          field="itogo"
          grafiks={grafiks}
          widths={widths}
          innerWidths={innerWidths}
        />
      </Table>

      <Flex style={{ gap: 100, marginVertical: 10 }}>
        <Text style={{ fontSize: 11, fontWeight: 'bold', textDecoration: 'underline' }}>
          {t('total')}
        </Text>
        <Text style={{ fontSize: 11, fontWeight: 'bold', textDecoration: 'underline' }}>
          {formatNumber(summaValue)}
        </Text>
      </Flex>

      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          letterSpacing: 2
        }}
      >
        ({numberToWords(summaValue, i18n.language)})
      </Text>

      <Text
        style={{
          textAlign: 'center',
          marginTop: 10
        }}
      >
        {t('contract_deadline_static')}
      </Text>

      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: 10
        }}
      >
        {t('contract_deadline')}
      </Text>
    </>
  )
}

type ScheduleRowProps = {
  name: string
  field: keyof ShartnomaGrafik
  grafiks: ShartnomaGrafik[]
  widths: number[]
  innerWidths: number[]
}
const ScheduleRow = ({ name, field, grafiks, widths, innerWidths }: ScheduleRowProps) => {
  const itogo = grafiks.reduce((result, grafik) => result + Number(grafik[field]), 0)
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
          {grafiks?.map((grafik, index) => (
            <Table.Column
              key={index}
              style={{
                width: percentage(innerWidths[index]),
                borderRightWidth: index === grafiks.length - 1 ? 0 : 1
              }}
            >
              <ScheduleCell>{formatNumber(Number(grafik[field]))}</ScheduleCell>
            </Table.Column>
          ))}
          {grafiks.length < 2
            ? Array.from({ length: 2 - grafiks.length }).map((_, index) => (
                <Table.Column
                  key={index}
                  style={{
                    width: '50%',
                    borderRightWidth: 0,
                    borderLeftWidth: 1
                  }}
                >
                  <ScheduleCell></ScheduleCell>
                </Table.Column>
              ))
            : null}
        </Table.Row>
      </Table.Column>
      <ScheduleCell
        style={{
          width: percentage(widths[2])
        }}
      >
        {formatNumber(itogo)}
      </ScheduleCell>
    </Table.Row>
  )
}

const percentage = (...values: number[]) => {
  return values.reduce((acc, value) => acc + value, 0) + '%'
}
