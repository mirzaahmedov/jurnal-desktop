import type { Podpis } from '@/common/models'
import type { FC } from 'react'

import { StyleSheet, Text, View } from '@react-pdf/renderer'
import Transliterator from 'lotin-kirill'
import { useTranslation } from 'react-i18next'

const transliterator = new Transliterator()

export const Signatures: FC<{
  podpis: Podpis[]
}> = (props) => {
  const { podpis } = props
  const { t, i18n } = useTranslation()

  return (
    <View style={{ marginTop: 20 }}>
      {podpis
        ?.sort((a, b) => a.numeric_poryadok - b.numeric_poryadok)
        ?.map((p) => (
          <View
            key={p.id}
            style={styles.signatureContainer}
          >
            <View>
              <Text>
                {i18n.language === 'uz'
                  ? p.doljnost_name
                  : transliterator.textToCyrillic(p.doljnost_name)}
              </Text>
            </View>
            <View>
              <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>
                {i18n.language === 'uz' ? p.fio_name : transliterator.textToCyrillic(p.fio_name)}
              </Text>
            </View>
          </View>
        ))}

      <View style={styles.signatureContainer}>
        <View style={styles.blankWrapper}>
          <View>
            <Text>{t('received_by')}:</Text>
          </View>
          <View style={{ width: 140, borderBottom: '1px solid black' }}>
            <Text> </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  signatureContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 15
  },
  blankWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  }
})
