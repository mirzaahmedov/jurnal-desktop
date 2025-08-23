import type { WorkTripRoad } from '@/common/models'
import type { FC } from 'react'

import { StyleSheet, Text } from '@react-pdf/renderer'
import { View } from 'lucide-react'

export const Details: FC<{
  regionName: string
  workerPosition: string
  workerRank: string
  workerFIO: string
  roads: WorkTripRoad[]
}> = ({ regionName, workerPosition, workerRank, workerFIO, roads }) => {
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
  subText: {
    textAlign: 'center',
    lineHeight: 0.8,
    letterSpacing: 1
  }
})
