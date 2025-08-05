import { useTranslation } from 'react-i18next'

import { Flex, Label, TextBox } from '@/common/components/pdf'

type SummaProps = {
  summa: string
}
const Summa = ({ summa }: SummaProps) => {
  const { t } = useTranslation(['porucheniya'])
  return (
    <Flex>
      <Label style={{ width: 115 }}>{t('summa')}</Label>
      <TextBox
        fullWidth
        style={{ fontWeight: 'bold', fontSize: 11 }}
      >
        {summa}
      </TextBox>
    </Flex>
  )
}

export { Summa }
