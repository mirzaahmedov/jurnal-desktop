import type { ApiResponse, Bank } from '@/common/models'

import { useState } from 'react'

import { useAsyncList } from 'react-stately'

import {
  ComboboxItem,
  JollyComboBox,
  type JollyComboBoxProps
} from '@/common/components/jolly/combobox'
import { ApiEndpoints } from '@/common/features/crud'
import { http } from '@/common/lib/http'

// type User = {
//   name: string
//   email: string
//   age: number
//   country: string
// }
// const users: User[] = [
//   {
//     name: 'Alice Johnson',
//     email: 'alice.johnson@example.com',
//     age: 28,
//     country: 'USA'
//   },
//   {
//     name: 'Bob Smith',
//     email: 'bob.smith@example.com',
//     age: 35,
//     country: 'Canada'
//   },
//   {
//     name: 'Charlie Brown',
//     email: 'charlie.brown@example.com',
//     age: 22,
//     country: 'UK'
//   },
//   {
//     name: 'Diana Prince',
//     email: 'diana.prince@example.com',
//     age: 31,
//     country: 'France'
//   },
//   {
//     name: 'Ethan Hunt',
//     email: 'ethan.hunt@example.com',
//     age: 40,
//     country: 'Germany'
//   }
// ]

// const columnDefs: ColumnDef<User>[] = [
//   {
//     key: 'name',
//     header: 'Name',
//     render: TextEditor
//   },
//   {
//     key: 'email',
//     header: 'Email',
//     render: TextEditor
//   }
// ]

const DemoPage = () => {
  const [value, setValue] = useState<string>('')
  // const form = useForm({
  //   defaultValues: {
  //     users
  //   }
  // })

  const bankList = useAsyncList<Bank>({
    async load({ signal, filterText }) {
      const response = await http.get<ApiResponse<Bank[]>>(ApiEndpoints.spravochnik_bank, {
        signal,
        params: {
          search: filterText ? filterText : undefined
        }
      })
      return {
        items: response.data.data ?? []
      }
    }
  })

  console.log('selectedValue', value)

  return (
    <div className="p-10">
      <AutoComplete
        inputValue={bankList.filterText}
        onInputChange={bankList.setFilterText}
        selectedKey={value}
        onSelectionChange={setValue as any}
        items={bankList.items}
      >
        {(item) => (
          <ComboboxItem id={item.mfo}>
            {item.mfo} - {item.bank_name}
          </ComboboxItem>
        )}
      </AutoComplete>
    </div>
  )
}

const AutoComplete = <T extends object>({
  inputValue,
  onInputChange,
  selectedKey,
  onSelectionChange,
  items,
  children,
  ...props
}: JollyComboBoxProps<T>) => {
  return (
    <JollyComboBox
      allowsCustomValue
      allowsEmptyCollection
      menuTrigger="focus"
      formValue="text"
      selectedKey={selectedKey}
      onSelectionChange={(key) => {
        if (key) {
          onInputChange?.((key as string) || '')
          onSelectionChange?.(key as string)
        }
      }}
      items={items}
      inputValue={inputValue}
      onOpenChange={(open) => {
        if (!open) {
          onSelectionChange?.(inputValue || '')
        }
      }}
      onInputChange={onInputChange}
      {...props}
    >
      {children}
    </JollyComboBox>
  )
}

export default DemoPage
