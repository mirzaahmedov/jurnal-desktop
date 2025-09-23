import { useState } from 'react'

import { NumericInput } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { formatNumber } from '@/common/lib/format'

const DemoPage = () => {
  const [value, setValue] = useState<number>(432.12333399393)
  console.log('value', value)

  return (
    <div className="flex-1">
      <Button
        onPress={() => {
          setValue(123456789.1234567)
        }}
      >
        Set Value
      </Button>
      <NumericInput
        value={value}
        title={formatNumber(value, 10, 10)}
        onValueChange={(values) => {
          setValue(values.floatValue ?? 0)
        }}
      />
    </div>
  )
}

export default DemoPage
