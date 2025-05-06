import { InternetStatus, VPNStatus } from '@/common/features/network'

export const Footer = () => {
  return (
    <footer className="flex items-center justify-end divide-x border-t">
      <InternetStatus />
      <VPNStatus />
    </footer>
  )
}
