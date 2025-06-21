import type { Podpis } from '@/common/models'

import { StyleSheet, Text, View } from '@react-pdf/renderer'

import { Blank, Field, Flex, Label } from '@/common/components/pdf'
import { splitArrayToChunks } from '@/common/lib/array'

interface PodpisProps {
  year: number
  podpises: Podpis[]
}
export const Podpises = ({ year, podpises }: PodpisProps) => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{ marginTop: 30 }}
    >
      <Flex alignItems="flex-start">
        <Text>M.U.</Text>
        <View style={styles.podpis_container}>
          {splitArrayToChunks(
            podpises.sort((a, b) => a.numeric_poryadok - b.numeric_poryadok),
            2
          ).map((row, index) => {
            return (
              <View
                key={index}
                style={styles.podpis_row}
              >
                {row.map((podpis) => {
                  return (
                    <View
                      key={podpis.numeric_poryadok}
                      style={styles.podpis}
                    >
                      <Text>{podpis.doljnost_name}</Text>
                      <Text style={{ fontWeight: 'bold' }}>{podpis.fio_name}</Text>
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>
      </Flex>
      <Flex>
        <Flex.Item>
          <Field style={{ alignItems: 'flex-end' }}>
            <Label>Gʻaznachilik boʻlimi {'\n'}xodimi qabul qildi</Label>
            <Blank />
          </Field>
        </Flex.Item>
        <Flex.Item>
          <Field style={{ alignItems: 'flex-end' }}>
            <Label>Byudjetdan mablagʻ oluvchi {'\n'}xodimi qabul qildi</Label>
            <Blank />
          </Field>
        </Flex.Item>
      </Flex>
      <Flex style={{ gap: 0 }}>
        <Text>&quot;№</Text>
        <Blank />
        <Text>&quot;</Text>
      </Flex>
      <Flex>
        {[1, 2].map((i) => (
          <Flex.Item key={i}>
            <Flex style={{ gap: 0 }}>
              <Text>&quot;</Text>
              <Blank style={{ width: 30 }} />
              <Text>&quot;</Text>
              <Blank style={{ width: 80 }} />
              <Text>{year}y.</Text>
            </Flex>
          </Flex.Item>
        ))}
      </Flex>
    </Flex>
  )
}

const styles = StyleSheet.create({
  podpis_container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  podpis_row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10
  },
  podpis: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 30
  }
})
