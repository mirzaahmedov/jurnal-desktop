import type { Podpis } from '@/common/models'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import Transliterator from 'lotin-kirill'
import { useTranslation } from 'react-i18next'

import { Blank, Field, Flex, Label } from '@/common/components/pdf'

const transliterator = new Transliterator()

interface PodpisProps {
  year: number
  podpises: Podpis[]
}
export const Podpises = ({ year, podpises }: PodpisProps) => {
  const { t, i18n } = useTranslation(['pdf-reports'])
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{ marginTop: 30 }}
    >
      <Flex
        alignItems="flex-end"
        direction="column"
      >
        <View style={styles.podpisWrapper}>
          {podpises.map((podpis, index) => {
            return (
              <View
                key={index}
                style={styles.podpis}
              >
                <View style={{ flex: 1 }}>
                  <Text>
                    {i18n.language === 'uz'
                      ? transliterator.textToLatin(podpis.doljnost_name)
                      : transliterator.textToCyrillic(podpis.doljnost_name)}
                  </Text>
                </View>
                <View style={{ flex: 1, borderBottom: '1px solid black', height: '100%' }}></View>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>
                    {i18n.language === 'uz'
                      ? transliterator.textToLatin(podpis.fio_name)
                      : transliterator.textToCyrillic(podpis.fio_name)}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </Flex>
      <Flex style={{ marginTop: 40 }}>
        <Flex.Item>
          <Field style={{ alignItems: 'flex-end' }}>
            <Label>{t('received_by_treasure_department_employee')}</Label>
            <Blank />
          </Field>
        </Flex.Item>
        <Flex.Item>
          <Field style={{ alignItems: 'flex-end' }}>
            <Label>{t('received_by_budget_recipient_employee')}</Label>
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
              <Text>{t('year_y', { year })}</Text>
            </Flex>
          </Flex.Item>
        ))}
      </Flex>
    </Flex>
  )
}

const styles = StyleSheet.create({
  podpisWrapper: {
    width: 250,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 2.5
  },
  podpis: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 15
  }
})
