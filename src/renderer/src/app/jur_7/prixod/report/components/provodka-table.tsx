import { Table } from '@/common/components/pdf'

const columnWidths = [30, 80, 180, 60, 50, 50, 50, 100, 120, 80]

export interface ProvodkaType {
  operatsii: string
  debet_schet?: string
  debet_card?: string
  credit_schet?: string
  credit_card?: string
  summa: string
}
export interface PodvodkaTableProps {
  podvodkaList: ProvodkaType[]
}
export const ProvodkaTable = ({ podvodkaList }: PodvodkaTableProps) => {
  return (
    <Table style={{ marginTop: 20, fontSize: 8, lineHeight: 1.2 }}>
      <Table.Row style={{ fontWeight: 'bold' }}>
        <Table.Column
          style={{
            width: columnWidths[0],
            justifyContent: 'center'
          }}
        >
          <Table.Cell
            style={{
              textTransform: 'uppercase',
              letterSpacing: 2
            }}
          >
            №
          </Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[1],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>Маҳсулот номи (хизматлар)</Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[2],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>
            Товар (хизмат) лар Ягона электрон миллий каталоги бўйича идентификация коди ва номи
          </Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[3],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>Улчов бирлиги</Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[4],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>Микдор</Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[5],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>Hapx</Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[6],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>Етказиб бериш қиймати</Table.Cell>
        </Table.Column>

        <Table.Column style={{ width: columnWidths[7] }}>
          <Table.Row style={{ flex: 1 }}>
            <Table.Column style={{ flex: 1, border: 0 }}>
              <Table.Cell>ҚҚС</Table.Cell>
            </Table.Column>
          </Table.Row>

          <Table.Row style={{ flex: 1, borderWidth: 0 }}>
            <Table.Column style={{ height: '100%', flex: 1, borderWidth: 0 }}>
              <Table.Row style={{ height: '100%', borderWidth: 0 }}>
                <Table.Column style={{ flex: 1, height: '100%' }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>Ставка</Table.Cell>
                </Table.Column>
                <Table.Column style={{ flex: 1, height: '100%', border: 0 }}>
                  <Table.Cell style={{ paddingVertical: 1, border: 0 }}>Сумма</Table.Cell>
                </Table.Column>
              </Table.Row>
            </Table.Column>
          </Table.Row>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[8],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>Етказиб беришнинг ҚҚСни ҳисобга олган ҳолда қиймати</Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[9],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>Товарни келиб чиқиши</Table.Cell>
        </Table.Column>
      </Table.Row>

      <Table.Row>
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

interface PodvodkaRowProps {
  noBorder?: boolean
  podvodka?: ProvodkaType
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
          {podvodka?.operatsii}
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
