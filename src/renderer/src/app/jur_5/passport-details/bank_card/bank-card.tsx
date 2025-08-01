import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PatternFormat } from 'react-number-format'

import { useAsyncListBank } from '@/app/super-admin/bank/service'
import { AutoComplete } from '@/common/components/auto-complete'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import { ComboboxItem } from '@/common/components/jolly/combobox'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { normalizeSpaces } from '@/common/lib/text'

import { defaultValues } from './config'

export const BankCard = () => {
  const bankList = useAsyncListBank()

  const { t } = useTranslation(['app'])

  const form = useForm({
    defaultValues
  })

  const handleSubmit = form.handleSubmit((values) => {
    console.log({ values })
  })

  return (
    <div className="p-10 w-full max-w-lg">
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormElement
                grid="2:5"
                label={t('bank')}
              >
                <AutoComplete
                  items={bankList.items}
                  inputValue={bankList.filterText}
                  onInputChange={bankList.setFilterText}
                  selectedKey={field.value}
                  onSelectionChange={(key) => {
                    field.onChange(key)
                  }}
                >
                  {(item) => (
                    <ComboboxItem id={item.bank_name}>
                      {item.mfo} - {normalizeSpaces(item.bank_name)}
                    </ComboboxItem>
                  )}
                </AutoComplete>
              </FormElement>
            )}
          />
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormElement
                grid="2:5"
                label={t('card_number')}
              >
                <PatternFormat
                  format="#### #### #### ####"
                  customInput={Input}
                  mask="_"
                  getInputRef={field.ref}
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value)
                  }}
                  onBlur={field.onBlur}
                  placeholder="0000 0000 0000 0000"
                  className="font-mono text-base"
                />
              </FormElement>
            )}
          />
          <FormField
            control={form.control}
            name="cardHolder"
            render={({ field }) => (
              <FormElement
                grid="2:5"
                label={t('fio')}
              >
                <Input
                  ref={field.ref}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={t('fio')}
                />
              </FormElement>
            )}
          />
          <div className="flex items-center justify-end mt-10">
            <Button className="mt-auto">{t('save')}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
