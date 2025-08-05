import { Text, View } from '@react-pdf/renderer'
import { useTranslation } from 'react-i18next'

import { Blank, Field, Flex, Label } from '@/common/components/pdf'

const Signatures = () => {
  const { t } = useTranslation(['pdf-reports', 'podpis'])
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}
    >
      <Flex>
        <Flex.Item>
          <Field>
            <Label>{t('podpis')}</Label>
            <Blank
              fullWidth
              helpText={t('appropriator_funds')}
            />
          </Field>
        </Flex.Item>
        <Flex.Item>
          <Field>
            <Label>{t('podpis')}</Label>
            <Blank
              fullWidth
              helpText={t('podpis:doljnost.glav_buxgalter')}
            />
          </Field>
        </Flex.Item>
      </Flex>

      <Field>
        <Label>{t('received')}</Label>
        <Blank
          fullWidth
          helpText={t('summa_words')}
        />
      </Field>

      <Flex>
        <Flex.Item>
          <View>
            <Field>
              <Label>{t('acknowledgment')}</Label>
              <Blank fullWidth />
            </Field>
          </View>
        </Flex.Item>
        <Flex.Item>
          <Text
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}
          >
            {t('gave')}
          </Text>
        </Flex.Item>
      </Flex>

      <Flex>
        <Flex.Item>
          <Flex>
            <Field>
              <Label>&quot;</Label>
              <Blank style={{ width: 20 }} />
              <Label>&quot;</Label>
            </Field>
            <Field>
              <Blank style={{ width: 100 }} />
            </Field>
            <Field>
              <Label>20</Label>
              <Blank style={{ width: 20 }} />
              <Label>{t('year_short')}</Label>
            </Field>
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Field>
            <Label>{t('podpis:doljnost.kassir')}</Label>
            <Blank style={{ width: 200 }} />
          </Field>
        </Flex.Item>
      </Flex>
    </View>
  )
}

export { Signatures }
