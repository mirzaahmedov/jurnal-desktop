import type { UseSnippetsReturn } from './use-snippets'
import type { DialogTriggerProps } from 'react-aria-components'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { EmptyList } from '@/common/components/empty-states'
import { FormElement } from '@/common/components/form'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { Form, FormField } from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Textarea } from '@/common/components/ui/textarea'
import { useToggle } from '@/common/hooks'

import { type Snippet, SnippetSchema, defaultValues } from './config'

export interface SelectSnippetDialogProps
  extends Pick<UseSnippetsReturn, 'snippets' | 'addSnippet' | 'removeSnippet'>,
    Omit<DialogTriggerProps, 'children'> {
  onSelect: (selected: Snippet) => void
}
export const SelectSnippetDialog = ({
  isOpen,
  onOpenChange,
  snippets,
  addSnippet,
  removeSnippet,
  onSelect
}: SelectSnippetDialogProps) => {
  const createDialogToggle = useToggle()

  const { t } = useTranslation()

  const form = useForm({
    resolver: zodResolver(SnippetSchema),
    defaultValues
  })

  const onSubmit = form.handleSubmit(({ name, content }) => {
    addSnippet({
      name,
      content
    })
    form.reset(defaultValues)
    createDialogToggle.close()
  })

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay>
        <DialogContent className="max-w-4xl">
          <ul className="divide-y">
            {Array.isArray(snippets) && snippets.length > 0 ? (
              snippets.map((snippet, index) => (
                <li
                  key={index}
                  className="p-5 flex items-start hover:bg-slate-50 cursor-pointer"
                  onClick={() => {
                    onSelect(snippet)
                  }}
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <h4 className="font-bold">{snippet.name}</h4>
                    <p>{snippet.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSnippet(index)
                    }}
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))
            ) : (
              <li className="grid place-items-center">
                <EmptyList
                  iconProps={{
                    className: 'w-40'
                  }}
                />
              </li>
            )}
          </ul>
          <DialogFooter>
            <DialogTrigger
              isOpen={createDialogToggle.isOpen}
              onOpenChange={createDialogToggle.setOpen}
            >
              <Button>{t('add')}</Button>
              <DialogOverlay>
                <DialogContent>
                  <Form {...form}>
                    <form
                      onSubmit={onSubmit}
                      className="w-full flex flex-col gap-5"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormElement
                            label={t('name')}
                            direction="column"
                          >
                            <Input {...field} />
                          </FormElement>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormElement
                            label={t('content')}
                            direction="column"
                          >
                            <Textarea {...field} />
                          </FormElement>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">{t('add')}</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </DialogOverlay>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
