import type { EditableTableMethods, EditableTableProps } from '@/common/components/editable-table'

import { type KeyboardEvent, useEffect, useRef } from 'react'

import { useForm, useWatch } from 'react-hook-form'

import { type EditableColumnDef, EditableTableAlt } from '@/common/components/editable-table-alt'
import { createTextEditor } from '@/common/components/editable-table-alt/editors'
import { Button } from '@/common/components/jolly/button'
import { SearchInput } from '@/common/components/search-input'

type FormValues = {
  childs: Array<{
    name: number
  }>
}

const columns: EditableColumnDef<FormValues, 'childs'>[] = [
  {
    key: 'one',
    width: 500,
    sticky: true,
    left: 0,
    className: 'bg-red-500',
    Editor: createTextEditor({})
  },
  {
    key: 'two',
    width: 1000,
    className: 'bg-green-500',
    Editor: createTextEditor({})
  },
  {
    key: 'three',
    width: 500,
    sticky: true,
    right: 0,
    className: 'bg-blue-500',
    Editor: createTextEditor({})
  },
  {
    key: 'four',
    width: 400,
    className: 'bg-yellow-500',
    Editor: createTextEditor({})
  }
]
const childs = Array.from({ length: 99 }, (_, i) => ({
  name: i + 1
}))

const DemoPage = () => {
  const tableMethods = useRef<EditableTableMethods>(null)

  const form = useForm({
    defaultValues: {
      childs
    }
  })

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()

      const value = e.currentTarget.value
      if (value.length > 0) {
        const rows = form.getValues('childs')
        const index = rows.findIndex((row) =>
          row.name.toString()?.toLowerCase()?.includes(value?.toLowerCase())
        )
        tableMethods.current?.scrollToRow(index)
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-5">
        <SearchInput onKeyDown={handleSearch} />
      </div>
      <div className="p-5">
        <Button
          onPress={() => {
            window.api.openRouteNewWindow({
              route: 'demo'
            })
          }}
        >
          Open new window
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <EditableTableAlt
          columnDefs={columns}
          form={form}
          name="childs"
          methods={tableMethods}
          footer={DemoTableFooter}
          onCreate={() => {}}
        />
      </div>
    </div>
  )
}

export default DemoPage

const DemoTableFooter = ({ form }: EditableTableProps<FormValues, 'childs'>) => {
  const footerForm = useForm({
    defaultValues: {
      childs: []
    } as FormValues
  })

  const rows = useWatch({
    control: form.control,
    name: 'childs'
  })

  useEffect(() => {
    const itogo = rows.reduce((acc, row) => {
      return acc + Number(row.name)
    }, 0)
    footerForm.setValue('childs', [
      {
        name: itogo
      }
    ])
  }, [form, rows])

  return (
    <EditableTableAlt
      readOnly
      disableHeader
      startRowNumber={rows.length + 1}
      columnDefs={columns}
      form={footerForm}
      name="childs"
      className="!border-none"
      divProps={{ className: 'w-min', style: { overflow: 'visible' } }}
    />
  )
}

// const DemoPage = () => {
//   const triggerRef = useRef<HTMLElement>(null)

//   console.log(triggerRef.current)

//   return (
//     <div>
//       {/* <MenuTrigger
//         isOpen={dropdownToggle.isOpen}
//         onOpenChange={dropdownToggle.toggle}
//       >
//         <Button onPress={dropdownToggle.open}>Open</Button>
//         <MenuPopover>
//           <Menu>
//             <MenuItem
//               onAction={() => {
//                 console.log('clicked')
//               }}
//             >
//               One
//             </MenuItem>
//             <MenuItem>Two</MenuItem>
//           </Menu>
//         </MenuPopover>
//       </MenuTrigger> */}

//       <PopoverTrigger>
//         <Button>Open</Button>
//         <Popover scrollRef={triggerRef}>
//           <Dialog>
//             <h1>content</h1>
//           </Dialog>
//         </Popover>
//       </PopoverTrigger>
//     </div>
//   )
// }

// export default DemoPage
