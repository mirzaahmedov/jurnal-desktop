import type { ColumnDef, HeaderColumnDef } from './interfaces'

const columns: ColumnDef[] = [
  {
    key: 'name',
    columns: []
  },
  {
    key: 'address',
    columns: [
      {
        key: 'street'
      },
      {
        key: 'house'
      }
    ]
  }
]

const main = () => {
  const groups = getHeaderGroups(columns)
  console.log({ groups })
}

main()
