import type { WorkTripRoad } from '@/common/models'
import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

export const Details: FC<{
  regionName: string
  workerPosition: string
  workerRank: string
  workerFIO: string
  roads: WorkTripRoad[]
  year: number
}> = ({ regionName, workerPosition, workerRank, workerFIO, roads, year }) => {
  const { t } = useTranslation()

  const dests = Array.from(new Set(roads.flatMap((road) => [road.from, road.to])))

  return (
    <>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.workerName}>
          {regionName} {workerPosition} {workerRank} {workerFIO}
        </Text>

        <View style={styles.divider}></View>

        <Text style={styles.subText}>
          (хисобдор шахснинг мансаби, ҳарбий унвони, фамилияси исми ва отасининг исми)
        </Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.workerName}>{dests.map((dest) => dest).join(', ')}</Text>

        <View style={styles.divider}></View>

        <Text style={styles.subText}>(хизмат сафари манзили)</Text>
      </View>

      <View style={styles.summaContainer}>
        <View style={[styles.flexRow, styles.summaRow]}>
          <Text>{t('taken')}</Text>
          <View style={[styles.flexRow, { gap: 1 }]}>
            <Text>&quot;</Text>
            <Text style={styles.blank}>{' '.repeat(8)}</Text>
            <Text>&quot;</Text>
            <Text style={styles.blank}>{' '.repeat(40)}</Text>
          </View>

          <Text style={styles.boldValue}>{year}</Text>
          <View style={[styles.flexRow, { gap: 1, flex: 1 }]}>
            <Text style={[styles.blank, { flex: 1 }]}>{' '.repeat(8)}</Text>
            <Text>{t('sum')}</Text>
            <Text style={styles.blank}>{' '.repeat(8)}</Text>
            <Text>{t('penny')}</Text>
          </View>
        </View>

        <View style={[styles.flexRow, styles.summaRow]}>
          <View style={{ width: 70 }}></View>
          <Text>Харажат қилинган</Text>
          <View style={[styles.flexRow, { gap: 1, flex: 1 }]}>
            <Text style={[styles.blank, { flex: 1 }]}>{' '.repeat(8)}</Text>
            <Text>{t('sum')}</Text>
            <Text style={styles.blank}>{' '.repeat(8)}</Text>
            <Text>{t('penny')}</Text>
          </View>
        </View>

        <View style={[styles.flexRow, styles.summaRow]}>
          <View style={{ width: 70 }}></View>
          <Text>Колдик</Text>
          <View style={[styles.flexRow, { gap: 1, flex: 1 }]}>
            <Text style={[styles.blank, { flex: 1 }]}>{' '.repeat(8)}</Text>
            <Text>{t('sum')}</Text>
            <Text style={styles.blank}>{' '.repeat(8)}</Text>
            <Text>{t('penny')}</Text>
          </View>
        </View>

        <View style={[styles.flexRow, styles.summaRow]}>
          <View style={{ width: 70 }}></View>
          <Text>Ошикча харажат</Text>
          <View style={[styles.flexRow, { gap: 1, flex: 1 }]}>
            <Text style={[styles.blank, { flex: 1 }]}>{' '.repeat(8)}</Text>
            <Text>{t('sum')}</Text>
            <Text style={styles.blank}>{' '.repeat(8)}</Text>
            <Text>{t('penny')}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.flexRow, { gap: 1 }]}>
        <Text style={[styles.blank]}>{' '.repeat(8)}</Text>
        <Text>хужжат илова қилинади.</Text>
      </View>

      <View style={[styles.flexRow, { marginTop: 10, alignItems: 'flex-start' }]}>
        <View style={[styles.flexRow, { gap: 1 }]}>
          <Text>&quot;</Text>
          <Text style={styles.blank}>{' '.repeat(8)}</Text>
          <Text>&quot;</Text>
          <Text style={styles.blank}>{' '.repeat(40)}</Text>
        </View>

        <Text style={styles.boldValue}>{year}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.blank, { width: '100%' }]}>{' '.repeat(8)}</Text>
          <Text style={styles.subText}>(хисобдор шахснинг имзоси)</Text>
        </View>
      </View>

      <View style={[styles.flexRow, { marginTop: 10, alignItems: 'flex-start' }]}>
        <Text>бунак колдигининг суммаси</Text>

        <View style={[styles.flexRow, { gap: 1, flex: 1 }]}>
          <Text style={[styles.blank, { flex: 1 }]}>{' '.repeat(8)}</Text>
          <Text>{t('sum')}</Text>
          <Text style={styles.blank}>{' '.repeat(8)}</Text>
          <Text>{t('penny')} кабул қилинди</Text>
        </View>
      </View>

      <View style={[styles.flexRow, { marginTop: 10, alignItems: 'flex-start' }]}>
        <View style={[styles.flexRow, { gap: 1 }]}>
          <Text>&quot;</Text>
          <Text style={styles.blank}>{' '.repeat(8)}</Text>
          <Text>&quot;</Text>
          <Text style={styles.blank}>{' '.repeat(40)}</Text>
        </View>

        <View style={[styles.flexRow, { gap: 1 }]}>
          <Text>&quot;</Text>
          <Text style={styles.blank}>{' '.repeat(8)}</Text>
          <Text>&quot;</Text>
          <Text style={styles.blank}>{' '.repeat(40)}</Text>
        </View>

        <Text style={styles.boldValue}>{year}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.blank, { width: '100%' }]}>{' '.repeat(8)}</Text>
          <Text style={styles.subText}>(хисобдор шахснинг имзоси)</Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  workerName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    lineHeight: 0.8
  },
  divider: {
    height: 1,
    borderBottom: '1px solid black'
  },
  blank: {
    borderBottom: '1px solid black'
  },
  subText: {
    textAlign: 'center',
    lineHeight: 0.8,
    letterSpacing: 1
  },
  boldValue: {
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10
  },
  summaContainer: {
    marginTop: 10
  },
  summaRow: {
    paddingVertical: 5,
    width: 400,
    marginLeft: 'auto'
  }
})
