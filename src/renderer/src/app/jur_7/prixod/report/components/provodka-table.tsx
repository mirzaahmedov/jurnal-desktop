import { Fragment } from 'react/jsx-runtime'

import { Table } from '@/common/components/pdf'
import { formatNumber } from '@/common/lib/format'

const columnWidths = [30, 80, 180, 60, 50, 50, 50, 100, 120, 80]

const rows = [
  {
    name: 'Бухгалтерия булимида, <<АRM- Зарплата-"Бухгалтерия хисобини юритиш" 1 дастурий махсулларини кайта урнатиш хамда узлуксиз ишлашини таъминлаш (1-ярим йил учун)',
    catalog_name:
      '10305001001000000 Ахборот ва бошқарув тизимлари ва ҳар қандай платформалар учун дастурий таъминотни лойиҳалаштириш, уларнинг алоҳида босқичларини амалга ошириш, ишлаб чиқиш, жорий этиш ва/ёки реализация қилиш (сотиш) хизматлари',
    edin: 'xizmat (marta)',
    quantity: 1,
    price: 3000000999,
    delivery_cost: 3000000,
    nds_rate: 0,
    nds_summa: 0,
    delivery_cost_with_nds: 3000000,
    origin: "Xizmat ko'rsatish"
  }
]

export interface ProvodkaType {
  operatsii: string
  debet_schet?: string
  debet_card?: string
  credit_schet?: string
  credit_card?: string
  summa: string
}
export const ProvodkaTable = () => {
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
                <Table.Column style={{ flex: 1, height: '100%', justifyContent: 'center' }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>Ставка</Table.Cell>
                </Table.Column>
                <Table.Column
                  style={{ flex: 1, height: '100%', border: 0, justifyContent: 'center' }}
                >
                  <Table.Cell
                    style={{
                      paddingVertical: 1,
                      border: 0
                    }}
                  >
                    Сумма
                  </Table.Cell>
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
          ></Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[1],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>1</Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[2],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>2</Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[3],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>3</Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[4],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>4</Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[5],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>5</Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[6],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>6</Table.Cell>
        </Table.Column>

        <Table.Column style={{ width: columnWidths[7] }}>
          <Table.Row style={{ flex: 1, borderWidth: 0 }}>
            <Table.Column style={{ height: '100%', flex: 1, borderWidth: 0 }}>
              <Table.Row style={{ height: '100%', borderWidth: 0 }}>
                <Table.Column style={{ flex: 1, height: '100%', justifyContent: 'center' }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>7</Table.Cell>
                </Table.Column>
                <Table.Column
                  style={{ flex: 1, height: '100%', border: 0, justifyContent: 'center' }}
                >
                  <Table.Cell style={{ paddingVertical: 1, border: 0 }}>8</Table.Cell>
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
          <Table.Cell>9</Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[9],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>10</Table.Cell>
        </Table.Column>
      </Table.Row>

      {rows.map((row, index) => (
        <Table.Row key={index}>
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
              {index + 1}
            </Table.Cell>
          </Table.Column>
          <Table.Column
            style={{
              width: columnWidths[1],
              justifyContent: 'center'
            }}
          >
            <Table.Cell>{row.name}</Table.Cell>
          </Table.Column>
          <Table.Column
            style={{
              width: columnWidths[2],
              justifyContent: 'center'
            }}
          >
            <Table.Cell>{row.catalog_name}</Table.Cell>
          </Table.Column>
          <Table.Column
            style={{
              width: columnWidths[3],
              justifyContent: 'center'
            }}
          >
            <Table.Cell>{row.edin}</Table.Cell>
          </Table.Column>

          <Table.Column
            style={{
              width: columnWidths[4],
              justifyContent: 'center'
            }}
          >
            <Table.Cell>{row.quantity}</Table.Cell>
          </Table.Column>

          <Table.Column
            style={{
              flex: 1,
              width: columnWidths[5],
              justifyContent: 'center'
            }}
          >
            <Table.Cell hyphenationCallback={(word) => [word]}>
              <AutoWrapText
                text={formatNumber(row.price)}
                width={columnWidths[5]}
              />
            </Table.Cell>
          </Table.Column>

          <Table.Column
            style={{
              width: columnWidths[6],
              justifyContent: 'center'
            }}
          >
            <Table.Cell>
              <AutoWrapText
                text={formatNumber(row.delivery_cost)}
                width={columnWidths[6]}
              />
            </Table.Cell>
          </Table.Column>

          <Table.Column style={{ width: columnWidths[7] }}>
            <Table.Row style={{ flex: 1, borderWidth: 0 }}>
              <Table.Column style={{ height: '100%', flex: 1, borderWidth: 0 }}>
                <Table.Row style={{ height: '100%', borderWidth: 0 }}>
                  <Table.Column style={{ flex: 1, height: '100%', justifyContent: 'center' }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>{row.nds_rate}</Table.Cell>
                  </Table.Column>
                  <Table.Column
                    style={{ flex: 1, height: '100%', border: 0, justifyContent: 'center' }}
                  >
                    <Table.Cell style={{ paddingVertical: 1, border: 0 }}>
                      <AutoWrapText
                        text={formatNumber(row.nds_summa)}
                        width={columnWidths[6]}
                      />
                    </Table.Cell>
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
            <Table.Cell>
              <AutoWrapText
                text={formatNumber(row.delivery_cost_with_nds)}
                width={columnWidths[8]}
              />
            </Table.Cell>
          </Table.Column>
          <Table.Column
            style={{
              width: columnWidths[9],
              justifyContent: 'center'
            }}
          >
            <Table.Cell>{row.origin}</Table.Cell>
          </Table.Column>
        </Table.Row>
      ))}

      <Table.Row key="total">
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
          ></Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[1],
            justifyContent: 'center'
          }}
        >
          <Table.Cell style={{ textAlign: 'right' }}>Жами:</Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[2],
            justifyContent: 'center'
          }}
        >
          <Table.Cell></Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[3],
            justifyContent: 'center'
          }}
        >
          <Table.Cell></Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[4],
            justifyContent: 'center'
          }}
        >
          <Table.Cell></Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[5],
            justifyContent: 'center'
          }}
        >
          <Table.Cell></Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[6],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>
            {formatNumber(rows.reduce((result, row) => result + row.delivery_cost, 0))}
          </Table.Cell>
        </Table.Column>

        <Table.Column style={{ width: columnWidths[7] }}>
          <Table.Row style={{ flex: 1, borderWidth: 0 }}>
            <Table.Column style={{ height: '100%', flex: 1, borderWidth: 0 }}>
              <Table.Row style={{ height: '100%', borderWidth: 0 }}>
                <Table.Column style={{ flex: 1, height: '100%' }}>
                  <Table.Cell style={{ paddingVertical: 1 }}></Table.Cell>
                </Table.Column>
                <Table.Column style={{ flex: 1, height: '100%', border: 0 }}>
                  <Table.Cell style={{ paddingVertical: 1, border: 0 }}></Table.Cell>
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
          <Table.Cell>
            {formatNumber(rows.reduce((result, row) => result + row.delivery_cost_with_nds, 0))}
          </Table.Cell>
        </Table.Column>
        <Table.Column
          style={{
            width: columnWidths[9],
            justifyContent: 'center'
          }}
        >
          <Table.Cell></Table.Cell>
        </Table.Column>
      </Table.Row>
    </Table>
  )
}

interface AutoWrapText {
  text: string
  width: number
}
const AutoWrapText = ({ text, width }: AutoWrapText) => {
  return (
    <Fragment>
      {text.split('\n').map((line, i) => {
        const maxChars = Math.floor(width / 4)
        const regex = new RegExp(`.{1,${maxChars}}`, 'g')
        return line.match(regex)?.map((chunk, j) => (
          <Fragment key={`${i}-${j}`}>
            {chunk}
            <br />
          </Fragment>
        ))
      })}
    </Fragment>
  )
}
