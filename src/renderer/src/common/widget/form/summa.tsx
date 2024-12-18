import type { FormFieldsComponent } from './types'

import { Fieldset } from '@/common/components'
import { FormElement } from '@/common/components/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { formatNumber } from '@/common/lib/format'
import { numberToWords } from '@/common/lib/utils'

const SummaFields: FormFieldsComponent<{
  summa?: number
}> = ({ data, name, ...props }) => {
  return (
    <Fieldset
      {...props}
      name={name ?? 'Сумма'}
    >
      <div className="flex items-start gap-5">
        <FormElement label="Сумма">
          <Input
            readOnly
            tabIndex={-1}
            value={formatNumber(data?.summa ?? 0)}
            className="text-right"
          />
        </FormElement>

        <Textarea
          readOnly
          tabIndex={-1}
          className="flex-1"
          value={numberToWords(data?.summa ?? 0)}
        />
      </div>
    </Fieldset>
  )
}

export { SummaFields }
