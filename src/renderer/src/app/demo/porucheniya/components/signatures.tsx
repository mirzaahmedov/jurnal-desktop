import { View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex, Label, TextBox } from '@/common/components/pdf'

type SignaturesProps = {
  rukovoditel: string | null
  glav_buxgalter: string | null
}
export const Signatures = ({ rukovoditel, glav_buxgalter }: SignaturesProps) => {
  const { t } = useTranslation(['porucheniya'])
  return (
    <>
      <Flex alignItems="flex-start">
        <Label
          style={{
            width: 115,
            fontSize: 9,
            textAlign: 'right'
          }}
        >
          {t('rukovoditel')}
        </Label>
        <TextBox style={{ flex: 1, minHeight: 35 }}>{rukovoditel}</TextBox>
        <Label style={{ fontSize: 9, textAlign: 'center' }}>{t('glav_buxgalter')}</Label>
        <TextBox style={{ flex: 1, minHeight: 35 }}>{glav_buxgalter}</TextBox>
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
          {[t('verified'), t('approved'), t('transferred')].map((label) => (
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
