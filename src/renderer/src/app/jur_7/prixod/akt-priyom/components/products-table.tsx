import type { MaterialPrixodProvodka } from '@/common/models'
import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Table } from '@/common/components/pdf'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

const columnWidths = [160, 40, 60, 60, 70, 70, 70, 70]

export const ProductsTable: FC<{
  products: MaterialPrixodProvodka[]
}> = ({ products }) => {
  const { t } = useTranslation()

  const totalSumma = products.reduce((acc, product) => acc + product.summa, 0)

  return (
    <View style={styles.container}>
      <Table>
        <Table.Row>
          <Table.Column style={{ width: columnWidths[0] }}>
            <Table.Cell style={[styles.tableHeader, { textAlign: 'left' }]}>{t('name')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[1] }}>
            <Table.Cell style={styles.tableHeader}>{t('ei')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[2] }}>
            <Table.Cell style={styles.tableHeader}>{t('kol')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[3] }}>
            <Table.Cell style={styles.tableHeader}>{t('sena')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[4] }}>
            <Table.Cell style={styles.tableHeader}>{t('summa')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[5] }}>
            <Table.Cell style={styles.tableHeader}>{t('debet')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[6] }}>
            <Table.Cell style={styles.tableHeader}>{t('kredit')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[7], borderRight: 0 }}>
            <Table.Cell style={styles.tableHeader}>{t('date')}</Table.Cell>
          </Table.Column>
        </Table.Row>

        {products.map((product) => (
          <Table.Row key={product.id}>
            <Table.Column style={{ width: columnWidths[0] }}>
              <Table.Cell style={{ textAlign: 'left' }}>{product.name}</Table.Cell>
            </Table.Column>
            <Table.Column style={{ width: columnWidths[1] }}>
              <Table.Cell style={{ fontSize: 6 }}>{product.edin}</Table.Cell>
            </Table.Column>
            <Table.Column style={{ width: columnWidths[2] }}>
              <Table.Cell>{formatNumber(product.kol, 0)}</Table.Cell>
            </Table.Column>
            <Table.Column style={{ width: columnWidths[3] }}>
              <Table.Cell>{formatNumber(product.sena)}</Table.Cell>
            </Table.Column>
            <Table.Column style={{ width: columnWidths[4] }}>
              <Table.Cell>{formatNumber(product.summa)}</Table.Cell>
            </Table.Column>
            <Table.Column style={{ width: columnWidths[5] }}>
              <Table.Cell>
                {product.debet_schet}
                {' - '}
                <Text style={styles.subSchetValue}>{product.debet_sub_schet}</Text>
              </Table.Cell>
            </Table.Column>
            <Table.Column style={{ width: columnWidths[6] }}>
              <Table.Cell>
                {product.kredit_schet}
                {' - '}
                <Text style={styles.subSchetValue}>{product.kredit_sub_schet}</Text>
              </Table.Cell>
            </Table.Column>
            <Table.Column style={{ width: columnWidths[7], borderRight: 0 }}>
              <Table.Cell>{formatLocaleDate(product.data_pereotsenka)}</Table.Cell>
            </Table.Column>
          </Table.Row>
        ))}
        <View style={styles.totalRow}>
          <View style={{ width: columnWidths[0] }}></View>
          <View style={{ width: columnWidths[1] }}></View>
          <View style={{ width: columnWidths[2] }}></View>
          <Table.Column style={{ width: columnWidths[3] }}>
            <Table.Cell>
              <Text style={styles.tableHeader}>{t('total')}:</Text>
            </Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[4] }}>
            <Table.Cell>
              <Text style={styles.tableHeader}>{formatNumber(totalSumma)}</Text>
            </Table.Cell>
          </Table.Column>
          <View style={{ width: columnWidths[5] }}></View>
          <View style={{ width: columnWidths[6] }}></View>
          <View style={{ width: columnWidths[7], borderRight: 0 }}></View>
        </View>
      </Table>

      <View style={styles.summaryTable}>
        <Table.Row style={styles.summaryRow}>
          <Text style={styles.summaryHeader}>
            {t('debet')} {t('schet').toLowerCase()}
          </Text>
          <Text style={styles.summaryHeader}>
            {t('debet')} {t('subschet').toLowerCase()}
          </Text>
          <Text style={styles.summaryHeader}>
            {t('kredit')} {t('schet').toLowerCase()}
          </Text>
          <Text style={styles.summaryHeader}>{t('summa')}</Text>
        </Table.Row>
        {groupAndSumProvodka(products ?? [])?.map((product) => (
          <Table.Row
            key={product.id}
            style={styles.summaryRow}
          >
            <Text style={styles.summaryCell}>{product.debet_schet}</Text>
            <Text style={styles.summaryCell}>{product.debet_sub_schet}</Text>
            <Text style={styles.summaryCell}>{product.kredit_schet}</Text>
            <Text style={styles.summaryCell}>{formatNumber(product.summa)}</Text>
          </Table.Row>
        ))}
      </View>
    </View>
  )
}

const groupAndSumProvodka = (products: MaterialPrixodProvodka[]) => {
  const grouped = products.reduce(
    (result, item) => {
      const key = `${item.debet_schet}_${item.debet_sub_schet}_${item.kredit_schet}`
      if (result[key]) {
        result[key].summa += item.summa
      } else {
        result[key] = { ...item }
      }
      return result
    },
    {} as Record<string, MaterialPrixodProvodka>
  )

  return Object.values(grouped).sort((a, b) => {
    if (a.debet_schet !== b.debet_schet) {
      return a.debet_schet.localeCompare(b.debet_schet)
    }
    if (a.debet_sub_schet !== b.debet_sub_schet) {
      return a.debet_sub_schet.localeCompare(b.debet_sub_schet)
    }
    if (a.kredit_schet !== b.kredit_schet) {
      return a.kredit_schet.localeCompare(b.kredit_schet)
    }
    return 0
  })
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    fontSize: 9
  },
  subSchetValue: {
    fontSize: 8
  },
  tableHeader: {
    fontWeight: 'bold'
  },
  totalRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  summaryTable: {
    width: 260,
    marginTop: 20,
    marginLeft: 'auto'
  },
  summaryRow: {
    paddingVertical: 5
  },
  summaryHeader: {
    width: 80,
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  summaryCell: {
    width: 80,
    fontStyle: 'italic'
  }
})
