import { LoadingSpinner } from './loading'

export const LoadingOverlay = () => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-50 bg-white/70 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
