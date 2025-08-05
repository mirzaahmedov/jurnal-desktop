import { useTranslation } from 'react-i18next'

import { Field, Flex, Label, Value } from '@/common/components/pdf'

type DetailsProps = {
  type?: 'receipt' | 'order'
  fio: string
  workplace: string
  opisanie: string
  summa: string
  summaWords: string
}
const Details = ({ type = 'order', fio, workplace, opisanie, summa, summaWords }: DetailsProps) => {
  const { t } = useTranslation(['pdf-reports'])
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{
        gap: type === 'receipt' ? 20 : 5
      }}
    >
      <Field style={{ flexWrap: 'wrap' }}>
        <Label>{t('received_from')}:</Label>
        <Value style={{ textDecoration: 'underline' }}>{fio}</Value>
      </Field>
      <Field style={{ flexWrap: 'wrap' }}>
        <Label>{t('workplace')}:</Label>
        <Value
          style={{
            fontWeight: 'normal',
            textDecoration: 'underline'
          }}
        >
          {workplace}
        </Value>
      </Field>
      <Field style={{ flexWrap: 'wrap' }}>
        <Label>{t('notes')}:</Label>
        <Value
          style={{
            fontWeight: 'normal',
            textDecoration: 'underline'
          }}
        >
          {opisanie}
        </Value>
      </Field>
      <Field style={{ flexWrap: 'wrap' }}>
        <Label>{t('in_summa')}:</Label>
        <Value style={{ textDecoration: 'underline' }}>{summa}</Value>
      </Field>
      <Field style={{ flexWrap: 'wrap' }}>
        <Value style={{ textDecoration: 'underline' }}>{summaWords}</Value>
      </Field>
    </Flex>
  )
}

export { Details }
