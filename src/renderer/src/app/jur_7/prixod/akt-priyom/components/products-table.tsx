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

  return (
    <View style={styles.container}>
      <Table>
        <Table.Row>
          <Table.Column style={{ width: columnWidths[0] }}>
            <Table.Cell>{t('name')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[1] }}>
            <Table.Cell>{t('ei')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[2] }}>
            <Table.Cell>{t('kol')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[3] }}>
            <Table.Cell>{t('sena')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[4] }}>
            <Table.Cell>{t('summa')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[5] }}>
            <Table.Cell>{t('debet')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[6] }}>
            <Table.Cell>{t('kredit')}</Table.Cell>
          </Table.Column>
          <Table.Column style={{ width: columnWidths[7] }}>
            <Table.Cell>{t('date')}</Table.Cell>
          </Table.Column>
        </Table.Row>

        {products.map((product) => (
          <Table.Row key={product.id}>
            <Table.Column style={{ width: columnWidths[0] }}>
              <Table.Cell>{product.name}</Table.Cell>
            </Table.Column>
            <Table.Column style={{ width: columnWidths[1] }}>
              <Table.Cell>{product.edin}</Table.Cell>
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
            <Table.Column style={{ width: columnWidths[7] }}>
              <Table.Cell>{formatLocaleDate(product.data_pereotsenka)}</Table.Cell>
            </Table.Column>
          </Table.Row>
        ))}
      </Table>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    fontSize: 9
  },
  subSchetValue: {
    fontSize: 8
  }
})
