import { useTranslation } from 'react-i18next'

import { Blank, Field, Flex, Label } from '@/common/components/pdf'

type SignaturesProps = {
  type?: 'receipt' | 'order'
}
const Signatures = ({ type = 'order' }: SignaturesProps) => {
  const { t } = useTranslation(['podpis'])
  return (
    <Flex
      direction="column"
      alignItems="stretch"
    >
      <Field>
        <Label>{t('doljnost.glav_buxgalter')}</Label>
        <Blank
          fullWidth={type === 'receipt'}
          style={{
            width: type === 'order' ? 100 : undefined
          }}
        />
      </Field>
      <Field>
        <Label>{t('doljnost.buxgalter')}</Label>
        <Blank
          fullWidth={type === 'receipt'}
          style={{
            width: type === 'order' ? 100 : undefined
          }}
        />
      </Field>
      <Field>
        <Label>{t('cashier_received')}</Label>
        <Blank
          fullWidth={type === 'receipt'}
          style={{
            width: type === 'order' ? 100 : undefined
          }}
        />
      </Field>
    </Flex>
  )
}

export { Signatures }
