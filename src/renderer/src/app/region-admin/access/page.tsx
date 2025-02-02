import { useEffect } from 'react'

import { roleColumns, roleQueryKeys, roleService } from '@renderer/app/super-admin/role'
import { useQuery } from '@tanstack/react-query'

import { GenericTable } from '@/common/components'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { AccessDialog } from './dialog'
import { useRoleId } from './hooks'

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
        onOpenChange={toggle.setOpen}
      />
      <GenericTable
        columnDefs={roleColumns}
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
