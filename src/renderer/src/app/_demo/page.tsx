import { formatDate } from '@renderer/common/lib/date'

import { useOstatokStore } from '../jur-7/ostatok/store'

const DemoPage = () => {
  const { queuedMonths, enqueueMonth } = useOstatokStore()

  return (
    <div className="flex-1 w-full h-full">
      <ul>
        {queuedMonths.map((m) => (
          <li key={`${m.year}-${m.month}`}>{formatDate(new Date(m.year, m.month))}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const year = Number(formData.get('year'))
          const month = Number(formData.get('month'))

          enqueueMonth({
            year,
            month
          })
        }}
      >
        <input
          type="number"
          name="year"
        />
        <input
          type="number"
          name="month"
        />
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default DemoPage
