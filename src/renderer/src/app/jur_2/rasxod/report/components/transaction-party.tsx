import { Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Flex, Label, TextBox } from '@/common/components/pdf'
import { normalizeSpaces } from '@/common/lib/text'

interface TransactionPartyProps {
  type: 'debtor' | 'creditor'
  name: string
  raschet: string
  inn: string
  bank: string
  mfo: string
}
export const TransactionParty = ({
  type,
  name,
  raschet,
  inn,
  bank,
  mfo
}: TransactionPartyProps) => {
  const { t } = useTranslation(['porucheniya'], { lng: 'uz' })
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{ gap: 2 }}
    >
      <Flex alignItems="flex-start">
        <Label
          style={{
            width: 115
          }}
        >
          <Text>{(type === 'debtor' ? t('debtor') : t('creditor')) + '\n'}</Text>
          <Text style={{ textAlign: 'right' }}>{t('name')}</Text>
        </Label>
        <TextBox
          fullWidth
          style={{ fontSize: 11, textDecoration: 'none' }}
        >
          {normalizeSpaces(name)}
        </TextBox>
      </Flex>

      <Flex style={{ marginTop: -10 }}>
        <Label style={{ fontWeight: 'bold' }}>{type === 'debtor' ? t('debet') : t('credit')}</Label>
      </Flex>

      <Flex
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Label style={{ width: 115 }}>
          {(type === 'debtor' ? t('debtor') : t('creditor')) + '\n'}
          {t('account_number')}
        </Label>
        <Flex style={{ flex: 1 }}>
          <TextBox style={{ letterSpacing: 4, fontSize: 11 }}>{raschet}</TextBox>
        </Flex>
        <Flex
          direction="column"
          alignItems="flex-start"
          style={{ gap: 10 }}
        >
          <View>
            <Label style={{ fontSize: 9 }}>
              {(type === 'debtor' ? t('debtor') : t('creditor')) + '\n'}
              {t('inn')}
            </Label>
          </View>
          <TextBox style={{ marginTop: -20, marginLeft: 30, letterSpacing: 4, fontSize: 11 }}>
            {inn}
          </TextBox>
        </Flex>
      </Flex>

      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Label style={{ width: 115, textAlign: 'justify' }}>
          {type === 'debtor' ? t('debtor') : t('creditor')} {t('bank')}
        </Label>
        <Flex style={{ flex: 1 }}>
          <TextBox style={{ fontSize: 10, flex: 1, minHeight: 25 }}>
            {normalizeSpaces(bank)}
          </TextBox>
        </Flex>

        <Flex
          direction="column"
          alignItems="flex-start"
          style={{ gap: 10 }}
        >
          <View>
            <Label style={{ fontSize: 9 }}>
              {(type === 'debtor' ? t('debtor') : t('creditor')) + '\n'}
              {t('mfo')}
            </Label>
          </View>
          <TextBox style={{ marginTop: -20, marginLeft: 50, letterSpacing: 4, fontSize: 11 }}>
            {mfo}
          </TextBox>
        </Flex>
      </Flex>
    </Flex>
  )
}
