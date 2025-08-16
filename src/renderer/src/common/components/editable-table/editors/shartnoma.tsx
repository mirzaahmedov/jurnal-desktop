import type { EditorComponent } from './interfaces'
import type { DeepValue } from '@/common/lib/types'
import type { ArrayPath } from 'react-hook-form'

import { Pressable } from 'react-aria-components'
import { useTranslation } from 'react-i18next'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { DataList } from '@/common/components/data-list'
import { Tooltip, TooltipTrigger } from '@/common/components/jolly/tooltip'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export const createShartnomaEditor = <T extends object, F extends ArrayPath<T>>({
  readOnly = false,
  key
}: {
  readOnly?: boolean
  key: DeepValue<T, F> extends unknown[] ? keyof DeepValue<T, F>[number] : never
}): EditorComponent<T, F> => {
  const Editor: EditorComponent<T, F> = ({ tabIndex, name, errors, value, onChange }) => {
    const { t } = useTranslation()

    const shartnomaSpravochnik = useSpravochnik(
      createShartnomaSpravochnik({
        value: value as number | undefined,
        onChange: (value) => {
          onChange?.(value)
        }
      })
    )

    const selected = shartnomaSpravochnik.selected

    return (
      <TooltipTrigger delay={100}>
        <Pressable isDisabled={!selected}>
          <div>
            <SpravochnikInput
              {...shartnomaSpravochnik}
              open={readOnly ? undefined : shartnomaSpravochnik.open}
              clear={readOnly ? undefined : shartnomaSpravochnik.clear}
              editor
              readOnly
              tabIndex={tabIndex}
              error={!!errors?.[name]?.[key]}
              name="smeta_id"
              getInputValue={(selected) =>
                selected ? `№${selected.doc_num} - ${formatLocaleDate(selected.doc_date)}` : '-'
              }
            />
          </div>
        </Pressable>
        {selected ? (
          <Tooltip className="bg-white text-foreground shadow-xl p-5 min-w-96 max-w-2xl">
            <DataList
              items={[
                { name: t('doc_num'), value: selected?.doc_num },
                { name: t('doc_date'), value: formatLocaleDate(selected?.doc_date) },
                {
                  name: t('smeta'),
                  value: selected?.grafiks
                    .map((a) => a?.smeta?.smeta_number)
                    .filter(Boolean)
                    .join(',')
                },
                {
                  name: t('summa'),
                  value: formatNumber(selected.summa ? Number(selected?.summa) : 0)
                },
                { name: t('organization'), value: selected?.organization?.name }
              ]}
            />
          </Tooltip>
        ) : null}
      </TooltipTrigger>
    )
  }

  Editor.displayName = 'SmetaEditor'

  return Editor
}
