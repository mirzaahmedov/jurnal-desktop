import { Reload } from '@/common/components/reload'
import { Downloads } from '@/common/features/downloads-manager'

export const Footer = () => {
  return (
    <footer className="flex items-center justify-end  border-t [&>*]:border-l">
      <Downloads />
      <Reload />
    </footer>
  )
}
