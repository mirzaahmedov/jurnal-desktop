import { Button } from '@renderer/common/components/ui/button'
import { useTranslation } from 'react-i18next'

export const LoadFile = () => {
  const { t } = useTranslation()

  return <Button>{t('load_file')}</Button>
}
