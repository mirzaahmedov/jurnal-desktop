import { DateField, DateInput, DateSegment, I18nProvider, Label } from 'react-aria-components'

import { Select } from './components/select'

const DateInputField = () => {
  return (
    <DateField>
      <Label>Birth date</Label>
      <DateInput>
        {(segment) => (
          <DateSegment
            segment={segment}
            className="focus:bg-brand focus:text-white focus:outline-none"
          />
        )}
      </DateInput>
    </DateField>
  )
}

const DemoPage = () => {
  return (
    <div className="flex-1 w-full h-full p-10">
      <I18nProvider locale="ru-RU">
        <Select />
        <DateInputField />
      </I18nProvider>
    </div>
  )
}

export default DemoPage
