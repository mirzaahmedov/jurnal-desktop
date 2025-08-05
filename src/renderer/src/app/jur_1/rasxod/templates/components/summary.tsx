import { useTranslation } from 'react-i18next'

import { Field, Flex, Label, Value } from '@/common/components/pdf'

type SummaryProps = {
  fio: string
  operation: string
  summa: string
  summaWords: string
}
const Summary = ({ fio, operation, summa, summaWords }: SummaryProps) => {
  const { t } = useTranslation(['pdf-reports'])

  return (
    <Flex>
      <Flex.Item>
        <Flex
          direction="column"
          alignItems="flex-start"
          style={{ gap: 4 }}
        >
          <Field>
            <Label>{t('fio')}:</Label>
            <Value>{fio}</Value>
          </Field>
          <Field>
            <Label>{t('to_give')}</Label>
            <Value style={{ fontWeight: 'normal' }}>{operation}</Value>
          </Field>
          <Field>
            <Label>{t('in_summa')}:</Label>
            <Value>{summaWords}</Value>
          </Field>
        </Flex>
      </Flex.Item>
      <Flex.Item>
        <Flex justifyContent="center">
          <Field>
            <Label>{t('summa')}:</Label>
            <Value style={{ fontSize: 16 }}>{summa}</Value>
          </Field>
        </Flex>
      </Flex.Item>
    </Flex>
  )
}

export { Summary }
