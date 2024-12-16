import { Text, View } from '@react-pdf/renderer'
import { Flex, Table } from '@/common/components/pdf'
import { formatNumber, unformatNumber } from '@/common/lib/format'

const columnWidths = [160, 100, 220, 100]

type PodvodkaType = {
  operation: string
  debet_schet?: string
  debet_card?: string
  credit_schet?: string
  credit_card?: string
  summa: string
}
type PodvodkaTableProps = {
  podvodkaList: PodvodkaType[]
}
const PodvodkaTable = ({ podvodkaList }: PodvodkaTableProps) => {
  return (
    <View>
      <Table>
        <Table.Row>
          <Table.Column
            style={{
              width: columnWidths[1],
              justifyContent: 'center'
            }}
          >
            <Table.Cell>За что</Table.Cell>
          </Table.Column>

          <Table.Column style={{ flex: 1 }}>
            <Table.Row style={{ border: 0 }}>
              <Table.Column style={{ flex: 1 }}>
                <Table.Row>
                  <Table.Column style={{ flex: 1 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>Дебет</Table.Cell>
                  </Table.Column>
                  <Table.Column style={{ flex: 1, border: 0 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>Кредит</Table.Cell>
                  </Table.Column>
                </Table.Row>

                <Table.Row style={{ border: 0 }}>
                  <Table.Column style={{ flex: 1 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>счет</Table.Cell>
                  </Table.Column>
                  <Table.Column style={{ flex: 1 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>карт.</Table.Cell>
                  </Table.Column>
                  <Table.Column style={{ flex: 1 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>счет</Table.Cell>
                  </Table.Column>
                  <Table.Column style={{ flex: 1, border: 0 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>карт.</Table.Cell>
                  </Table.Column>
                </Table.Row>
              </Table.Column>
              <Table.Column
                style={{
                  border: 0,
                  width: columnWidths[3],
                  justifyContent: 'center'
                }}
              >
                <Table.Cell>Сумма</Table.Cell>
              </Table.Column>
            </Table.Row>
          </Table.Column>
        </Table.Row>

        <Table.Row>
          <Table.Column style={{ flex: 1 }}>
            {podvodkaList.map((podvodka, index) => (
              <PodvodkaRow
                key={index}
                podvodka={podvodka}
                noBorder={index === Math.max(3, podvodkaList.length - 1)}
              />
            ))}
            {Array.from({
              length: 3 - podvodkaList.length
            }).map((_, index) => (
              <PodvodkaRow
                key={podvodkaList.length + index}
                noBorder={index === 3 - podvodkaList.length}
              />
            ))}
          </Table.Column>
        </Table.Row>
      </Table>
      <Flex style={{ marginTop: 4 }}>
        <Flex.Item>{undefined}</Flex.Item>
        <Flex.Item>
          <Flex justifyContent="space-between">
            <Text
              style={{
                fontWeight: 'bold',
                fontStyle: 'italic'
              }}
            >
              Итого:
            </Text>
            <Text style={{ fontWeight: 'bold' }}>
              {formatNumber(
                podvodkaList.reduce((acc, podvodka) => {
                  return acc + (podvodka?.summa ? unformatNumber(podvodka.summa) : 0)
                }, 0)
              )}
            </Text>
          </Flex>
        </Flex.Item>
      </Flex>
    </View>
  )
}

type PodvodkaRowProps = {
  noBorder?: boolean
  podvodka?: PodvodkaType
}
const PodvodkaRow = ({ noBorder, podvodka }: PodvodkaRowProps) => {
  return (
    <Table.Row
      style={{
        alignItems: 'stretch',
        border: noBorder ? 0 : undefined
      }}
    >
      <Table.Column
        style={{
          width: columnWidths[1]
        }}
      >
        <Table.Cell
          style={{
            minHeight: 16,
            fontSize: 8
          }}
        >
          {podvodka?.operation}
        </Table.Cell>
      </Table.Column>

      <Table.Column style={{ flex: 1, border: 0 }}>
        <Table.Row
          style={{
            border: 0,
            flex: 1,
            alignItems: 'stretch'
          }}
        >
          <Table.Column style={{ flex: 1 }}>
            <Table.Row
              style={{
                flex: 1,
                border: 0,
                alignItems: 'stretch'
              }}
            >
              <Table.Column style={{ flex: 1 }}>
                <Table.Cell
                  style={{
                    minHeight: 40,
                    flex: 1
                  }}
                >
                  {podvodka?.debet_schet}
                </Table.Cell>
              </Table.Column>

              <Table.Column style={{ flex: 1 }}>
                <Table.Cell
                  style={{
                    minHeight: 40,
                    flex: 1
                  }}
                >
                  {podvodka?.debet_card}
                </Table.Cell>
              </Table.Column>

              <Table.Column style={{ flex: 1 }}>
                <Table.Cell style={{ minHeight: 40, flex: 1 }}>{podvodka?.credit_schet}</Table.Cell>
              </Table.Column>

              <Table.Column style={{ flex: 1, border: 0 }}>
                <Table.Cell style={{ minHeight: 40, flex: 1 }}>{podvodka?.credit_card}</Table.Cell>
              </Table.Column>
            </Table.Row>
          </Table.Column>

          <Table.Column style={{ width: columnWidths[3], border: 0 }}>
            <Table.Cell style={{ minHeight: 40, flex: 1 }}>{podvodka?.summa ?? ''}</Table.Cell>
          </Table.Column>
        </Table.Row>
      </Table.Column>
    </Table.Row>
  )
}

export { PodvodkaTable }
export type { PodvodkaType, PodvodkaTableProps }
