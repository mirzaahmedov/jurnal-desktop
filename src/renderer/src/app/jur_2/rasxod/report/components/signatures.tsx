import type { Podpis } from '@/common/models'

import { View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex, Label, TextBox } from '@/common/components/pdf'

type SignaturesProps = {
  podpis: Podpis[]
}
export const Signatures = ({ podpis }: SignaturesProps) => {
  const { t } = useTranslation(['porucheniya'], { lng: 'uz' })
  return (
    <>
      <Flex alignItems="flex-start">
        {podpis
          .sort((a, b) => a.numeric_poryadok - b.numeric_poryadok)
          .map((p, i) => (
            <>
              <Label
                style={{
                  width: i === 0 ? 115 : undefined,
                  fontSize: 9,
                  textAlign: 'right'
                }}
              >
                {p.doljnost_name}
              </Label>
              <TextBox style={{ flex: 1, minHeight: 35 }}>{p.fio_name}</TextBox>
            </>
          ))}
      </Flex>
      <Flex>
        <View style={{ width: 115 }}> </View>
        <Flex
          style={{
            flex: 1,
            borderWidth: 1.5,
            padding: 2
          }}
        >
          {[t('verified'), t('approved'), t('transfered')].map((label) => (
            <Flex.Item key={label}>
              <Label
                style={{
                  fontSize: 9,
                  textAlign: 'center'
                }}
              >
                {label}
              </Label>
              <View
                style={{
                  height: 16,
                  borderWidth: 1.5
                }}
              >
                {undefined}
              </View>
            </Flex.Item>
          ))}
        </Flex>
      </Flex>
    </>
  )
}
