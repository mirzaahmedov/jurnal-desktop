import { Downloads } from '@/common/features/downloads-manager'
import { InternetStatus, VPNStatus } from '@/common/features/network'

export const Footer = () => {
  return (
    <footer className="flex items-center justify-end  border-t [&>*]:border-l">
      <InternetStatus />
      <VPNStatus />
      <Downloads />
    </footer>
  )
}
