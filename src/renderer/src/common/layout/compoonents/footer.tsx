import { Reload } from '@/common/components/reload'
import { Downloads } from '@/common/features/downloads-manager'
import { InternetStatus } from '@/common/features/internet-status'

export const Footer = () => {
  return (
    <footer className="flex items-center justify-end  border-t [&>*]:border-l">
      <InternetStatus />
      <Downloads />
      <Reload />
    </footer>
  )
}
