import { Blank, Field, Flex, Label, Table } from '@/common/components/pdf'

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
    <Table>
      <Table.Row>
        <Table.Column
          style={{
            width: columnWidths[0],
            justifyContent: 'center'
          }}
        >
          <Table.Cell
            style={{
              textTransform: 'uppercase',
              fontSize: 12,
              letterSpacing: 2
            }}
          >
            Приложение
          </Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[1],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>За что</Table.Cell>
        </Table.Column>

        <Table.Column style={{ flex: 1 }}>
          <Table.Row>
            <Table.Column style={{ flex: 1, border: 0 }}>
              <Table.CellView>
                <Flex>
                  <Field>
                    <Label>Проводка №</Label>
                    <Blank style={{ width: 40 }} />
                  </Field>
                  <Field>
                    <Blank style={{ width: 80 }} />
                    <Label>20</Label>
                    <Blank style={{ width: 20 }} />
                    <Label>г.</Label>
                  </Field>
                </Flex>
              </Table.CellView>
            </Table.Column>
          </Table.Row>

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
        <Table.Column
          wrap
          style={{ width: columnWidths[0], padding: 4 }}
        >
          <Table.CellView
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}
          >
            <Field>
              <Label>Доверенность №</Label>
              <Blank fullWidth />
            </Field>
            <Field>
              <Label>от</Label>
              <Blank fullWidth />
              <Label>20</Label>
              <Blank style={{ width: 25 }} />
            </Field>
            <Field>
              <Label>Паспорт серии</Label>
              <Blank fullWidth />
            </Field>
            <Field>
              <Label>№</Label>
              <Blank fullWidth />
            </Field>
            <Field>
              <Label>выдан</Label>
              <Blank fullWidth />
            </Field>
          </Table.CellView>
        </Table.Column>

        <Table.Column style={{ flex: 1 }}>
          {podvodkaList.map((podvodka, index) => (
            <PodvodkaRow
              key={index}
              podvodka={podvodka}
              noBorder={index === Math.max(5, podvodkaList.length - 1)}
            />
          ))}
          {Array.from({
            length: 6 - podvodkaList.length
          }).map((_, index) => (
            <PodvodkaRow
              key={podvodkaList.length + index}
              noBorder={index === 5 - podvodkaList.length}
            />
          ))}
        </Table.Column>
      </Table.Row>
    </Table>
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
                <Table.Cell style={{ minHeight: 16, flex: 1 }}>{podvodka?.debet_schet}</Table.Cell>
              </Table.Column>

              <Table.Column style={{ flex: 1 }}>
                <Table.Cell style={{ minHeight: 16, flex: 1 }}>{podvodka?.debet_card}</Table.Cell>
              </Table.Column>

              <Table.Column style={{ flex: 1 }}>
                <Table.Cell style={{ minHeight: 16, flex: 1 }}>{podvodka?.credit_schet}</Table.Cell>
              </Table.Column>

              <Table.Column style={{ flex: 1, border: 0 }}>
                <Table.Cell style={{ minHeight: 16, flex: 1 }}>{podvodka?.credit_card}</Table.Cell>
              </Table.Column>
            </Table.Row>
          </Table.Column>

          <Table.Column style={{ width: columnWidths[3], border: 0 }}>
            <Table.Cell style={{ minHeight: 16, flex: 1 }}>{podvodka?.summa}</Table.Cell>
          </Table.Column>
        </Table.Row>
      </Table.Column>
    </Table.Row>
  )
}

export { PodvodkaTable }
export type { PodvodkaTableProps, PodvodkaType }
