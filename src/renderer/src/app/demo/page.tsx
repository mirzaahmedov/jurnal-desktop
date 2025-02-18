import { ErrorBoundary } from 'react-error-boundary'

import { DemoShartnomaGrafik } from './shartnoma/Demo'

const DemoPage = () => {
  return (
    <div className="flex-1 w-full h-full">
      <ErrorBoundary
        onError={console.log}
        fallback="error"
      >
        <DemoShartnomaGrafik />
      </ErrorBoundary>
    </div>
  )
}

export default DemoPage
