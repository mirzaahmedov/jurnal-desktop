import { Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  const { t } = useTranslation()
  return (
    <View>
      <Text>{t('report')}</Text>
    </View>
  )
}
