import type { FormEditableFieldsComponent } from './types'
import type { UseSnippetsReturn } from '@renderer/common/features/snippents/use-snippets'
import type { Control, UseFormReturn } from 'react-hook-form'

import { SelectSnippetDialog } from '@renderer/common/features/snippents/select-snippet-dialog'
import { useToggle } from '@renderer/common/hooks'
import { useTranslation } from 'react-i18next'

import { FormElement } from '@/common/components/form'
import { FormField } from '@/common/components/ui/form'
import { Textarea } from '@/common/components/ui/textarea'

interface RequiredOpisanieFields {
  opisanie?: string
}

export const OpisanieFields: FormEditableFieldsComponent<
  RequiredOpisanieFields,
  Pick<UseSnippetsReturn, 'snippets' | 'addSnippet' | 'removeSnippet'>
> = ({ tabIndex, form, snippets, addSnippet, removeSnippet }) => {
  const dialogToggle = useToggle()

  const { t } = useTranslation()

  return (
    <>
      <SelectSnippetDialog
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        snippets={snippets}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
        onSelect={(snippet) => {
          const typedForm = form as unknown as UseFormReturn<RequiredOpisanieFields>
          typedForm.setValue('opisanie', snippet.content, {
            shouldValidate: true
          })
          dialogToggle.close()
        }}
      />
      <FormField
        name="opisanie"
        control={form.control as unknown as Control<RequiredOpisanieFields>}
        render={({ field }) => (
          <FormElement
            direction="column"
            label={t('opisanie')}
          >
            <Textarea
              tabIndex={tabIndex}
              rows={4}
              spellCheck={false}
              onDoubleClick={dialogToggle.open}
              {...field}
            />
          </FormElement>
        )}
      />
    </>
  )
}
