import { Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex, Table } from '@/common/components/pdf'
import { formatNumber, unformatNumber } from '@/common/lib/format'

const columnWidths = [160, 100, 220, 100]

interface PodvodkaType {
  operatsii: string
  debet_schet?: string
  debet_card?: string
  credit_schet?: string
  credit_card?: string
  summa: string
}
interface PodvodkaTableProps {
  podvodkaList: PodvodkaType[]
}
const PodvodkaTable = ({ podvodkaList }: PodvodkaTableProps) => {
  const { t } = useTranslation(['pdf-reports'])
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
            <Table.Cell>{t('for_what')}</Table.Cell>
          </Table.Column>

          <Table.Column style={{ flex: 1 }}>
            <Table.Row style={{ border: 0 }}>
              <Table.Column style={{ flex: 1 }}>
                <Table.Row>
                  <Table.Column style={{ flex: 1 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>{t('debet')}</Table.Cell>
                  </Table.Column>
                  <Table.Column style={{ flex: 1, border: 0 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>{t('kredit')}</Table.Cell>
                  </Table.Column>
                </Table.Row>

                <Table.Row style={{ border: 0 }}>
                  <Table.Column style={{ flex: 1 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>
                      {t('schet').toLowerCase()}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column style={{ flex: 1 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>
                      {t('card_short').toLowerCase()}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column style={{ flex: 1 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>
                      {t('schet').toLowerCase()}
                    </Table.Cell>
                  </Table.Column>
                  <Table.Column style={{ flex: 1, border: 0 }}>
                    <Table.Cell style={{ paddingVertical: 1 }}>
                      {t('card_short').toLowerCase()}
                    </Table.Cell>
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
                <Table.Cell>{t('summa')}</Table.Cell>
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
              {t('total')}:
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
