import type { Podpis, WorkTripChild } from '@/common/models'
import type { i18n } from 'i18next'
import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import Transliterator from 'lotin-kirill'
import { useTranslation } from 'react-i18next'

import { formatNumber } from '@/common/lib/format'

const columnSizes = [50, 60, 100, 20, 15, 60]

export const Header: FC<{
  provodki: WorkTripChild[]
  regionName: string
  podpis: Podpis[]
}> = (props) => {
  const { provodki, regionName, podpis } = props
  const { t, i18n } = useTranslation()

  const totalSumma = provodki.reduce((acc, provodka) => acc + provodka.summa, 0)

  return (
    <View>
      <View style={[styles.sectionContainer, { textAlign: 'center', marginTop: 0 }]}>
        <Text>{t('report_sum_send_and_received')}</Text>
      </View>
      <View style={styles.sectionContainer}>
        {provodki.map((provodka) => (
          <View
            key={provodka.id}
            style={styles.provodkaRow}
          >
            <Text style={{ width: columnSizes[0] }}>{t('article').toLowerCase()}</Text>
            <Text style={{ width: columnSizes[1], letterSpacing: 1 }}>
              {provodka?.schet?.sub_schet ?? ''}
            </Text>
            <Text
              style={{
                width: columnSizes[2],
                fontStyle: 'italic',
                fontWeight: 'bold',
                textAlign: 'right',
                paddingRight: 5
              }}
            >
              {formatNumber(provodka.summa)?.split(',')[0]}
            </Text>
            <Text style={{ width: columnSizes[3] }}>{t('sum')}</Text>
            <Text
              style={{
                width: columnSizes[4],
                fontStyle: 'italic',
                fontWeight: 'bold'
              }}
            >
              {formatNumber(provodka.summa)?.split(',')[1]}
            </Text>
            <Text style={{ width: columnSizes[5] }}>{t('penny')}</Text>
          </View>
        ))}

        <View style={styles.provodkaRow}>
          <Text style={{ width: columnSizes[0], fontWeight: 'bold' }}>{t('total')}:</Text>
          <Text style={{ width: columnSizes[1] }}></Text>
          <Text
            style={{
              width: columnSizes[2],
              fontStyle: 'italic',
              fontWeight: 'bold',
              textAlign: 'right',
              paddingRight: 5
            }}
          >
            {formatNumber(totalSumma)?.split(',')[0]}
          </Text>
          <Text style={{ width: columnSizes[3] }}>{t('sum')}</Text>
          <Text
            style={{
              width: columnSizes[4],
              fontStyle: 'italic',
              fontWeight: 'bold'
            }}
          >
            {formatNumber(totalSumma)?.split(',')[1]}
          </Text>
          <Text style={{ width: columnSizes[5] }}>{t('penny')}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        {podpis
          ?.sort((a, b) => a.numeric_poryadok - b.numeric_poryadok)
          ?.map((p) => (
            <View
              key={p.id}
              style={styles.signatureRow}
            >
              <Text style={styles.signatureName}>
                {tValue(regionName, i18n)} {tValue(p.doljnost_name, i18n)}{' '}
                {tValue(p.fio_name, i18n)}
              </Text>
              <View style={styles.signatureBlank}></View>
            </View>
          ))}
      </View>

      <View>
        <Text style={styles.reportTitle}>{t('avans_report')}</Text>
      </View>
    </View>
  )
}

const transliterator = new Transliterator()
const tValue = (value: string, i18n: i18n) => {
  return i18n.language === 'uz' ? value : transliterator.textToCyrillic(value)
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 10,
    width: columnSizes.reduce((acc, size) => acc + size, 0),
    marginLeft: 'auto'
  },
  provodkaRow: {
    marginTop: 5,
    display: 'flex',
    flexDirection: 'row'
  },
  signatureRow: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  signatureName: {
    width: 140
  },
  signatureBlank: {
    flex: 1,
    height: 10,
    borderBottom: '1px solid black'
  },
  reportTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 3,
    textTransform: 'uppercase'
  }
})
