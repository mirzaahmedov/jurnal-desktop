import type { ColumnDef } from '@/common/components/editable-table-v2/types'

import { type Ref, useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { type FieldError, useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { z } from 'zod'

import {
  EditableTable,
  type TableMethods
} from '@/common/components/editable-table-v2/EditableTable'
import { useKeyUp } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

const NameCell = () => {
  const { t } = useTranslation([])
  return (
    <Trans
      i18nKey="name"
      t={t}
    />
  )
}

const UserSchema = z.object({
  name: z.string().nonempty(),
  age: z.number().min(5),
  phone: z.string(),
  email: z.string().email(),
  passport: z.string(),
  address: z.string(),
  house: z.string()
})
const FormSchema = z.object({
  users: z.array(UserSchema)
})

type User = z.infer<typeof UserSchema>
type Form = z.infer<typeof FormSchema>

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

const columnDefs: ColumnDef<User>[] = [
  {
    key: 'name',
    header: () => <NameCell />,
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
    render: ({ value, error, onChange }) => (
      <Input
        value={value}
        onChange={onChange}
        error={error}
      />
    )
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

  return (
    <form
      onSubmit={form.handleSubmit((values) => console.log('submitted', values))}
      className="flex-1 w-full flex flex-col"
    >
      <div className="flex-1 flex">
        {/* <Sidebar /> */}
        <div className="flex-1 overflow-hidden">
          <EditableTable
            form={form}
            name="users"
            methods={methods}
            columnDefs={columnDefs}
            tableRef={tableRef}
            defaultValues={defaultValues}
          />
        </div>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

const defaultValues: User = {
  age: 0,
  name: '',
  address: '',
  email: '',
  house: '',
  passport: '',
  phone: ''
}

export default EditableTableDemo
