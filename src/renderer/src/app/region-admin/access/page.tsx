import { roleColumns, roleQueryKeys, roleService } from '@renderer/app/super-admin/role'

import { AccessDialog } from './dialog'
import { GenericTable } from '@/common/components'
import { useEffect } from 'react'
import { useLayout } from '@/common/features/layout'
import { useQuery } from '@tanstack/react-query'
import { useRoleId } from './hooks'
import { useToggle } from '@/common/hooks/use-toggle'

const AccessPage = () => {
  const [roleId, setRoleId] = useRoleId()

  const toggle = useToggle()

  const { data: roleList } = useQuery({
    queryKey: [roleQueryKeys.getAll],
    queryFn: roleService.getAll
  })

  useLayout({
    title: 'Доступ'
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setRoleId(null)
    }
  }, [toggle.isOpen, setRoleId])

  return (
    <>
      <AccessDialog
        roleId={roleId}
        open={toggle.isOpen}
        onOpenChange={toggle.setIsOpen}
      />
      <GenericTable
        columns={roleColumns}
        data={roleList?.data ?? []}
        onEdit={(role) => {
          setRoleId(role.id)
          toggle.open()
        }}
      />
    </>
  )
}

export default AccessPage
