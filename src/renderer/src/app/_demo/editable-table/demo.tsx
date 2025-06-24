import type { ColumnDef, RenderProps } from '@/common/components/editable-table-v2/types'

import { type ComponentPropsWithRef, type Ref, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { type FieldError, useForm, useWatch } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { OperatsiiService, operatsiiQueryKeys } from '@/app/super-admin/operatsii'
import {
  EditableTable,
  type TableMethods
} from '@/common/components/editable-table-v2/EditableTable'
import { ComboboxItem, JollyComboBox } from '@/common/components/jolly/combobox'
import { useKeyUp } from '@/common/hooks'
import { cn } from '@/common/lib/utils'
import { TypeSchetOperatsii } from '@/common/models'

const UserSchema = z.object({
  name: z.string().nonempty(),
  age: z.number().min(5),
  phone: z.string(),
  email: z.string().email(),
  passport: z.string(),
  address: z.string(),
  house: z.string(),
  operatsii_id: z.number(),
  schet: z.string().optional(),
  sub_schet: z.string().optional()
})
const FormSchema = z.object({
  users: z.array(UserSchema)
})

type User = z.infer<typeof UserSchema>
type Form = z.infer<typeof FormSchema>

const TransHeader = (props: ComponentPropsWithRef<typeof Trans>) => {
  const { t } = useTranslation(['app'])
  return (
    <Trans
      {...props}
      t={t}
    />
  )
}

export interface InputProps {
  inputRef?: Ref<HTMLInputElement>
  value: unknown
  onChange: (value: unknown) => void
  error?: FieldError
}
const Input = ({ inputRef, value, onChange, error }: InputProps) => {
  return (
    <input
      ref={inputRef}
      value={value as string}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      className={cn(
        'px-1 border-none min-w-0 w-full h-full bg-transparent relative focus:z-50 focus:outline-none focus:ring-[2px] ring-brand',
        error && 'bg-red-200'
      )}
    />
  )
}

const SchetInput = ({ value, onChange }: InputProps) => {
  const { t } = useTranslation(['app'])

  const { data: options, isLoading } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getSchetOptions,
      {
        type_schet: TypeSchetOperatsii.KASSA_PRIXOD
      }
    ],
    queryFn: OperatsiiService.getSchetOptions
  })

  return (
    <JollyComboBox
      isDisabled={isLoading}
      defaultItems={options?.data ?? []}
      selectedKey={value?.toString() ?? ''}
      onSelectionChange={(value) => {
        onChange(value as string)
      }}
      placeholder={t('schet')}
      className="h-full gap-0"
      inputProps={{
        className: 'h-full w-full px-1 bg-transparent '
      }}
      groupProps={{
        className: 'relative rounded-none border-none bg-transparent focus-within:z-50'
      }}
      popoverProps={{
        className: 'w-fit overflow-hidden'
      }}
    >
      {(item) => <ComboboxItem id={item.schet}>{item.schet}</ComboboxItem>}
    </JollyComboBox>
  )
}

const SubSchetInput = ({ value, onChange, rowValues, setRowFieldValue }: RenderProps<User>) => {
  const { t } = useTranslation(['app'])

  const debouncedSchet = useDebounce(rowValues?.schet, 300)[0]

  const { data, isLoading } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getAll,
      {
        type_schet: TypeSchetOperatsii.KASSA_PRIXOD,
        schet: debouncedSchet ? debouncedSchet : undefined
      }
    ],
    queryFn: OperatsiiService.getAll,
    enabled: !!debouncedSchet
  })

  const options = data?.data ?? []

  return (
    <JollyComboBox
      isDisabled={isLoading || !debouncedSchet}
      defaultItems={options}
      selectedKey={value?.toString() ?? ''}
      onSelectionChange={(value) => {
        const selectedItem = options.find((item) => item.sub_schet === value)
        if (selectedItem) {
          setRowFieldValue('operatsii_id', selectedItem.id)
          onChange(value as string)
        } else {
          onChange('')
          setRowFieldValue('operatsii_id', undefined)
        }
      }}
      placeholder={t('subschet')}
      className="h-full gap-0"
      inputProps={{
        className: 'h-full w-full px-1 bg-transparent '
      }}
      groupProps={{
        className: 'relative rounded-none border-none bg-transparent focus-within:z-50'
      }}
      popoverProps={{
        className: 'w-fit overflow-hidden'
      }}
    >
      {(item) => <ComboboxItem id={item.sub_schet}>{item.sub_schet}</ComboboxItem>}
    </JollyComboBox>
  )
}

const columnDefs: ColumnDef<User>[] = [
  {
    key: 'name',
    header: () => <TransHeader i18nKey="name" />,
    sort: true,
    filter: true,
    minSize: 200,
    render: ({ value, error, onChange }) => (
      <Input
        value={value}
        onChange={onChange}
        error={error}
      />
    )
  },
  {
    key: 'age',
    header: 'Age',
    minSize: 200,
    sort: true,
    filter: true,
    render: ({ value, error, onChange }) => (
      <Input
        value={value}
        onChange={onChange}
        error={error}
      />
    )
  },
  {
    key: 'schet',
    minSize: 100,
    header: () => <TransHeader i18nKey="schet" />,
    render: SchetInput
  },
  {
    key: 'sub_schet',
    minSize: 120,
    header: () => <TransHeader i18nKey="subschet" />,
    render: SubSchetInput
  },
  {
    key: 'credentials',
    header: 'Credentials',
    columns: [
      {
        key: 'phone',
        header: 'Phone',
        minSize: 400,
        render: ({ value, error, inputRef, onChange }) => (
          <Input
            value={value}
            error={error}
            inputRef={inputRef}
            onChange={onChange}
          />
        )
      },
      {
        key: 'email',
        header: 'Email',
        minSize: 400,
        render: ({ value, error, onChange }) => (
          <Input
            value={value}
            onChange={onChange}
            error={error}
          />
        )
      }
    ]
  }
]

const EditableTableDemo = () => {
  const tableRef = useRef<HTMLTableElement>(null)
  const methods = useRef<TableMethods>(null)
  const form = useForm<Form>({
    defaultValues: {
      users: Array.from({ length: 500 }, (_, i) => ({
        name: `User ${i + 1}`,
        age: 20 + (i % 10)
      }))
    },
    resolver: zodResolver(FormSchema)
  })

  useKeyUp({
    key: '/',
    ctrlKey: true,
    handler: () => {
      methods.current?.scrollToRow(55)
    }
  })

  const values = useWatch({
    control: form.control,
    name: 'users'
  })

  console.log({ values })

  return (
    <div className="flex-1 w-full min-h-0 ">
      <form
        onSubmit={form.handleSubmit((values) => console.log('submitted', values))}
        className="h-full flex flex-col"
      >
        <div className="h-full overflow-hidden">
          <EditableTable
            form={form}
            name="users"
            methods={methods}
            columnDefs={columnDefs}
            tableRef={tableRef}
            defaultValues={defaultValues}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

const defaultValues: User = {
  age: 0,
  name: '',
  address: '',
  email: '',
  house: '',
  passport: '',
  phone: '',
  operatsii_id: 0,
  schet: '',
  sub_schet: ''
}

export default EditableTableDemo
