import type { Podpis } from '@/common/models'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { PodpisDoljnostOptions } from '@/app/region-spravochnik/podpis/config'
import { Blank, Field, Flex, Label } from '@/common/components/pdf'
import { splitArrayToChunks } from '@/common/lib/array'

interface PodpisProps {
  year: number
  podpises: Podpis[]
}
export const Podpises = ({ year, podpises }: PodpisProps) => {
  const { t } = useTranslation([], { lng: 'cyrl' })

  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{ marginTop: 30 }}
    >
      <Flex alignItems="flex-start">
        <Text>М.У.</Text>
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
                  const { name } = PodpisDoljnostOptions(t).find(
                    (d) => d.key === podpis.doljnost_name
                  )!
                  return (
                    <View
                      key={podpis.numeric_poryadok}
                      style={styles.podpis}
                    >
                      <Text>{name}</Text>
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
            <Label>Ғазначилик бўлими{'\n'}ходими қабул қилди</Label>
            <Blank />
          </Field>
        </Flex.Item>
        <Flex.Item>
          <Field style={{ alignItems: 'flex-end' }}>
            <Label>Бюджетдан маблағ олувчи{'\n'}ходими қабул қилди</Label>
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
              <Text>{year}г.</Text>
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
