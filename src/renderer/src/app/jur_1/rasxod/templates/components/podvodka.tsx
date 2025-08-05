import { useTranslation } from 'react-i18next'

import { Blank, Field, Flex, Label, Table } from '@/common/components/pdf'

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
  const { t, i18n } = useTranslation(['pdf-reports'])
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
            {t('application')}
          </Table.Cell>
        </Table.Column>

        <Table.Column
          style={{
            width: columnWidths[1],
            justifyContent: 'center'
          }}
        >
          <Table.Cell>{t('for_what')}</Table.Cell>
        </Table.Column>

        <Table.Column style={{ flex: 1 }}>
          <Table.Row>
            <Table.Column style={{ flex: 1, border: 0 }}>
              <Table.CellView>
                <Flex>
                  <Field>
                    <Label>{t('provodka')} №</Label>
                    <Blank style={{ width: 40 }} />
                  </Field>
                  <Field>
                    <Blank style={{ width: 80 }} />
                    <Label>20</Label>
                    <Blank style={{ width: 20 }} />
                    <Label>{t('year_short')}</Label>
                  </Field>
                </Flex>
              </Table.CellView>
            </Table.Column>
          </Table.Row>

          <Table.Row style={{ border: 0 }}>
            <Table.Column style={{ flex: 1 }}>
              <Table.Row>
                <Table.Column style={{ flex: 1 }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>{t('debet')}</Table.Cell>
                </Table.Column>
                <Table.Column style={{ flex: 1, border: 0 }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>{t('credit')}</Table.Cell>
                </Table.Column>
              </Table.Row>

              <Table.Row style={{ border: 0 }}>
                <Table.Column style={{ flex: 1 }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>{t('schet').toLowerCase()}</Table.Cell>
                </Table.Column>
                <Table.Column style={{ flex: 1 }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>{t('card_short')}</Table.Cell>
                </Table.Column>
                <Table.Column style={{ flex: 1 }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>{t('schet').toLowerCase()}</Table.Cell>
                </Table.Column>
                <Table.Column style={{ flex: 1, border: 0 }}>
                  <Table.Cell style={{ paddingVertical: 1 }}>{t('card_short')}</Table.Cell>
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
              <Label>{t('dovernost')} №</Label>
              <Blank fullWidth />
            </Field>
            <Field>
              {i18n.language === 'ru' ? (
                <>
                  <Label>{t('from_date', { date: '' }).trim()}</Label>
                  <Blank fullWidth />
                  <Label>20</Label>
                  <Blank style={{ width: 25 }} />
                </>
              ) : (
                <>
                  <Blank fullWidth />
                  <Label>20</Label>
                  <Blank style={{ width: 25 }} />
                  <Label>{t('from_date', { date: '' }).trim()}</Label>
                </>
              )}
            </Field>
            <Field>
              <Label>{t('passport_series')}</Label>
              <Blank fullWidth />
            </Field>
            <Field>
              <Label>№</Label>
              <Blank fullWidth />
            </Field>
            <Field>
              <Label>{t('given')}</Label>
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

interface PodvodkaRowProps {
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
