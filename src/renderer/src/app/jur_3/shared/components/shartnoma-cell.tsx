import type { CustomCellRendererProps } from 'ag-grid-react'

import { Pressable } from 'react-aria-components'
import { useTranslation } from 'react-i18next'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { DataList } from '@/common/components/data-list'
import { Tooltip, TooltipTrigger } from '@/common/components/jolly/tooltip'
import { SpravochnikInput, useSpravochnik } from '@/common/features/spravochnik'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export const ShartnomaCellRenderer = (props: CustomCellRendererProps) => {
  const { t } = useTranslation()

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: props.value
    })
  )

  const selected = shartnomaSpravochnik.selected

  return (
    <TooltipTrigger delay={100}>
      <Pressable isDisabled={!selected}>
        <div>
          <SpravochnikInput
            {...shartnomaSpravochnik}
            open={undefined}
            clear={undefined}
            editor
            readOnly
            name="contract_id"
            getInputValue={(selected) =>
              selected ? `№${selected.doc_num} - ${formatLocaleDate(selected.doc_date)}` : '-'
            }
          />
        </div>
      </Pressable>
      {selected ? (
        <Tooltip
          className="bg-white text-foreground shadow-xl p-5 min-w-96 max-w-2xl"
          placement="right"
        >
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
