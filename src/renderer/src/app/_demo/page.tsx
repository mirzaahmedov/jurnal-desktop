import { useState } from 'react'

const DemoPage = () => {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="flex-1 w-full h-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          console.log('onChange', e.target.value)
          setInputValue(e.target.value)
        }}
      />

      <button
        onClick={() => {
          setInputValue('hello')
        }}
      >
        set hello
      </button>
      <button
        onClick={() => {
          setInputValue('world')
        }}
      >
        set world
      </button>
    </div>
  )
}

export default DemoPage
