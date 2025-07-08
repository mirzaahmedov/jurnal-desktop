import type { ColumnDef } from '@/common/components/editor-table/types'

import { useForm } from 'react-hook-form'

import { EditorTable } from '@/common/components/editor-table'
import { TextEditor } from '@/common/components/editor-table/editors/text-editor'

type User = {
  name: string
  email: string
  age: number
  country: string
}
const users: User[] = [
  {
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    age: 28,
    country: 'USA'
  },
  {
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    age: 35,
    country: 'Canada'
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    age: 22,
    country: 'UK'
  },
  {
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    age: 31,
    country: 'France'
  },
  {
    name: 'Ethan Hunt',
    email: 'ethan.hunt@example.com',
    age: 40,
    country: 'Germany'
  }
]

const columnDefs: ColumnDef<User>[] = [
  {
    key: 'name',
    header: 'Name',
    render: TextEditor
  },
  {
    key: 'email',
    header: 'Email',
    render: TextEditor
  }
]

const DemoPage = () => {
  const form = useForm({
    defaultValues: {
      users
    }
  })

  return (
    <EditorTable
      columnDefs={columnDefs}
      form={form}
      name="users"
      defaultValues={{
        name: '',
        email: '',
        age: 0,
        country: ''
      }}
    />
  )
}

export default DemoPage
