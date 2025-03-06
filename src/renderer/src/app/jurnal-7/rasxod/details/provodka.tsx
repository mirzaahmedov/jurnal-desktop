import type { UseFormReturn } from "react-hook-form"
import type { RasxodChildFormValues, RasxodFormValues } from "../config"
import { getCoreRowModel, useReactTable, type  ColumnDef } from '@tanstack/react-table'

type ProvodkaProps = {
  form: UseFormReturn<RasxodFormValues>
  tabIndex: number
}
export const Provodka = ({ form, tabIndex }: ProvodkaProps) => {
  const { } = useReactTable({
    columns,
    getCoreRowModel: getCoreRowModel(),
    data: []
  })
  return (
    
  )
}

const columns: ColumnDef<RasxodChildFormValues>[] = [
  {
    accessorKey: "naimenovanie_tovarov_jur7_id",
  },
  {
    accessorKey: "group_number",
  },
  {
    accessorKey: "name",
  },
  {
    id: "debet",
    columns: [
      {
        accessorKey: "debet_schet"
      },
      {
        accessorKey: "debet_sub_schet"
      }
    ]
  }
]