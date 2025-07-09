import { useTranslation } from 'react-i18next'

import { Flex, Label, TextBox } from '@/common/components/pdf'
import { splitStringByLength } from '@/common/lib/utils'

import { PorucheniyaType } from '../PaperSheet'

type AdditionalInfoProps = {
  type: PorucheniyaType

  summaWords: string
  creditor_raschet_gazna?: string
  opisanie: string
}
export const AdditionalInfo = ({
  type,
  summaWords,
  creditor_raschet_gazna,
  opisanie
}: AdditionalInfoProps) => {
  const { t } = useTranslation(['porucheniya'], { lng: 'uz' })

  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{ gap: 2 }}
    >
      <Flex>
        <Label style={{ width: 115 }}>{t('summa_words')}</Label>
        <TextBox
          fullWidth
          style={{
            paddingVertical: 2,
            fontSize: 8,
            fontStyle: 'italic',
            minHeight: 20
          }}
        >
          {summaWords}
        </TextBox>
      </Flex>

      {type === PorucheniyaType.TAX ? (
        <Flex alignItems="flex-start">
          <Label style={{ width: 115 }}>{t('gazna_account_number')}</Label>
          <TextBox
            fullWidth
            style={{
              letterSpacing: 4,
              fontSize: 11
            }}
          >
            {splitStringByLength(creditor_raschet_gazna || ' ', 4).join(' ')}
          </TextBox>
        </Flex>
      ) : null}

      <Flex
        style={{
          marginTop: type === PorucheniyaType.TAX ? -5 : 0
        }}
      >
        <Label style={{ width: 115 }}>{t('opisanie')}</Label>
        <TextBox
          fullWidth
          style={{
            paddingVertical: 2,
            fontSize: 8,
            fontWeight: 'normal',
            minHeight: 30
          }}
        >
          {opisanie}
        </TextBox>
      </Flex>
    </Flex>
  )
}
